export const PageHeader = {
  //locators
  header: () => cy.get('.c-page-layout__header'),
  logo: () => cy.get('.c-page-layout__header--logo>div>a'),
  breadcrumbs: () => cy.get('.c-page-layout__header--logo').next(),
  systemBreadcrumb: () => cy.get('h5.c-text--heading-5').contains('Systems'),
  overallStatusButton: () => cy.get('span>[data-element="button"]>span'),
  allTestsButton: () =>
    cy.get('[data-element="button"]>span').contains('All Tests'),
  allBehaviorsButton: () =>
    cy.get('[data-element="button"]>span').contains('All Behaviours'),

  //actions
  logoClick: () => PageHeader.logo().click(),
  systemBreadcrumbClick: () => PageHeader.systemBreadcrumb().click(),
  secondBreadcrumbClick: () =>
    PageHeader.breadcrumbs()
      .children()
      .next()
      .next()
      .children()
      .first()
      .click(),
  statusVisibility: () => PageHeader.overallStatusButton().should('be.visible'),
}
