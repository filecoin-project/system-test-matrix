export const AllSystemsPage = {
  //locators
  tableHead: () => cy.get('thead>tr>td'),
  systemLinks: () => cy.get('tbody>tr>td>div>span>a'),
  subsystems: () => cy.get('tbody>tr>td>div>span').next(),
  progressBars: () => cy.get('tbody>tr>td>div>div'),
  scoreButtons: () => cy.get('td>[data-element="button"]>span'),
  tooltip: () => cy.get('.__react_component_tooltip'),

  //actions
  visibilityOfPageElements: () => {
    AllSystemsPage.tableHead().should('be.visible')
    AllSystemsPage.systemLinks().should('be.visible')
    AllSystemsPage.subsystems().should('be.visible')
    AllSystemsPage.progressBars().should('be.visible')
    AllSystemsPage.scoreButtons().should('be.visible')
  },
}
