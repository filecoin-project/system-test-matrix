import { AllSystemsPage } from '../pages/allSystemsPage'
import { PageHeader } from '../pages/pageHeader'
import { SubsystemPage } from '../pages/subsystemPage'

describe('Subsystem tests', () => {
  beforeEach('Visit first subsystem', () => {
    cy.allSystems()
    AllSystemsPage.systemLinks().first().click()
    cy.get('tbody>tr>td>span>a').first().click()
  })
  it('Should check page elments visibility', () => {
    SubsystemPage.visibilityOfPageElements()
    PageHeader.statusVisibility()
  })
  it('Checks if can scroll matrices ', () => {
    SubsystemPage.checkIfMatrixScrollable()
  })
  it('Checks page breadcrumbs links', () => {
    PageHeader.secondBreadcrumbClick()
    PageHeader.systemBreadcrumbClick()
    cy.url().should('eq', Cypress.config().baseUrl + '/system')
  })
})
