import { SEARCH_TERM } from '../fixtures/constants'
import { HomePage } from '../pages/homePage'
import { PageHeader } from '../pages/pageHeader'
import { SystemPage } from '../pages/systemPage'

describe('System tests', () => {
  beforeEach('Visit first system', () => {
    cy.homepage()
    HomePage.systemLinks().first().click()
  })
  it('Should check page elments visibility', () => {
    PageHeader.statusVisibility()
    SystemPage.visibilityOfOverviewTabElements()
    SystemPage.detailedViewTab().click()
    SystemPage.visibilityOfDetailedTabElements()
  })
  it('Checks if can scroll matrices ', () => {
    SystemPage.detailedViewTab().click()
    SystemPage.checkIfMatrixScrollable()
  })
  it('Checks page breadcrumbs links', () => {
    PageHeader.systemBreadcrumbClick()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
  it('Checks search', () => {
    SystemPage.checkSearch(SEARCH_TERM)
  })
})
