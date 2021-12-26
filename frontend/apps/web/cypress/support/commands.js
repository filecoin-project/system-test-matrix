Cypress.Commands.add('homepage', () => {
  cy.server()
  cy.visit('/')
})
