/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
    const targetServer = ns.args[0]
    ns.print(targetServer)
    while (true) {
        await ns.grow(targetServer);
        await ns.weaken(targetServer);
        await ns.hack(targetServer);
    }
}
