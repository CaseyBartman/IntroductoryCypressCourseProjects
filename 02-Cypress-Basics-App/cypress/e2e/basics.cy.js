/// <reference types="Cypress" />
describe('tasks page', () => {
  it('should render the main image', () => {
    cy.visit('http://localhost:5173/'); //Test fails if the page fails to load
    cy.get('.main-header img').should('have.attr', 'src').and('include', 'logo.png');

    cy.get('.main-header').get('img');
    cy.get('.main-header').find('img');
  })
  it('should display the page title', () => {
    cy.visit('http://localhost:5173/'); //Again, this is necessary
    cy.get('h1').should('have.length', 1); 
    cy.get('h1').contains('React Tasks');
  })

  //Testing the workflow of bringing up a 'new note' modal, 
  //and either click cancel and/or click away from it to make it disappear
  
})