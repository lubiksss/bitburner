import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import("../hack").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  const purchasedServer = ns.getPurchasedServers()
  ns.tprint(purchasedServer)
  for (const server of purchasedServer) {
    ns.killall(server)
    ns.deleteServer(server)
    ns.tprint(`Delete server: ${server}`)
  }
}