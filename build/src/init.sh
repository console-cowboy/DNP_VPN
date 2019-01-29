#!/bin/bash

# Check in db if node has a static IP, use dynamic DNS domain instead.
VPNHOSTNAME=${PUBLIC_ENDPOINT}
echo "init.sh received PUBLIC_ENDPOINT $PUBLIC_ENDPOINT"

# Initialize config and PKI 
# -c: Client to Client
# -d: disable default route (disables NAT without '-N')
# -p "route 172.33.0.0 255.255.0.0": Route to push to the client

if [ ! -e "${OPENVPN_CONF}" ]; then
    ovpn_genconfig -c -d -u udp://${VPNHOSTNAME} -s 172.33.8.0/22 \
    -p "route 172.33.0.0 255.255.0.0" \
    -n "172.33.1.2"
    EASYRSA_REQ_CN=${VPNHOSTNAME} ovpn_initpki nopass
fi

# Create admin user
if [ ! -e "${OPENVPN_ADMIN_PROFILE}" ]; then
    vpncli add ${DEFAULT_ADMIN_USER}
    vpncli get ${DEFAULT_ADMIN_USER}
    echo "ifconfig-push 172.33.10.20 172.33.10.254" > ${OPENVPN_CCD_DIR}/${DEFAULT_ADMIN_USER}
fi

# Enable Proxy ARP (needs privileges)
echo 1 > /proc/sys/net/ipv4/conf/eth0/proxy_arp

# Migrate users from v1
/usr/local/bin/migrate_v2

# Save environment
env | sed '/affinity/d' > /etc/env.sh

/usr/local/bin/ovpn_run
