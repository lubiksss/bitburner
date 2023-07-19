import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import("../hack").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  const ROOT_SRC = '/src/hack'
  const runningScripts = ns.ps('home')
    .filter((script) => script.filename.includes("run") || script.filename.includes("watch"))
    .map((script) => script.pid)
  runningScripts.forEach((pid) => ns.kill(pid, 'home'))
}