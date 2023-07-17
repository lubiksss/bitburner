import {Logger} from '/src/utils/logger'

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)
  const servers = scanAll(ns)

  // setUp(ns, servers, logger)
  // getItems(ns, servers)
  const shortestPaths = howToGetServer(ns);
  ns.tprint(shortestPaths);
}

// Define the function to get the shortest path between two servers
function howToGetServer(ns, startServer = "home") {
  const targetServer = ns.args[0]

  // Helper function to perform BFS
  function bfs(start, target) {
    const queue = [{server: start, path: []}];
    const visited = new Set();

    while (queue.length > 0) {
      const {server, path} = queue.shift();

      // Check if the current server is the target server
      if (server === target) {
        return path.concat(target);
      }

      // Get adjacent servers
      const adjacentServers = ns.scan(server);

      for (const adjacentServer of adjacentServers) {
        // If the adjacent server has not been visited, add it to the queue
        if (!visited.has(adjacentServer)) {
          visited.add(adjacentServer);
          queue.push({server: adjacentServer, path: path.concat(server)});
        }
      }
    }

    // If there is no path from startServer to targetServer
    return null;
  }

  // Call the BFS function and get the shortest path
  const shortestPath = bfs(startServer, targetServer);

  if (shortestPath === null) {
    return "Can't find path from " + startServer + " to " + targetServer;
  } else {
    return shortestPath;
  }
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

  const portCnt = [hasBruteSSH, hasFTPCrack, hasRelaySMTP, hasHTTPWorm, hasSQLInject]
    .map((has) => (has ? 1 : 0))
    .reduce((a, b) => a + b, 0)

  const notRooted = servers.filter((server) => !ns.hasRootAccess(server))

  for (const server of notRooted) {
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

    const requiredPortsCnt = ns.getServerNumPortsRequired(server)
    if (portCnt >= requiredPortsCnt) {
      ns.nuke(server)
      logger.info(`Nuke ${server}`)
    } else {
      logger.warn(`Can't nuke ${server}`)
    }
  }
}
