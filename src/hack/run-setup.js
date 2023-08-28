import {getItems, scanAll, setScript, setUp} from "/src/utils/scan";
import {Logger} from "/src/utils/logger";
import {buyDefaultHomeRam, buyProgram} from "/src/utils/singularity";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)
  const ROOT_SRC = '/src/hack'
  const SLUM_TASK = 'Homicide'

  const servers = scanAll(ns)
  setScript(ns, servers)

  ns.singularity.commitCrime(SLUM_TASK)

  while (true) {
    buyDefaultHomeRam(ns)
    buyProgram(ns)
    const purchasedServers = ns.getPurchasedServers()
    setScript(ns, purchasedServers)
    getItems(ns, servers)
    setUp(ns, servers, logger)
    await ns.sleep(5000)
  }
  // logger.info(`End setup process`)
}