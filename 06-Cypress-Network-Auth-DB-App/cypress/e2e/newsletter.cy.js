/// <reference types="cypress" />

//$ npm run test:open
describe('Newsletter', () => {

    beforeEach(() => {
        cy.task('seedDatabase');
    })
  it('should display a success message', () => {
    
    cy.intercept('POST', '/newsletter*', {status: 201}).as('subscribe'); //intercept any HTTP request sent to localhost:3000/newsletter?....
    signupForNewsletter();
    cy.contains('Thanks for signing up');
  });

  it('should display an error message', () => {
    cy.intercept('POST', '/newsletter*', {message: 'Email exists already.'}).as('subscribe');
    signupForNewsletter();
    cy.contains('Email exists already');
  })

  //This test doesn't even access a webpage or the frontend- just directly tests the backend!
  it('should successfully create a new contact', () => {
    cy.request({
        method: 'POST', 
        url: '/newsletter',
        body: { email: 'test@example.com'},
        form: true
    }).then(response => {
        expect(response.status).to.eq(201);
    })
  })

  function signupForNewsletter() {
    cy.visit('/');
    cy.getById('newsletter-email').type('test@example.com');
    cy.getById('newsletter-submit').click();
    cy.wait('@subscribe'); //Makes it so that code for the rest of the test is only executed after the HTTP request is intercepted!
  }
});