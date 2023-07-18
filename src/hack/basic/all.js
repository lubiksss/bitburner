/** @param {NS} ns */
/** @param {import("../index").NS } ns */
export async function main(ns) {
  const targetServer = ns.args[0]
  await ns.grow(targetServer)
  await ns.weaken(targetServer)
  await ns.hack(targetServer)
}
