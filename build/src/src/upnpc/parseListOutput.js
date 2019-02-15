const parseGeneralErrors = require('./parseGeneralErrors');
const validateKwargs = require('../utils/validateKwargs');

/* eslint-disable max-len */

// SUCCESSFUL

// dappnode@machine:/usr/src/dappnode/DNCORE$ docker run --rm --net=host ${IMAGE} upnpc -e DAppNode -l
// upnpc : miniupnpc library test client, version 2.0.
//  (c) 2005-2017 Thomas Bernard.
// Go to http://miniupnp.free.fr/ or https://miniupnp.tuxfamily.org/
// for more information.
// List of UPNP devices found on the network :
//  desc: http://192.168.1.1:5001/dyn/uuid:0011-0011-0011-0011
//  st: urn:schemas-upnp-org:device:InternetGatewayDevice:1
//
// Found valid IGD : http://192.168.1.1:5001/uuid:0011-0011-0011-0011/WANPPPConnection:1
// Local LAN ip address : 192.168.1.01
// Connection Type : IP_Routed
// Status : Connected, uptime=1360425s, LastConnectionError :
//   Time started : Tue Feb 31 00:00:01 2018
// MaxBitRateDown : 0 bps   MaxBitRateUp 0 bps
// ExternalIPAddress = 85.84.83.82
//  i protocol exPort->inAddr:inPort description remoteHost leaseTime
//  0 UDP  1194->192.168.1.42:1194  'DAppNode' '' 0
//  1 TCP    22->192.168.1.42:22    'DAppNode' '' 0
//  2 UDP 30303->192.168.1.42:30303 'DAppNode' '' 0
//  3 TCP 30303->192.168.1.42:30303 'DAppNode' '' 0
//  4 TCP  4001->192.168.1.42:4001  'DAppNode' '' 0
//  5 UDP  4002->192.168.1.42:4002  'DAppNode' '' 0
//  6 TCP 32000->192.168.1.52:32000 'otherApp (TCP)' '' 0
//  7 UDP 32000->192.168.1.52:32000 'otherApp (UDP)' '' 0
// GetGenericPortMappingEntry() returned 713 (SpecifiedArrayIndexInvalid)

// ERROR: no UPnP device found

// root@lionDAppnode:/usr/src/dappnode/DNCORE# docker run --rm --net=host ${IMAGE} upnpc -s
// upnpc : miniupnpc library test client, version 2.0.
//  (c) 2005-2017 Thomas Bernard.
// Go to http://miniupnp.free.fr/ or https://miniupnp.tuxfamily.org/
// for more information.
// No IGD UPnP Device found on the network !

/**
 *
 * @param {String} terminalOutput A sample can be found above
 * @return {Array} port mappings = [
 *   {protocol: 'UDP', exPort: '1194', inPort: '1194'},
 *   {protocol: 'UDP', exPort: '30303', inPort: '30303'},
 *   {protocol: 'TCP', exPort: '30303', inPort: '30303'},
 * ]
 */
function parseListOutput(terminalOutput) {
    validateKwargs({terminalOutput});
    parseGeneralErrors(terminalOutput);

    // 1. Cut to the start of the table
    const validLineRegex = RegExp(/\d+\s+(UDP|TCP)\s+\d+->(\d+\.){3}\d+:\d+\s+.DAppNode/);
    return terminalOutput.trim().split(/\r?\n/)
    // Filter by lines that have the table format above
    .filter((line) =>
        line && typeof line === 'string' && validLineRegex.test(line)
    )
    // Parse the line to extract the protocol and port mapping
    .map((line) => {
        const [, protocol, mapping] = line.trim().split(/\s+/);
        const exPort = mapping.split('->')[0];
        const [, inPort] = (mapping.split('->')[1] || '').split(':');
        return {protocol, exPort, inPort};
    })
    // Make sure that the result is correct, otherwise remove it
    .filter(({protocol, exPort, inPort}) =>
        (protocol === 'UDP' || protocol === 'TCP') && !isNaN(exPort) && !isNaN(inPort)
    );
}

module.exports = parseListOutput;

