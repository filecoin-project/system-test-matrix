import { HomePage } from '../pages/homePage'
import { PageHeader } from '../pages/pageHeader'

describe('Homepage tests', () => {
  beforeEach('Visit homepage', () => {
    cy.homepage()
  })
  it('Should check page elments visibility', () => {
    HomePage.visibilityOfPageElements()
  })
  it('Checks tooltip visibility', () => {
    //test kinds progress bar
    HomePage.progressBars().first().trigger('mouseenter')
    HomePage.tooltip().children().should('contain', '%')
    //behaviour status progress bar
    HomePage.progressBars().eq(1).trigger('mouseenter')
    HomePage.tooltip().children().should('contain', '%')
  })
  it('Checks page routing and links', () => {
    HomePage.systemLinks().first().click()
    cy.url().should('include', Cypress.config().baseUrl + '/system/')
    cy.homepage()
    PageHeader.allTestsButton().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/tests')
    cy.homepage()
    PageHeader.allBehaviorsButton().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/behaviors')
    PageHeader.systemBreadcrumbClick()
  })
})
