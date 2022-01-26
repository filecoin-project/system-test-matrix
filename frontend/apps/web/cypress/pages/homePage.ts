export const HomePage = {
  //locators
  tableHead: () => cy.get('thead>tr>td'),
  systemLinks: () => cy.get('tbody>tr>td>div>span>a'),
  subsystems: () => cy.get('tbody>tr>td>div>span').next(),
  progressBars: () => cy.get('tbody>tr>td>div>div'),
  scoreButtons: () => cy.get('td>[data-element="button"]>span'),
  tooltip: () => cy.get('.__react_component_tooltip'),

  //actions
  visibilityOfPageElements: () => {
    HomePage.tableHead().should('be.visible')
    HomePage.systemLinks().should('be.visible')
    HomePage.subsystems().should('be.visible')
    HomePage.progressBars().should('be.visible')
    HomePage.scoreButtons().should('be.visible')
  },
}
