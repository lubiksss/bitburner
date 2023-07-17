import {Logger} from "/src/utils/logger";
import {scanAll} from "/src/hack/scan";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = '/src/hack'
  const EXTRA_HOME_RAM = 5
  const logger = new Logger(ns)

  const servers = scanAll(ns)
  const neededRamToHack = ns.getScriptRam(`${ROOT_SRC}/hack.js`)

  while (true) {
    const rootedServers = servers.filter((server) => ns.hasRootAccess(server))
    const hackableServers = rootedServers.filter((server) => {
      const myHackingLevel = ns.getHackingLevel()
      const serverHackingLevel = ns.getServerRequiredHackingLevel(server)
      return myHackingLevel >= serverHackingLevel
    })

    for (const targetServer of hackableServers) {
      for (const rootedServer of rootedServers.concat("home")) {
        const serverRam = ns.getServerMaxRam(rootedServer)
        const usedRam = ns.getServerUsedRam(rootedServer)
        const availableRam = rootedServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam
        if (availableRam >= neededRamToHack) {
          ns.exec(`${ROOT_SRC}/hack.js`, rootedServer, 1, targetServer)
          logger.info(`Hack ${targetServer}`)
          break
        } else {
          //go to next rooted server
        }
      }
    }
    await ns.sleep(1000)
  }
}
