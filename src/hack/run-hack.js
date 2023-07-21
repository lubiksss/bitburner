import {Logger} from "/src/utils/logger";
import {getAvailableServers, getHackableServers, scanAll} from "/src/utils/scan";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = '/src/hack/basic'
  const EXTRA_HOME_RAM = ns.args[0]
  const logger = new Logger(ns)

  const servers = scanAll(ns)
  const neededRamToHack = ns.getScriptRam(`${ROOT_SRC}/all.js`)

  while (true) {
    const hackableServers = getHackableServers(ns, servers)
    const availableServers = getAvailableServers(ns, servers)

    for (const targetServer of hackableServers) {
      for (const availableServer of availableServers) {
        const serverRam = ns.getServerMaxRam(availableServer)
        const usedRam = ns.getServerUsedRam(availableServer)
        const availableRam = availableServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam
        if (availableRam >= neededRamToHack) {
          const result = ns.exec(`${ROOT_SRC}/all.js`, availableServer, 1, targetServer)
          if (result === 0) {
            continue
          }
          // logger.info(`Hack ${targetServer}`)
          break
        } else {
          //go to next rooted server
        }
      }
      await ns.sleep(50)
    }
    await ns.sleep(10)
  }
}
