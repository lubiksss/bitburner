/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = "/src/hack"

  let MAX_TARGET_SERVER_SIZE = ns.args[0]

  ns.exec(`${ROOT_SRC}/run-server.js`, "home", 1, MAX_TARGET_SERVER_SIZE)
  ns.tail(`${ROOT_SRC}/run-server.js`, "home", MAX_TARGET_SERVER_SIZE)

  const target = ns.ps('home')
    .filter((script) => script.filename.includes("run-server") && script.args.includes(MAX_TARGET_SERVER_SIZE))
    .map((script) => script.pid)[0]

  ns.resizeTail(590, 200, target)
  ns.moveTail(1802, 445, target)
}

export function autocomplete(data, args) {
  return [...Array(21).keys()].map((i) => Math.pow(2, i))
}
