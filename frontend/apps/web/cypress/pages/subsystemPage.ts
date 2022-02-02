export const SubsystemPage = {
  // locators
  lText: () => cy.get('.c-text--subtitle-l'),
  xlText: () => cy.get('.c-text--text-xl'),
  progressBar: () => cy.get('.recharts-responsive-container'),
  barLegendAndText: () => cy.get('div>ul>li>span'),
  matrixWrapper: () => cy.get('[data-element="matrix-wrapper"]'),
  matrixHeader: () => cy.get('.c-matrix__header'),
  matrix: () => cy.get('.recharts-surface'),
  matrixLegend: (name: string) => cy.get('div').contains(`${name}`),

  //actions
  visibilityOfPageElements: () => {
    SubsystemPage.lText()
      .contains('behaviors in the system')
      .should('be.visible')
    SubsystemPage.xlText().contains('All Tests Kinds').should('be.visible')
    SubsystemPage.xlText().contains('All Behaviors Status').should('be.visible')
    SubsystemPage.progressBar().should('be.visible')
    SubsystemPage.barLegendAndText().should('have.attr', 'color')

    SubsystemPage.matrixWrapper().should('be.visible')
    SubsystemPage.matrixHeader().should('be.visible')
    SubsystemPage.matrix().should('be.visible')
    SubsystemPage.matrixLegend('Untested behavior')
      .children()
      .first()
      .should('be.visible')
    SubsystemPage.matrixLegend('Tested behavior')
      .children()
      .first()
      .should('be.visible')
  },
  checkIfMatrixScrollable: () => {
    cy.scrollingResolution()
    SubsystemPage.matrixWrapper().scrollTo('right').scrollTo('left')
    cy.defaultWindowSize()
  },
}
