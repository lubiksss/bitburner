import {Logger} from "/src/utils/logger";
import {scanAll} from "/src/hack/scan";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = '/src/hack'
  const logger = new Logger(ns)

  const servers = scanAll(ns)
  const neededRamToHack = ns.getScriptRam(`${ROOT_SRC}/hack.js`)

  while (true) {
    const Rooted = servers.filter((server) => ns.hasRootAccess(server))
    const hackable = Rooted.filter((server) => {
      const myHackingLevel = ns.getHackingLevel()
      const serverHackingLevel = ns.getServerRequiredHackingLevel(server)
      return myHackingLevel >= serverHackingLevel
    })

    for (const targetServer of hackable) {
      const serverRam = ns.getServerMaxRam("home")
      const usedRam = ns.getServerUsedRam("home")
      const availableRam = serverRam - usedRam
      if (availableRam >= neededRamToHack) {
        ns.exec(`${ROOT_SRC}/hack.js`, "home", 1, targetServer)
        logger.info(`Hack ${targetServer}`)
      } else {
        //
      }
    }
    await ns.sleep(1000)
  }
}
