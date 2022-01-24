describe('Homepage spec', () => {
  it('Should check homepage', () => {
    cy.homepage()
    //getting page header that contains Systems string
    cy.get('h5.c-text--heading-5').should('contain', 'Systems')
    //getting first system links in table
    cy.get('tbody>tr>td>div>span>a').eq(0).should('have.value', '')
    //getting first system's sybsystems field
    cy.get('tbody>tr>td>div>span').eq(1).should('have.value', '')
    //getting first progress bar inside test kinds
    cy.get('tbody>tr>td>div>div').eq(0).trigger('mouseenter')
    //getting tootltip that we activated with "mouseenter" and checking if it has % in it which indicates that it's not empty
    cy.get('.__react_component_tooltip').children().should('contain', '%')
    //getting first link and clicking on it
    cy.get('tbody>tr>td>div>span>a').eq(0).click()
    //checking if link works
    cy.url().should('include', Cypress.config().baseUrl + '/system/')
    //going back to homepage
    cy.visit('/')
    //getting first progress bar inside behavior status
    cy.get('tbody>tr>td>div>div').eq(1).trigger('mouseenter')
    //getting tootltip that we activated with "mouseenter" and checking if it has % in it which indicates that it's not empty
    cy.get('.__react_component_tooltip').children().should('contain', '%')
    //getting all tests button and clicking it
    cy.get('[data-element="button"]>span').contains('All Tests').click()
    //checking if button link works
    cy.url().should('eq', Cypress.config().baseUrl + '/tests')
    //checking if logo link works
    cy.get('div>a').contains('System Test Matrix').click()
    //checking if logo link redirected us to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    //getting all behaviours button and clicking it
    cy.get('[data-element="button"]>span').contains('All Behaviours').click()
    //checking if breadcrumbs link works
    cy.get('h5.c-text--heading-5').should('contain', 'Systems').click()
    //checking if we are redirected back to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    //getting all buttons in score column and checking if they have string value
    cy.get('tbody>tr>td>button>span').should('have.value', '')
  })
})
