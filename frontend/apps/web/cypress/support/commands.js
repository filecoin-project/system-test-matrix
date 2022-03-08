Cypress.Commands.add('homepage', () => {
  cy.visit('/')
})
Cypress.Commands.add('allSystems', () => {
  cy.visit('/system')
})
Cypress.Commands.add('scrollingResolution', () => {
  cy.viewport(768, 1024)
})

Cypress.Commands.add('defaultWindowSize', () => {
  cy.viewport(Cypress.config().viewportWidth, Cypress.config().viewportHeight)
})
