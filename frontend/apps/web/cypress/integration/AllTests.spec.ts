describe('All tests spec', () => {
  it('Should check all tests page', () => {
    //visit tests page
    cy.visit('/tests')
    //get heading that contains all tests kinds
    cy.get('.c-text--text-xl').should('contain', 'All Tests Kinds')
    //get progress bars
    cy.get('.recharts-surface')
    ///get all legends and check if they are coloured
    cy.get('div>ul>li>span').should('have.attr', 'color')
    //get heading that contains all tests status
    cy.get('.c-text--text-xl').should('contain', 'All Tests Status')
    //get first suite link and click on it, modal should open
    cy.get('.c-native-link ').should('have.value', '').eq(0).click()
    //get modal
    cy.get('.o-center-layout')
    //get modal cancel button and click on it
    cy.get('[data-element="button"').contains('Cancel').click()
    //input search term in search area
    cy.get('input').type('?Working?')
    //there should be no links in table since search term is non existent
    cy.get('.c-native-link').should('not.exist')
    //clear search input
    cy.get('input').clear()
    //get all kinds and behaviors and they should contain any value
    cy.get('td>.c-text--text-s').should('have.value', '')
    //get all functions and they should contain any value
    cy.get('td>div>.c-text--text-s').should('have.value', '')
    //get all status buttons and they should contain any value
    cy.get('td>[data-element="button"]').should('have.value', '')
    //get second page in paginator and click on it
    cy.get('nav>ul>li>a').eq(1).click()
    //get rows per page dropdown and click it
    cy.get('[data-element="dropdown"]>div>div>span').eq(0).click()
    //get all behaviours button and click on it
    cy.get('[data-element="button"]').contains('All Behaviours').click()
    //check if button leads to right url
    cy.url().should('eq', Cypress.config().baseUrl + '/behaviors')
    //click on system header breadcrumbs link
    cy.get('h5.c-text--heading-5').should('contain', 'Systems').click()
    //check if breadcrumbs link leads to right url
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
