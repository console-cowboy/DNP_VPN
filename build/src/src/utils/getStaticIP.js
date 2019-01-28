const getInstallationStaticIp = require('./getInstallationStaticIp');
const db = require('../db');
const logs = require('../logs.js')(module);

// Get ip (maybe) set during the installation
// ==================================================
// > Only write the IP if it comes from the installation

async function getStaticIp() {
    if (await db.get('initialized')) {
        return await db.get('staticIp');
    } else {
        const staticIp = await getInstallationStaticIp();
        await db.set('staticIp', staticIp);
        await db.set('initialized', true);
        logs.info(`Static IP on installation was ${staticIp ? `set to ${staticIp}` : `NOT set`}`);
        return staticIp;
    }
}

module.exports = getStaticIp;
