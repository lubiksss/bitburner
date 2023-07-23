/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
}

const lineHeight = [0,
  1, 2, 105, 130, 150,
  0, 0, 0, 0, 300]

export function tail(ns, scriptName, width, lineCnt, x, y, ...args) {
  const height = lineHeight[lineCnt]
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
