describe('System specs', () => {
  it('Should check system page', () => {
    //visit home page
    cy.visit('/')
    //click on first system link
    cy.get('tbody>tr>td>div>span>a').eq(0).click()
    //get progress bars
    cy.get('.recharts-surface')
    //get overall status button and check if it has any value
    cy.get('[data-element="button"]>span').should('have.value', '')
    // get test legends and check if they have color
    cy.get('div>ul>li>span').should('have.attr', 'color')
    //get heading that contains all tests kinds
    cy.get('.c-text--text-xl').contains('All Tests Kinds')
    //get heading that contains all behaviors status
    cy.get('.c-text--text-xl').contains('All Behaviors Status')
    //get progress all progress bars on the page including ones in table
    cy.get('.recharts-responsive-container')
    //get search field and input search term
    cy.get('input').type('?Working?')
    //there should be no columns displayed in table after inputing search term
    cy.get('.c-native-link ').should('not.exist')
    //clear input filed
    cy.get('input').clear()
    //check if there is links displayed after removing search term
    cy.get('.c-native-link ')
    //get all scores dropdown and click on it
    cy.get('[data-element="dropdown"]>div>div>span').eq(0).click()
    //get rows per page dropdown and click on it
    cy.get('[data-element="dropdown"]>div>div>span').eq(1).click()
    //get detailed view tabs nad click on it
    cy.get('div>span').contains('Detailed view').click()
    //resize page
    cy.viewport(768, 1024)
    //get page layout and scroll left and right
    cy.get('.c-page-layout__section>div>div')
      .next()
      .children()
      .first()
      .scrollTo('right')
      .scrollTo('left')
    //reset page resolution
    cy.viewport(Cypress.config().viewportWidth, Cypress.config().viewportHeight)
    //get untested behaviour legend and see if it has color
    cy.get('div')
      .contains('Untested behavior ')
      .children()
      .first()
      .should('have.css', 'background')
    //get tested behaviour legend and see if it has color
    cy.get('div')
      .contains('Tested behavior ')
      .children()
      .first()
      .should('have.css', 'background')
    //go back to overview tab
    cy.get('div>span').contains('Overview').click()
    // check if breadcrumbs link is working
    cy.get('h5.c-text--heading-5').should('contain', 'Systems').click()
    //check if url is correct after redirection
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
