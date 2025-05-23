/// <reference types="cypress" />

//$ npm run test:open
describe('Takeaways', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  })

  it('should display a list of fetched takeaways', () => {
    cy.visit('/');
    cy.getById('takeaway-item').should('have.length', 2);
  });

  it('should add new takeaway', () => {
    cy.intercept('POST', '/takeaways/new*', 'success').as('createTakeaway');
    cy.login();
    cy.location('pathname').should('eq', '/takeaways');
    cy.visit('/takeaways/new');

    cy.location('pathname').should('eq', '/takeaways/new');
    //Now, add new takeaway data
    cy.getById('title').click();
    cy.getById('title').type('TestTitle1');
    cy.getById('body').type('TestBody1');
    cy.getById('create-takeaway').click();

    //This would submit the form by sending a request to the backend to create a new takeaway in the DB
    //To decouple the frontend and backend, I want to intecept the post before it hits out backend!
    cy.wait('@createTakeaway').its('request.body').should('match', /TestTitle1.*TestBody1/);
  })
});