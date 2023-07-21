/** @param {NS} ns */
/** @param {import("../hack").NS } ns */
export async function main(ns) {
  const servers = ns.getPurchasedServers()
  ns.tprint(servers)
  ns.tprint(ns.getServerMaxRam('jake1'))
  ns.tprint(ns.getServerMaxRam('jake1-0'))
  ns.tprint(ns.getServerMaxRam('jake'))

  ns.renamePurchasedServer('jake1', 'jake-0-8192')
  ns.renamePurchasedServer('jake1-0', 'jake-1-32')
  ns.renamePurchasedServer('jake', 'jake-2-256')
}