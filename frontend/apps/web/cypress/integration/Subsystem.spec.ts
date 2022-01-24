describe('Subsystem specs', () => {
  it('Should check subsystem page', () => {
    //visit home page
    cy.visit('/')
    //get first system link and click on it
    cy.get('tbody>tr>td>div>span>a').eq(0).click()
    //get first subsystem and click on it
    cy.get('tbody>tr>td>span>a').eq(0).click()
    //check if there is value in all status button
    cy.get('[data-element="button"]>span').should('have.value', '')
    //get all kinds heading
    cy.get('.c-text--text-xl').contains('All Tests Kinds')
    //get all behaviour status heading
    cy.get('.c-text--text-xl').contains('All Behaviors Status')
    //check if tests legends have colour
    cy.get('div>ul>li>span').should('have.attr', 'color')
    //get progress bars
    cy.get('.recharts-responsive-container')
    //resize page so that items in matrix table can be scollable
    cy.viewport(768, 1024)
    //scroll left and right inside matrix table
    cy.get('.c-page-layout__section')
      .eq(1)
      .children()
      .children()
      .first()
      .scrollTo('right')
      .scrollTo('left')
    //resize window to default
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
    // check if breadcrumbs link is working by clicking on system name
    cy.get('h5.c-text--heading-5')
      .should('contain', 'Systems')
      .parents()
      .next()
      .next()
      .children()
      .first()
      .click()
    // check if breadcrumbs link is working by slicking on Systems
    cy.get('h5.c-text--heading-5').should('contain', 'Systems').click()
    //check if redirected to right url
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
