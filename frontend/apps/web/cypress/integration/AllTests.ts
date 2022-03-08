import { SEARCH_TERM } from '../fixtures/constants'
import { AllTestsPage } from '../pages/allTestsPage'
import { PageHeader } from '../pages/pageHeader'

describe('All tests test', () => {
  beforeEach('Visit first system', () => {
    cy.allSystems()
    PageHeader.allTestsButton().click()
  })
  it('Should check page elments visibility', () => {
    AllTestsPage.visibilityOfElements()
  })

  it('Checks search', () => {
    AllTestsPage.checkSearch(SEARCH_TERM)
  })
  it('Checks modal', () => {
    AllTestsPage.checkModal()
  })
  it('Checks pagination', () => {
    AllTestsPage.getPageNumber(2)
    AllTestsPage.behaviorIdLinks().should('be.visible')
  })
  it('Checks page breadcrumbs and links', () => {
    PageHeader.allBehaviorsButton().click()
    PageHeader.allTestsButton().click()
    PageHeader.systemBreadcrumbClick()
    cy.url().should('eq', Cypress.config().baseUrl + '/system')
  })
})
