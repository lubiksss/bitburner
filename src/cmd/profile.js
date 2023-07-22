/** @param {NS} ns */
import {tail} from "/src/utils/tail";

/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = "/src/utils"

  let targetServer = ns.args[0]

  ns.exec(`${ROOT_SRC}/profile.js`, "home", 1, targetServer)
  tail(ns, `${ROOT_SRC}/profile.js`, 290, 395, 1650, 5, targetServer)
}

export function autocomplete(data, args) {
  return [...data.servers];
}