const Matrix = {
  //check if matrix legend has colour
  getMatrixLegendBg: (name: string) => {
    return cy
      .get('div')
      .contains(`${name}`)
      .children()
      .first()
      .should('have.css', 'background')
  },
}
export { Matrix }
