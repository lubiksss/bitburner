/** @param {NS} ns */

/** @param {import("../hack").NS } ns */

const container = document.querySelector('tbody.MuiTableBody-root.css-1xnox0e')

/** @param {import(".").NS } ns */
export async function main(ns) {
  addData(ns)
  const homeThread = document.querySelector('#home-thread')
  const serverThread = document.querySelector('#server-thread')

  while (true) {

    await ns.sleep(10)
  }
}

function addData(ns) {
  const data = document.querySelector('#home-thread')
  if (data === null) {
    addHorizontalLine()
    addTr('home-thread', 'hUsg', '0')
    addTr('server-thread', 'sUsg', '0')
    addHorizontalLine()
  }
}

function addVerticalSpace() {
  const tempContainer = document.createElement('tr');
  tempContainer.classList.add('MuiTableRow-root', 'css-1dix92e')
  tempContainer.innerHTML = `
    <th class="MuiTableCell-root jss11 MuiTableCell-body MuiTableCell-sizeMedium css-hadb7u" scope="row" colspan="2" style="padding-bottom: 2px; position: relative; top: -3px;"><span class="MuiLinearProgress-root MuiLinearProgress-colorPrimary MuiLinearProgress-determinate css-3x86pa" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><span class="MuiLinearProgress-bar MuiLinearProgress-barColorPrimary MuiLinearProgress-bar1Determinate css-14usnx9" style="transform: translateX(-100%);"></span></span></th>
  `
  container.appendChild(tempContainer)
}

function addHorizontalLine() {
  const tempContainer = document.createElement('tr');
  tempContainer.classList.add('MuiTableRow-root', 'css-1dix92e')
  tempContainer.innerHTML = `
    <th class="MuiTableCell-root jss12 MuiTableCell-body MuiTableCell-sizeMedium css-hadb7u" scope="row"><p class="MuiTypography-root MuiTypography-body1 css-18mn1ib" id="overview-extra-hook-0"></p></th><th class="MuiTableCell-root jss12 MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-7v1cxh" scope="row"><p class="MuiTypography-root MuiTypography-body1 css-18mn1ib" id="overview-extra-hook-1"></p></th><th class="MuiTableCell-root jss12 MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-7v1cxh" scope="row"><p class="MuiTypography-root MuiTypography-body1 css-18mn1ib" id="overview-extra-hook-2"></p></th>
  `
  container.appendChild(tempContainer)
}

function addTr(id, title, value) {
  const tempContainer = document.createElement('tr');
  tempContainer.classList.add('MuiTableRow-root', 'css-1dix92e')
  tempContainer.innerHTML = `
    <th class="MuiTableCell-root jss11 MuiTableCell-body MuiTableCell-sizeMedium css-hadb7u" scope="row">
      <p class="MuiTypography-root MuiTypography-body1 css-fupmec">${title}&nbsp;</p>
    </th>
    <td class="MuiTableCell-root jss11 MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-7v1cxh">
      <p class="MuiTypography-root MuiTypography-body1 css-fupmec" id="${id}">${value}</p>
    </td>
  `
  container.appendChild(tempContainer)
}