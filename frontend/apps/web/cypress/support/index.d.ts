/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Homepage command
     * @example cy.homepage()
     */
    homepage(): void
  }
}
