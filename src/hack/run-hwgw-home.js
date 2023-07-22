import {Logger} from "/src/utils/logger";
import {getAvailableServerThreads, getHackableServers, scanAll} from "/src/utils/scan";
import {ceil, floor} from "/src/utils/formatter";
import {availableHwgw} from "/src/utils/hwgw";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog('ALL')
  const logger = new Logger(ns)


  const ROOT_SRC = '/src/hack/basic'

  //it works properly at least INTERVAL_TIME > 100
  const INTERVAL_TIME = 100
  const GROW_SEC_MULTIPLIER = 0.004
  const WEAKEN_SEC_MULTIPLIER = 0.05
  const HACK_MONEY_MULTIPLIER = 0.9
  const SCRIPT_RAM = 1.75

  const servers = scanAll(ns)
  while (true) {
    const EXTRA_HOME_RAM = Math.max(5, ns.getServerMaxRam('home') * 0.05)
    const CPU_CORE = ns.getServer("home").cpuCores
    const hackableServers = getHackableServers(ns, servers)
    const availableServers = ["home"]

    for (const targetServer of hackableServers) {

      const hackTime = ns.getHackTime(targetServer)
      const growTime = ns.getGrowTime(targetServer)
      const weakenTime = ns.getWeakenTime(targetServer)
      ns.getHackingMultipliers()

      const currentMoney = ns.getServerMoneyAvailable(targetServer)
      const targetMoney = currentMoney * HACK_MONEY_MULTIPLIER
      const hackThread = ns.hackAnalyzeThreads(targetServer, targetMoney)
      const hackChance = ns.hackAnalyzeChance(targetServer)
      const hackThreadChanceMax = ceil(hackThread / hackChance)
      const aroseSecByHack = ns.hackAnalyzeSecurity(hackThreadChanceMax, targetServer)

      const minSecurityLevel = ns.getServerMinSecurityLevel(targetServer)
      const securityLevelAfterHack = ns.getServerSecurityLevel(targetServer) + aroseSecByHack
      const weakenThreadAfterHack = ceil((securityLevelAfterHack - minSecurityLevel) / WEAKEN_SEC_MULTIPLIER)

      const maxMoney = ns.getServerMaxMoney(targetServer)
      const moneyAfterHack = 1
      if (maxMoney === 0) {
        continue
      }
      const growthThread = ceil(ns.growthAnalyze(targetServer, maxMoney / moneyAfterHack, CPU_CORE))
      // ns.growthAnalyzeSecurity() function has a bug
      // const aroseSecByGrowth = ns.growthAnalyzeSecurity(1, targetServer)
      const aroseSecByGrowth = growthThread * GROW_SEC_MULTIPLIER

      const securityLevelAfterGrow = ns.getServerSecurityLevel(targetServer) + aroseSecByGrowth
      const weakenThreadAfterGrow = ceil((securityLevelAfterGrow - minSecurityLevel) / WEAKEN_SEC_MULTIPLIER)

      let hwgw = [hackThreadChanceMax, weakenThreadAfterHack, growthThread, weakenThreadAfterGrow]

      const neededThreads = hwgw.reduce((a, b) => a + b, 0)
      const availableServerThreads = getAvailableServerThreads(ns, availableServers, SCRIPT_RAM, EXTRA_HOME_RAM)

      if (availableServerThreads >= neededThreads) {
        logger.mon(`[${targetServer}] [${hwgw}] [${neededThreads}/${availableServerThreads}]`)
        for (const availableServer of availableServers) {
          if (hwgw.reduce((a, b) => a + b, 0) === 0) {
            break
          }
          const serverRam = ns.getServerMaxRam(availableServer)
          const usedRam = ns.getServerUsedRam(availableServer)
          const availableRam = availableServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam
          const availableThreads = floor(availableRam / SCRIPT_RAM)

          const availableTask = availableHwgw(hwgw, availableThreads)[0]

          availableTask.map((threadCnt, i) => {
            if (i === 0) {
              if (threadCnt !== 0) {
                const delayHack = weakenTime - INTERVAL_TIME - hackTime
                ns.exec(`${ROOT_SRC}/hack.js`, availableServer, threadCnt, targetServer, delayHack)
                // logger.info("hack")
              }
            } else if (i === 1) {
              if (threadCnt !== 0) {
                const delayFirstWeak = 0
                ns.exec(`${ROOT_SRC}/weaken.js`, availableServer, threadCnt, targetServer, delayFirstWeak)
                // logger.info("weak hack")
              }
            } else if (i === 2) {
              if (threadCnt !== 0) {
                const delayGrow = weakenTime + INTERVAL_TIME - growTime
                ns.exec(`${ROOT_SRC}/grow.js`, availableServer, threadCnt, targetServer, delayGrow)
                // logger.info("grow")
              }
            } else if (i === 3) {
              if (threadCnt !== 0) {
                const delaySecondWeak = 2 * INTERVAL_TIME
                ns.exec(`${ROOT_SRC}/weaken.js`, availableServer, threadCnt, targetServer, delaySecondWeak)
                // logger.info("weak grow")
              }
            }
          })
          hwgw = availableHwgw(hwgw, availableThreads)[1]
        }
      }
      await ns.sleep(5 * INTERVAL_TIME)
    }
  }
}
