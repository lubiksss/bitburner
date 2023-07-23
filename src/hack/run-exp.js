import {Logger} from "/src/utils/logger";
import {getAvailableServers, scanAll} from "/src/utils/scan";
import {formatTime} from "/src/utils/formatter";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog('ALL')
  const TARGET_HACK_LEVEL = ns.args[0]
  ns.tprint(`Target hack level: ${TARGET_HACK_LEVEL}`)
  const ROOT_SRC = '/src/hack/basic'
  const EXP_FARM = 'joesguns'

  const logger = new Logger(ns)

  const servers = scanAll(ns)
  const neededRamToExp = ns.getScriptRam(`${ROOT_SRC}/weaken.js`)
  const neededRamToShare = ns.getScriptRam(`${ROOT_SRC}/share.js`)
  let myHackingLevel = ns.getHackingLevel()
  const weakenTime = ns.getWeakenTime(EXP_FARM)

  const eachServerRamUsageQue = Array(100).fill(Array(10).fill(1))

  while (TARGET_HACK_LEVEL > myHackingLevel) {
    const availableServers = getAvailableServers(ns, servers)
      .filter(s => !s.includes('home'))
      .filter(s => ns.getServerMaxRam(s) > 0)
    myHackingLevel = ns.getHackingLevel()

    for (let i = 0; i < availableServers.length; i++) {

      const availableServer = availableServers[i]
      const serverRam = ns.getServerMaxRam(availableServer)
      const usedRam = ns.getServerUsedRam(availableServer)
      const ramUsage = usedRam / serverRam

      eachServerRamUsageQue[i].shift()
      eachServerRamUsageQue[i].push(ramUsage)

      const avgServerRamUsage = eachServerRamUsageQue[i].reduce((a, b) => a + b, 0) / eachServerRamUsageQue[i].length

      if (avgServerRamUsage === 0) {
        const availableRam = serverRam - usedRam
        const threadCnt = Math.floor(availableRam / (neededRamToExp + neededRamToShare))
        if (availableRam >= (neededRamToExp + neededRamToShare)) {
          ns.exec(`${ROOT_SRC}/weaken.js`, availableServer, threadCnt, EXP_FARM)
          logger.mon(`[${availableServer}] [${threadCnt}t] [${formatTime(weakenTime)}s]`)
          ns.exec(`${ROOT_SRC}/share.js`, availableServer, threadCnt)
          logger.mon(`[${availableServer}] [${threadCnt}t] [share]`)
        }
      }
      await ns.sleep(300)
    }
  }
  logger.info(`End exp process`)
}
