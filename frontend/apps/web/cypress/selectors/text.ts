const Text = {
  allTextXl: () => {
    //get all xl text
    return cy.get('.c-text--text-xl')
  },
  systemHeading: () => {
    //get system heading
    return cy.get('h5.c-text--heading-5').should('contain', 'Systems')
  },
}

export { Text }
