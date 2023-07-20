import {Logger} from "/src/utils/logger";
import {floor} from "/src/utils/formatter";
import {getAvailableServers, scanAll} from "/src/utils/scan";

/** @param {NS} ns */
/** @param {import("./index").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  const EXTRA_HOME_RAM = ns.args[0]
  const ROOT_SRC = "/src/hack/basic"
  const SHARE_SCRIPT_RAM = ns.getScriptRam(`${ROOT_SRC}/share.js`)

  const servers = scanAll(ns)

  while (true) {
    const availableServers = getAvailableServers(ns, servers)
    for (const availableServer of availableServers) {
      const serverRam = ns.getServerMaxRam(availableServer)
      const usedRam = ns.getServerUsedRam(availableServer)
      const availableRam = availableServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam
      const availableThreads = floor(availableRam / SHARE_SCRIPT_RAM)

      if (availableRam < SHARE_SCRIPT_RAM) {
        //nothing
      } else {
        ns.exec(`${ROOT_SRC}/share.js`, availableServer, availableThreads)
      }
    }
    await ns.sleep(2000)
  }
}