import {Logger} from "/src/utils/logger";
import {getAvailableServers, getHackableServers, scanAll} from "/src/utils/scan";
import {formatMoney} from "src/utils/formatter";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL")
  const ROOT_SRC = '/src/hack/basic'
  const EXTRA_HOME_RAM = ns.args[0]
  const HACK_RATIO = 0.01
  const logger = new Logger(ns)

  const servers = scanAll(ns)
  const neededRamToHack = ns.getScriptRam(`${ROOT_SRC}/hack.js`)

  let isThereMoneyToHack = true
  let serverMaxMoney = 1
  let serverAvailableMoney = 0

  while (isThereMoneyToHack) {
    const hackableServers = getHackableServers(ns, servers)
    const availableServers = getAvailableServers(ns, servers)

    for (const targetServer of hackableServers) {
      for (const availableServer of availableServers) {
        const serverRam = ns.getServerMaxRam(availableServer)
        const usedRam = ns.getServerUsedRam(availableServer)
        const availableRam = availableServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam
        const availableThreads = Math.floor(availableRam / neededRamToHack)

        const isAvailable = ns.getServerMaxMoney(targetServer) * HACK_RATIO < ns.getServerMoneyAvailable(targetServer)

        if (availableRam >= neededRamToHack && isAvailable) {
          const result = ns.exec(`${ROOT_SRC}/hack.js`, availableServer, availableThreads, targetServer)
          if (result === 0) {
            continue
          }
          // logger.info(`Hack ${targetServer}`)
          break
        } else {
          // nothing
        }
      }
    }
    isThereMoneyToHack = hackableServers
      .map(server => ns.getServerMaxMoney(server) * HACK_RATIO < ns.getServerMoneyAvailable(server))
      .some(is => is)
    serverMaxMoney = hackableServers
      .map(server => ns.getServerMaxMoney(server))
      .reduce((a, b) => a + b, 0)
    serverAvailableMoney = hackableServers
      .map(server => ns.getServerMoneyAvailable(server))
      .reduce((a, b) => a + b, 0)

    logger.warn(`${isThereMoneyToHack}: ${formatMoney(serverAvailableMoney)}/${formatMoney(serverMaxMoney)}`)

    await ns.sleep(1000)
  }
  logger.info(`End hack process`)
}
