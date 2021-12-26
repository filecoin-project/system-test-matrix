describe('Homepage spec', () => {
  it('Should check homepage', () => {
    cy.homepage()
    cy.get('h5.c-text--heading-5').should('contain', 'Systems')
  })
})
