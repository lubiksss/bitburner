import {Logger} from "/src/utils/logger.js";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
    const logger = new Logger(ns);
    logger.info("Hello, world!");
    logger.warn("Hello, world!");
    logger.error("Hello, world!");
    logger.error("Hello, world!");
    logger.info("Hello, world!");
    logger.warn("Hello, world!");
    ns.print("Hello, world!")
    ns.print("WARN")
    ns.print("ERROR")
}