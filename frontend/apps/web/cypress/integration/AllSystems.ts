import { AllSystemsPage } from '../pages/allSystemsPage'
import { PageHeader } from '../pages/pageHeader'

describe('All systems tests', () => {
  beforeEach('Visit all systems page', () => {
    cy.allSystems()
  })
  it('Should check page elments visibility', () => {
    AllSystemsPage.visibilityOfPageElements()
  })
  it('Checks tooltip visibility', () => {
    //test kinds progress bar
    AllSystemsPage.progressBars().first().trigger('mouseenter')
    AllSystemsPage.tooltip().children().should('contain', '%')
    //behaviour status progress bar
    AllSystemsPage.progressBars().eq(1).trigger('mouseenter')
    AllSystemsPage.tooltip().children().should('contain', '%')
  })
  it('Checks page routing and links', () => {
    AllSystemsPage.systemLinks().first().click()
    cy.url().should('include', Cypress.config().baseUrl + '/system/')
    cy.allSystems()
    PageHeader.allTestsButton().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/tests')
    cy.allSystems()
    PageHeader.allBehaviorsButton().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/behaviors')
    PageHeader.systemBreadcrumbClick()
  })
})
