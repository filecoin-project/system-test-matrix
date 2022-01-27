export const AllBehavioursPage = {
  //locators
  mText: () => cy.get('.c-text--text-m'),
  lText: () => cy.get('.c-text--subtitle-l'),
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
    AllBehavioursPage.mText().should('be.visible')
    AllBehavioursPage.lText()
      .contains('List of all behaviors')
      .should('be.visible')
    AllBehavioursPage.lText().contains('Behavior status').should('be.visible')
    AllBehavioursPage.progressBar().should('be.visible')
    AllBehavioursPage.barLegendAndText().should('have.attr', 'color')
    AllBehavioursPage.searchField().should('be.visible')
    AllBehavioursPage.behaviorIdLinks().should('be.visible')
    AllBehavioursPage.filterDropdown().should('be.visible')
    AllBehavioursPage.pageRowsDropdown().should('be.visible')
    AllBehavioursPage.searchField().should('be.visible')
    AllBehavioursPage.scoreButtons().should('be.visible')
    AllBehavioursPage.pageNumbers().should('be.visible')
  },

  checkSearch: (searchTerm: string) => {
    AllBehavioursPage.searchField().type(searchTerm)
    AllBehavioursPage.behaviorIdLinks().should('not.exist')
    AllBehavioursPage.searchField().clear()
  },
  getPageNumber: (pageNumber: number) => {
    AllBehavioursPage.pageNumbers()
      .eq(pageNumber - 1)
      .click()
  },
  checkModal: () => {
    AllBehavioursPage.behaviorIdLinks().first().click()
    AllBehavioursPage.modal().should('be.visible')
    AllBehavioursPage.modalCancelBtn().click()
  },
}
