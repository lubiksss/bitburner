import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  let TARGET_SERVER_SIZE = 2048
  let MAX_TARGET_SERVER_SIZE = 8192

  let cnt = 0
  let isFirstPurchase = true

  while (true) {
    if (cnt > 24) {
      if (TARGET_SERVER_SIZE > MAX_TARGET_SERVER_SIZE) {
        break
      }
      TARGET_SERVER_SIZE = TARGET_SERVER_SIZE * 2
      cnt = 0
      isFirstPurchase = false
    } else {
      if (isFirstPurchase) {
        const serverName = ns.purchaseServer(`jake-${cnt++}-${TARGET_SERVER_SIZE}`, TARGET_SERVER_SIZE)
        if (serverName === '') {
          //nothing
        } else {
          logger.info(`Purchase server: ${serverName}`)
        }
      } else {
        const isUpgraded = ns.upgradePurchasedServer(`jake-${cnt++}-${TARGET_SERVER_SIZE / 2}`, TARGET_SERVER_SIZE)
        const serverName = `jake-${cnt}-${TARGET_SERVER_SIZE}`
        if (isUpgraded === true) {
          logger.info(`Upgrade server: ${serverName}`)
        } else {
          //nothing
        }
      }
    }
    await ns.sleep(500)
  }
  logger.info(`End server purchase process`)
}