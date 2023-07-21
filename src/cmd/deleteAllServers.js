/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const targets = ns.getPurchasedServers()
  targets.forEach((target) => {
    ns.deleteServer(target)
  })
}
