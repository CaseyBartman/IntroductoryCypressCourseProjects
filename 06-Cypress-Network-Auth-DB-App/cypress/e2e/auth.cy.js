/// <reference types="cypress" />

//$ npm run test:open
describe('Auth', () => {

    beforeEach(() => {
        cy.task('seedDatabase');
    })
    
  it('should signup', () => {
    cy.visit('/signup');
    cy.getById('auth-email').click();
    cy.getById('auth-email').type('test2@example.com');
    cy.getById('auth-password').type('testpassword');
    cy.getById('auth-submit').click();

    //Now, add assertion to know we signed up correctly
    cy.location('pathname').should('eq', '/takeaways');
    cy.getCookie('__session').its('value').should('not.be.empty');
  });

  it('should login', () => {
    cy.login();
    cy.location('pathname').should('eq', '/takeaways');
    cy.getCookie('__session').its('value').should('not.be.empty');
  })

  it('should logout',() => {
    //Sign in first
    cy.login(); //Custom command

    //Can click the button, or use the post request!
    //Clicking the button:
    cy.contains('Logout').click();
    cy.location('pathname').should('eq', '/');
    cy.getCookie('__session').its('value').should('be.empty');

  })
});