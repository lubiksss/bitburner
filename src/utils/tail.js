/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
}

export function tail(ns, scriptName, width, height, x, y, ...args) {
  ns.tail(scriptName, 'home', ...args)
  const fileName = scriptName.split('/').pop()
  const target = ns.ps('home')
    .filter((script) => {
      const hasName = script.filename.includes(fileName)
      const hasArgs = args.every((arg) => script.args.includes(arg))
      return hasName && hasArgs
    })
    .pop()

  ns.resizeTail(width, height, target.pid)
  ns.moveTail(x, y, target.pid)
}
