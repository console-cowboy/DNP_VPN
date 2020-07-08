import fs from "fs";
import crypto from "crypto";
import { shell, shellArgs } from "../utils/shell";
import { directoryIsEmptyOrEnoent } from "../utils/fs";
import { printEnvironment } from "../utils/env";
import { SALT_PATH, PKI_PATH, PROXY_ARP_PATH } from "../params";

/**
 * Initializes the OpenVPN configuration
 * This function MUST be called before starting the openvpn binary
 */
export async function initalizeOpenVpnConfig({
  hostname,
  internalIp
}: {
  hostname: string;
  internalIp: string;
}) {
  // Check and generate random salt
  if (!fs.existsSync(SALT_PATH)) {
    fs.writeFileSync(SALT_PATH, crypto.randomBytes(32).toString("hex"));
  }

  // Replicate environment used in entrypoint.sh
  const openVpnEnv = {
    ...process.env,
    OVPN_CN: hostname,
    OVPN_INTERNAL_IP: internalIp,
    EASYRSA_REQ_CN: hostname
  };

  // Initialize config and PKI
  // -c: Client to Client
  // -d: disable default route (disables NAT without '-N')
  // -p "route 172.33.0.0 255.255.0.0": Route to push to the client
  // -n "172.33.1.2": DNS server (BIND)
  await shellArgs(
    "ovpn_genconfig",
    {
      c: true,
      d: true,
      u: `udp://"${hostname}"`,
      s: "172.33.8.0/22",
      p: `"route 172.33.0.0 255.255.0.0"`,
      n: `"172.33.1.2"`
    },
    { env: openVpnEnv }
  );

  // Check if PKI is initalized already, if not use hostname as CN
  if (directoryIsEmptyOrEnoent(PKI_PATH))
    await shell("ovpn_initpki nopass", { env: openVpnEnv });

  // Enable Proxy ARP (needs privileges)
  fs.writeFileSync(PROXY_ARP_PATH, "1");

  // Save environment with the path configuration so it's accessible to scripts
  // run by OpenVPN on hooks
  fs.writeFileSync("/etc/env.sh", printEnvironment(openVpnEnv));
}