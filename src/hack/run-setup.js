import {getItems, scanAll, setScript, setUp} from "/src/hack/scan";
import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  const servers = scanAll(ns)
  getItems(ns, servers)
  setScript(ns, servers)

  const isAllServerRooted = servers.every((server) => ns.hasRootAccess(server))
  while (!isAllServerRooted) {
    setUp(ns, servers, logger)
    await ns.sleep(5000)
  }
  logger.info(`End setup process`)
}