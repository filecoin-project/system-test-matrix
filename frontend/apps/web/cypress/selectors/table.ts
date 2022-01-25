/** * All selectors related to Table component */
const Table = {
  //All links in homepage table
  allDirectLinksHomePage: () => {
    return cy.get('tbody>tr>td>div>span>a')
  },
  //All links in system table
  allDirectLinksSystemPage: () => {
    return cy.get('tbody>tr>td>span>a')
  },
}
export { Table }
