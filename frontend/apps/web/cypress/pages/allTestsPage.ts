export const AllTestsPage = {
  //locators
  sText: () => cy.get('.c-text--text-s'),
  xlText: () => cy.get('.c-text--text-xl'),
  barLegendAndText: () => cy.get('div>ul>li>span'),
  progressBar: () => cy.get('.recharts-responsive-container'),
  searchField: () => cy.get('input'),
  behaviorIdLinks: () => cy.get('.c-native-link '),
  filterDropdown: () => cy.get('[data-element="dropdown"]>div>div>span').eq(0),
  pageRowsDropdown: () =>
    cy.get('[data-element="dropdown"]>div>div>span').eq(1),
  scoreButtons: () => cy.get('[data-element="button"]>span'),
  pageNumbers: () => cy.get('nav>ul>li>a'),
  modal: () => cy.get('.o-center-layout'),
  modalCancelBtn: () => cy.get('[data-element="button"]').contains('Cancel'),
  //actions
  visibilityOfElements: () => {
    AllTestsPage.sText().should('be.visible')
    AllTestsPage.xlText().contains('All Tests Kinds').should('be.visible')
    AllTestsPage.xlText().contains('All Tests Status').should('be.visible')
    AllTestsPage.xlText().contains('List of all tests').should('be.visible')
    AllTestsPage.progressBar().should('be.visible')
    AllTestsPage.barLegendAndText().should('have.attr', 'color')
    AllTestsPage.searchField().should('be.visible')
    AllTestsPage.behaviorIdLinks().should('be.visible')
    AllTestsPage.filterDropdown().should('be.visible')
    AllTestsPage.pageRowsDropdown().should('be.visible')
    AllTestsPage.searchField().should('be.visible')
    AllTestsPage.scoreButtons().should('be.visible')
    AllTestsPage.pageNumbers().should('be.visible')
  },

  checkSearch: (searchTerm: string) => {
    AllTestsPage.searchField().type(searchTerm)
    AllTestsPage.behaviorIdLinks().should('not.exist')
    AllTestsPage.searchField().clear()
  },
  getPageNumber: (pageNumber: number) => {
    AllTestsPage.pageNumbers()
      .eq(pageNumber - 1)
      .click()
  },
  checkModal: () => {
    AllTestsPage.behaviorIdLinks().first().click()
    AllTestsPage.modal().should('be.visible')
    AllTestsPage.modalCancelBtn().click()
  },
}
