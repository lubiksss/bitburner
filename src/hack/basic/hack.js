/** @param {NS} ns */
/** @param {import("../index").NS } ns */
export async function main(ns) {
  const targetServer = ns.args[0]

  if (ns.args.length > 1) {
    const sleepTime = ns.args[1]
    await ns.sleep(sleepTime)
  }

  await ns.hack(targetServer)
}
