import {Logger} from '/src/utils/logger'

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)
  const servers = scanAll(ns)

  // setUp(ns, servers, logger)
  getItems(ns, servers)
}

export function scanAll(ns) {
  const servers = []
  const explored = []

  const serversAdjacentHome = ns.scan()
  servers.push(...serversAdjacentHome)

  while (servers.length > 0) {
    const server = servers.shift()
    if (explored.includes(server)) {
      continue
    }
    explored.push(server)
    const adjacentServers = ns.scan(server)
    servers.push(...adjacentServers)
  }
  return explored.filter((server) => server !== 'home')
}

/** @param {import(".").NS } ns */
export function getItems(ns, servers) {
  for (const server of servers) {
    const hasLit = ns.ls(server, 'lit').length > 0
    const hasTxt = ns.ls(server, 'txt').length > 0
    const hasCct = ns.ls(server, 'cct').length > 0
    if (hasLit) {
      for (const file of ns.ls(server, 'lit')) {
        ns.scp(file, 'home', server)
      }
    }
    if (hasTxt) {
      for (const file of ns.ls(server, 'txt')) {
        ns.scp(file, 'home', server)
      }
    }
    if (hasCct) {
      for (const file of ns.ls(server, 'cct')) {
        ns.write('cct.txt', `${server}\n`, 'w')
      }
    }
  }
}

/** @param {import(".").NS } ns */
export function setUp(ns, servers, logger) {
  const hasBruteSSH = ns.fileExists('/BruteSSH.exe')
  const hasFTPCrack = ns.fileExists('/FTPCrack.exe')
  const hasRelaySMTP = ns.fileExists('/relaySMTP.exe')
  const hasHTTPWorm = ns.fileExists('/HTTPWorm.exe')
  const hasSQLInject = ns.fileExists('/SQLInject.exe')

  const portCnt = [
    hasBruteSSH,
    hasFTPCrack,
    hasRelaySMTP,
    hasHTTPWorm,
    hasSQLInject,
  ]
    .map((has) => (has ? 1 : 0))
    .reduce((a, b) => a + b, 0)

  for (const server of servers) {
    const isRooted = ns.hasRootAccess(server)
    if (isRooted) {
      continue
    }

    if (hasBruteSSH) {
      ns.brutessh(server)
    }
    if (hasFTPCrack) {
      ns.ftpcrack(server)
    }
    if (hasRelaySMTP) {
      ns.relaysmtp(server)
    }
    if (hasHTTPWorm) {
      ns.httpworm(server)
    }
    if (hasSQLInject) {
      ns.sqlinject(server)
    }

    const requiredPortsCnt =
      ns.getServerNumPortsRequired(server)
    if (portCnt >= requiredPortsCnt) {
      ns.nuke(server)
      logger.info(`Nuke ${server}`)
    } else {
      logger.warn(`Can't nuke ${server}`)
    }
  }
}
