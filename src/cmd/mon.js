/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = "/src/watcher"

  let targetServer = ns.args[0]

  ns.exec(`${ROOT_SRC}/tailWatcher.js`, "home", 1, targetServer)
  ns.tail(`${ROOT_SRC}/tailWatcher.js`, "home", targetServer)
}

export function autocomplete(data, args) {
  return [...data.servers];
}