import {Logger} from "/src/utils/logger";
import {scanAll} from "/src/utils/scan";
import {formatTime} from "/src/utils/formatter";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog('ALL')
  const EXTRA_HOME_RAM = ns.args[0]
  const TARGET_HACK_LEVEL = ns.args[1]
  ns.tprint(`Target hack level: ${TARGET_HACK_LEVEL}`)
  const ROOT_SRC = '/src/hack/basic'
  const EXP_FARM = 'joesguns'

  const logger = new Logger(ns)

  const servers = scanAll(ns)
  const neededRamToExp = ns.getScriptRam(`${ROOT_SRC}/weaken.js`)
  let myHackingLevel = ns.getHackingLevel()
  const weakenTime = ns.getWeakenTime(EXP_FARM)

  await ns.sleep(10000)

  while (TARGET_HACK_LEVEL > myHackingLevel) {
    myHackingLevel = ns.getHackingLevel()

    const rootedServers = servers.filter((server) => ns.hasRootAccess(server))

    const myServers = ns.getPurchasedServers()
    const availableServers = rootedServers.concat(myServers).concat('home')
      .filter((server) => {
        return ns.getServerUsedRam(server) === 0
      })

    for (const availableServer of availableServers) {
      const serverRam = ns.getServerMaxRam(availableServer)
      const usedRam = ns.getServerUsedRam(availableServer)
      const availableRam = availableServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam
      const threadCnt = Math.floor(availableRam / neededRamToExp)
      if (availableRam >= neededRamToExp) {
        const result = ns.exec(`${ROOT_SRC}/weaken.js`, availableServer, threadCnt, EXP_FARM)
        logger.mon(`[${EXP_FARM}] [${threadCnt}t] [${formatTime(weakenTime)}s]`)
      }
    }
    await ns.sleep(100)
  }
  logger.info(`End exp process`)
}
