/// <reference types="Cypress" />
//Note: From here on, I can refactor these methods to be a bit more readable and understandable, 
// but I'm now more focused on just learning the concepts
describe('page navigation', () => {
  it('should navigate between pages', () => {
    cy.visit('http://localhost:5173/'); 
    cy.get('[data-cy="header-about-link"]').click();
    cy.location('pathname').should('eq', '/about'); // About Page
    //The pathname should have "//about"

    cy.go('back'); //Lets us simulate clicking the "back" button of the browser!
    cy.location('pathname').should('eq', '/'); //Home Page

    cy.get('[data-cy="header-about-link"]').click();
    cy.get('[data-cy="header-home-link"]').click(); //Clicking home page button to go back!
    cy.location('pathname').should('eq', '/'); 

  })
})
