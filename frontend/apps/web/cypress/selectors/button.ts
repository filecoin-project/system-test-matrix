const Button = {
  allButtonsValue: () => {
    //check if there is value in all status button
    return cy.get('[data-element="button"]>span').should('have.value', '')
  },
}

export { Button }
