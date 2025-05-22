/// <reference types="Cypress" />
//Note: From here on, I can refactor these methods to be a bit more readable and understandable, 
// but I'm now more focused on just learning the concepts
describe('page navigation', () => {
  it('should navigate between pages', () => {
    //Before Refactoring:
    cy.visit('http://localhost:5173/about'); //See how I start at the about page right at the start
    
    cy.get('[data-cy="contact-input-message"]').type('Hello World!');
    cy.get('[data-cy="contact-input-name"]').type('John Doe');
    cy.get('[data-cy="contact-btn-submit"]').then((el) => {
        //el here is a wrapper object!
        //We lose availability to the "should" assertion with this element!
        //Instead, use the globally available expect method!
        expect(el.attr('disabled')).to.be.undefined; //Fails if the button IS disabled!
        expect(el.text()).to.equal('Send Message'); //note, .eq() is a shorthand for .equal()
    })
    
    cy.get('[data-cy="contact-input-email"]').type('test@example.com{enter}');
    //cy.get('[data-cy="contact-btn-submit"]').click();

    //NOTE: Doing this below 
    const btn = cy.get('[data-cy="contact-btn-submit"]'); //This is essentially just creating another function call
    //DON'T DO THIS! Needlessly complex and the button is NOT stored in the btn constant!

    cy.get('[data-cy="contact-btn-submit"]').as('submitBtn');
    cy.get('@submitBtn') 
        .contains('Sending...')
        .should('have.attr', 'disabled'); //Button should be disabled after submitting the form
    })

    it('should validate the form input', () => {
        cy.visit('http://localhost:5173/about');
        y.get('[data-cy="contact-btn-submit"]').as('submitBtn');
        cy.get('@submitBtn').click();
        cy.get('@submitBtn').then(el => {
            expect(el).to.not.have.attr('disabled');
            expect(el.text()).to.not.equal('Sending...');
        })

        cy.get('@submitBtn').blur();
        cy.get('@submitBtn').parent().then(el => {
            expect(el.attr('class')).to.contains('invalid');
        })
        cy.get('@submitBtn').blur();

        //To test further fields, you can use .focus() then .blur()
    })
})