import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  let TARGET_SERVER_SIZE = 256
  let MAX_TARGET_SERVER_SIZE = 8192 * 2

  while (true) {
    const purchasedServer = ns.getPurchasedServers()

    if (purchasedServer.length < 25) {
      //buy process
      const cnt = purchasedServer.length
      const serverName = `jake-${cnt}-${TARGET_SERVER_SIZE}`
      const isPurchased = ns.purchaseServer(serverName, TARGET_SERVER_SIZE)
      if (isPurchased !== '') {
        logger.info(`Purchase server: ${serverName}`)
      }
    } else {
      //upgrade process
      const sortedPurchasedServer = sortByLastNumber(purchasedServer)
      const targetServer = sortedPurchasedServer.find((server) => ns.getServerMaxRam(server) < MAX_TARGET_SERVER_SIZE)
      if (targetServer === undefined) {
        break
      }
      const currentSize = ns.getServerMaxRam(targetServer)
      const isUpgraded = ns.upgradePurchasedServer(targetServer, currentSize * 2)
      if (isUpgraded) {
        const newName = targetServer.replace(`${currentSize}`, `${currentSize * 2}`)
        ns.renamePurchasedServer(targetServer, newName)
        logger.info(`Upgrade server: ${newName}`)
      }
    }
    await ns.sleep(100)
  }
  logger.info(`End server purchase process`)
}

function sortByLastNumber(inputArray) {
  // Custom sorting function based on the last number of each element
  function compareLastNumbers(a, b) {
    const lastNumberA = parseInt(a.split('-').pop());
    const lastNumberB = parseInt(b.split('-').pop());

    return lastNumberA - lastNumberB;
  }

  // Sort the input array using the custom sorting function
  return inputArray.sort(compareLastNumbers);
}