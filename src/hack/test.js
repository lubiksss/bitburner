import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)
  ns.purchaseServer('jake1', 1024)
}