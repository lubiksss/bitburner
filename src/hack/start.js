/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
    const ROOT_SRC = "src/hack";

    const targetServers = ns.scan();

    ns.killall();

    for (const targetServer of targetServers) {
        const isRooted = ns.hasRootAccess(targetServer);
        if (isRooted) {
            ns.run(`${ROOT_SRC}/simple-hack.js`, 1, targetServer);
            ns.tprint(`${targetServer} o`)
        } else {
            ns.tprint(`${targetServer} x`)
        }
    }
}
