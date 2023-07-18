import {getItems, scanAll, setScript, setUp} from "/src/utils/scan";
import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  const servers = scanAll(ns)
  setScript(ns, servers)

  const isAllServerRooted = servers.every((server) => ns.hasRootAccess(server))
  while (!isAllServerRooted) {
    const purchasedServers = ns.getPurchasedServers()
    setScript(ns, purchasedServers)
    getItems(ns, servers)
    setUp(ns, servers, logger)
    await ns.sleep(5000)
  }
  logger.info(`End setup process`)
}