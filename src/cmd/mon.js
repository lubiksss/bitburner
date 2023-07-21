/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = "/src/watcher"

  let targetServer = ns.args[0]

  ns.exec(`${ROOT_SRC}/tailWatcher.js`, "home", 1, targetServer)
  ns.tail(`${ROOT_SRC}/tailWatcher.js`, "home", targetServer)

  const target = ns.ps('home')
    .filter((script) => script.filename.includes("tailWatcher") && script.args.includes(targetServer))
    .map((script) => script.pid)[0]

  ns.resizeTail(290, 395, target)
  ns.moveTail(1650, 5, target)
}

export function autocomplete(data, args) {
  return [...data.servers];
}