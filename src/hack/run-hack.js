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

    const myServers = ns.getPurchasedServers()
    const availableServers = rootedServers.concat(myServers).concat('home')

    for (const targetServer of hackableServers) {
      for (const availableServer of availableServers) {
        const serverRam = ns.getServerMaxRam(availableServer)
        const usedRam = ns.getServerUsedRam(availableServer)
        const availableRam = availableServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam
        if (availableRam >= neededRamToHack) {
          const result = ns.exec(`${ROOT_SRC}/hack.js`, availableServer, 1, targetServer)
          if (result === 0) {
            continue
          }
          logger.info(`Hack ${targetServer}`)
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
