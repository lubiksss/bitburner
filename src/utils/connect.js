import {howToGetServer} from "/src/utils/scan"

/** @param {NS} ns */
/** @param {import("../hack").NS } ns */
export async function main(ns) {
  //TODO
  // https://bitburner.readthedocs.io/en/latest/netscript/advancedfunctions/autocomplete.html?highlight=flags
  const startServer = "home"
  const targetServer = ns.args[0]

  const shortestPath = howToGetServer(ns, startServer, targetServer);
  const exceptHome = shortestPath.slice(1)
  const command = exceptHome
    .map((server) => `connect ${server}`)
    .join(";")

  navigator.clipboard.writeText(command)
  ns.tprint("Copy command to clipboard")
  // const terminalInput = document.getElementById("terminal-input");
  // terminalInput.value = command
  // const handler = Object.keys(terminalInput)[1];
  // terminalInput[handler].onChange({target: terminalInput});
  // terminalInput[handler].onKeyDown({key: 'Enter', preventDefault: () => null});
}
