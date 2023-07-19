import {Logger} from "/src/utils/logger";
import {scanAll} from "/src/utils/scan";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = '/src/hack/basic'
  const EXTRA_HOME_RAM = 5
  const TARGET_HACK_LEVEL = 50
  const EXP_FARM = 'joesguns'

  const logger = new Logger(ns)

  const servers = scanAll(ns)
  const neededRamToExp = ns.getScriptRam(`${ROOT_SRC}/weaken.js`)
  let myHackingLevel = ns.getHackingLevel()

  while (TARGET_HACK_LEVEL > myHackingLevel) {
    myHackingLevel = ns.getHackingLevel()

    const rootedServers = servers.filter((server) => ns.hasRootAccess(server))
    const hackableServers = rootedServers.filter((server) => {
      const myHackingLevel = ns.getHackingLevel()
      const serverHackingLevel = ns.getServerRequiredHackingLevel(server)
      return myHackingLevel >= serverHackingLevel
    })

    const myServers = ns.getPurchasedServers()
    const availableServers = rootedServers.concat(myServers).concat('home')

    for (const availableServer of availableServers) {
      const serverRam = ns.getServerMaxRam(availableServer)
      const usedRam = ns.getServerUsedRam(availableServer)
      const availableRam = availableServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam
      const threadCnt = Math.floor(availableRam / neededRamToExp)
      if (availableRam >= neededRamToExp) {
        const result = ns.exec(`${ROOT_SRC}/weaken.js`, availableServer, threadCnt, EXP_FARM)
        if (result === 0) {
          continue
        }
        // logger.info(`Hack ${EXP_FARM}`)
        break
      } else {
        //go to next rooted server
      }
    }
    await ns.sleep(50)
  }
  logger.info(`End exp process`)
}
