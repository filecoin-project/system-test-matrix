const ProgressBar = {
  //check if legends and percentages have colour
  getAllLegendsAndPercentsColor: () => {
    return cy.get('div>ul>li>span').should('have.attr', 'color')
  },
  //get progress bars
  getProgressBar: () => {
    return cy.get('.recharts-responsive-container')
  },
}

export { ProgressBar }
