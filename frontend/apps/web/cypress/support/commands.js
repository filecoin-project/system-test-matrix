Cypress.Commands.add('homepage', () => {
  cy.server()
  cy.visit('/')
})
Cypress.Commands.add('scrollingResolution', () => {
  cy.viewport(768, 1024)
})

Cypress.Commands.add('defaultWindowSize', () => {
  //resize window to default
  cy.viewport(Cypress.config().viewportWidth, Cypress.config().viewportHeight)
})
