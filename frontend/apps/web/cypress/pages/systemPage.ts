export const SystemPage = {
  //locators
  lText: () => cy.get('.c-text--subtitle-l'),
  xlText: () => cy.get('.c-text--text-xl'),
  barLegendAndText: () => cy.get('div>ul>li>span'),
  progressBar: () => cy.get('.recharts-responsive-container'),
  searchField: () => cy.get('input'),
  subsystemLinks: () => cy.get('.c-native-link '),
  filterDropdown: () => cy.get('[data-element="dropdown"]>div>div>span').eq(0),
  pageRowsDropdown: () =>
    cy.get('[data-element="dropdown"]>div>div>span').eq(1),
  detailedViewTab: () => cy.get('div>span').contains('Detailed view'),
  overviewTab: () => cy.get('div>span').contains('Overview'),
  scoreButtons: () => cy.get('[data-element="button"]>span'),
  matrixWrapper: () => cy.get('[data-element="matrix-wrapper"]'),
  matrixHeader: () => cy.get('.c-matrix__header'),
  matrix: () => cy.get('.recharts-surface'),
  matrixLegend: (name: string) => cy.get('div').contains(`${name}`),

  //actions
  visibilityOfOverviewTabElements: () => {
    SystemPage.lText().contains('behaviors in the system').should('be.visible')
    SystemPage.xlText().contains('All Tests Kinds').should('be.visible')
    SystemPage.xlText().contains('All Behaviors Status').should('be.visible')
    SystemPage.progressBar().should('be.visible')
    SystemPage.barLegendAndText().should('have.attr', 'color')
    SystemPage.lText().contains('Subsystems').should('be.visible')
    SystemPage.searchField().should('be.visible')
    SystemPage.subsystemLinks().should('be.visible')
    SystemPage.filterDropdown().should('be.visible')
    SystemPage.pageRowsDropdown().should('be.visible')
    SystemPage.searchField().should('be.visible')
    SystemPage.scoreButtons().should('be.visible')
  },
  visibilityOfDetailedTabElements: () => {
    SystemPage.matrixWrapper().should('be.visible')
    SystemPage.matrixHeader().should('be.visible')
    SystemPage.matrix().should('be.visible')
    SystemPage.matrixLegend('Untested behavior')
      .children()
      .first()
      .should('be.visible')
    SystemPage.matrixLegend('Tested behavior')
      .children()
      .first()
      .should('be.visible')
  },
  checkIfMatrixScrollable: () => {
    cy.scrollingResolution()
    SystemPage.matrixWrapper().scrollTo('right').scrollTo('right')
    cy.defaultWindowSize()
  },
  checkSearch: (searchTerm: string) => {
    SystemPage.searchField().type(searchTerm)
    SystemPage.subsystemLinks().should('not.exist')
    SystemPage.searchField().clear()
  },
}
