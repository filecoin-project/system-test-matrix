import { Button } from './../selectors/button'
import { Matrix } from './../selectors/matrix'
import { ProgressBar } from './../selectors/progressBar'
import { Table } from './../selectors/table'
import { Text } from './../selectors/text'

describe('Subsystem specs', () => {
  it('Should check subsystem page', () => {
    //visit home page
    cy.homepage()
    //get first system link and click on it
    Table.allDirectLinksHomePage().first().click()
    //get first subsystem and click on it
    Table.allDirectLinksSystemPage().first().click()
    //check if there is value in all status button
    Button.allButtonsValue()
    //get all kinds heading
    Text.allTextXl().contains('All Tests Kinds')
    //get all behaviour status heading
    Text.allTextXl().contains('All Behaviors Status')
    //check if tests legends have colour
    ProgressBar.getAllLegendsAndPercentsColor()
    //get progress bars
    ProgressBar.getProgressBar()
    //resize page so that items in matrix table can be scollable
    cy.scrollingResolution()
    //scroll left and right inside matrix table
    cy.get('.c-page-layout__section')
      .eq(1)
      .children()
      .children()
      .first()
      .scrollTo('right')
      .scrollTo('left')
    //resize window to default
    cy.defaultWindowSize()
    //get untested behaviour legend and see if it has color
    Matrix.getMatrixLegendBg('Untested behavior')
    //get tested behaviour legend and see if it has color
    Matrix.getMatrixLegendBg('Tested behavior')
    // check if breadcrumbs link is working by clicking on system name
    Text.systemHeading().parents().next().next().children().first().click()
    // check if breadcrumbs link is working by slicking on Systems
    Text.systemHeading().click()
    //check if redirected to right url
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
