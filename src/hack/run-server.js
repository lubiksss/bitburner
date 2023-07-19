import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  const TARGET_SERVER_SIZE = 2048

  const serverCost = ns.getPurchasedServerCost(TARGET_SERVER_SIZE)
  let myMoney = ns.getServerMoneyAvailable('home')
  let cnt = 0

  while (true) {
    if (cnt > 25) {
      break
    }
    if (myMoney >= serverCost) {
      const serverName = ns.purchaseServer(`jake${cnt++}`, TARGET_SERVER_SIZE)
      logger.info(`Purchase server: ${serverName}`)
    }
    myMoney = ns.getServerMoneyAvailable('home')
    await ns.sleep(500)
  }
  logger.info(`End server purchase process`)
}