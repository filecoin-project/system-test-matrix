/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Homepage command
     * @example cy.homepage()
     */
    homepage(): void
    /**
     * Page resolution change so matrix can be scrollable
     */
    scrollingResolution(): void
    /**
     * Reseting page resolution to default defined at cypress.json
     */
    defaultWindowSize(): void
  }
}
