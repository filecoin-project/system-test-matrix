export const HomePage = {
  //locators
  heading: () => cy.get('h1'),
  textBody: () => cy.get('[data-testId="text-body"]'),
  githubButton: () => cy.get('[data-testid="github"]'),
  enterButton: () => cy.get('[data-testid="systems"]'),
  bloxicoLink: () => cy.get('div>span>span'),
  //actions
  visibilityOfPageElements: () => {
    HomePage.heading().should('be.visible')
    HomePage.textBody().should('be.visible')
    HomePage.githubButton().should('be.visible')
    HomePage.enterButton().should('be.visible')
    HomePage.bloxicoLink().should('be.visible')
  },
}
