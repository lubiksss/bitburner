import {Logger} from '/src/utils/logger'
import {getItems, scanAll, setUp} from '/src/hack/scan'

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
    const ROOT_SRC = 'src/hack'

    const logger = new Logger(ns)

    const targetServers = scanAll(ns)

    setUp(ns, targetServers, logger)
    getItems(ns, targetServers)

    const notScriptRunning = targetServers.filter((server) => !ns.isRunning(`${ROOT_SRC}/run-hack.js`, 'home', server,))

    const notRooted = notScriptRunning.filter(
        (server) => !ns.hasRootAccess(server),
    )
    const hackable = notRooted.filter((server) => {
        const myHackingLevel = ns.getHackingLevel()
        const serverHackingLevel = ns.getServerRequiredHackingLevel(server)
        return myHackingLevel >= serverHackingLevel
    })

    for (const targetServer of hackable) {
        ns.run(`${ROOT_SRC}/run-hack.js`, 1, targetServer)
        logger.info(`Hack ${targetServer}`)
    }
}
