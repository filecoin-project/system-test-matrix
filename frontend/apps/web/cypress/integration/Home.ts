import { HomePage } from '../pages/homePage'
import { PageHeader } from '../pages/pageHeader'

describe('Homepage tests', () => {
  beforeEach('Visit first subsystem', () => {
    cy.homepage()
  })
  it('Should check page elments visibility', () => {
    HomePage.visibilityOfPageElements()
  })

  it('Should check if enter button works', () => {
    HomePage.enterButton().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/system')
    PageHeader.logo().click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
