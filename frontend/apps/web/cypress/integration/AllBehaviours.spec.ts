describe('All behaviours spec', () => {
  it('Should check all behaviours page', () => {
    //visit behaviors page
    cy.visit('/behaviors')
    //get behaviour status progress bar
    cy.get('.recharts-responsive-container')
    //get behavior status heading
    cy.get('.c-text--subtitle-l').should('contain', 'Behavior status')
    //get test legends and check if they are coloured
    cy.get('div>ul>li>span').should('have.attr', 'color')
    //get first behavior id column's link and click on it , modal should open
    cy.get('.c-native-link ').should('have.value', '').eq(0).click()
    //click on cancel button on modal
    cy.get('[data-element="button"').contains('Cancel').click()
    //input search term in search area
    cy.get('input').type('?Working?')
    //there should be no links in table since search term is non existent
    cy.get('.c-native-link ').should('not.exist')
    //clear search input
    cy.get('input').clear()
    // get feature name, subsystem and intended behaviour cells and see if they contain any value
    cy.get('td>.c-text--text-m').should('have.value', '')
    //click on second page in paginator
    cy.get('nav>ul>li>a').eq(1).click()
    //get rows per page dropdown and click it
    cy.get('[data-element="dropdown"]>div>div>span').eq(0).click()

    //get all tests button and click it
    cy.get('[data-element="button"]').contains('All Tests').click()
    //url should have /tests in it
    cy.url().should('eq', Cypress.config().baseUrl + '/tests')
    //let's go back to previous page
    cy.go('back')
    //click on systems header link
    cy.get('h5.c-text--heading-5').should('contain', 'Systems').click()
    // check if link is working and we are on home page
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
