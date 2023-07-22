/** @param {NS} ns */
/** @param {import("../hack").NS } ns */

export async function main(ns) {
  const foo = ns.getServer("home").cpuCores
  while (true) {
    const data = ns.readPort(1)
    ns.clearPort(1)
    ns.tprint(data)
    await ns.sleep(1000)
  }
}

