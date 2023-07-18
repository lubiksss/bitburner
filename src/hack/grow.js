/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const targetServer = ns.args[0]
  await ns.grow(targetServer)
}
