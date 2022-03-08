import { SEARCH_TERM } from '../fixtures/constants'
import { AllBehavioursPage } from '../pages/allBehavioursPage'
import { PageHeader } from '../pages/pageHeader'

describe('All behaviours tests', () => {
  beforeEach('Visit first system', () => {
    cy.allSystems()
    PageHeader.allBehaviorsButton().click()
  })
  it('Should check page elments visibility', () => {
    AllBehavioursPage.visibilityOfElements()
  })

  it('Checks search', () => {
    AllBehavioursPage.checkSearch(SEARCH_TERM)
  })
  it('Checks modal', () => {
    AllBehavioursPage.checkModal()
  })
  it('Checks pagination', () => {
    AllBehavioursPage.getPageNumber(2)
    AllBehavioursPage.behaviorIdLinks().should('be.visible')
  })
  it('Checks page breadcrumbs and links', () => {
    PageHeader.allTestsButton().click()
    PageHeader.allBehaviorsButton().click()
    PageHeader.systemBreadcrumbClick()
    cy.url().should('eq', Cypress.config().baseUrl + '/system')
  })
})
