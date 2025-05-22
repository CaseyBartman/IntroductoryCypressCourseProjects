/// <reference types="cypress" />
//Note: From here on, I can refactor these methods to be a bit more readable and understandable, 
// but I'm now more focused on just learning the concepts
describe('page navigation', { defaultCommandTimeout: 1000 }, () => {

    before(() => {
        // Runs only once, before all tests!
    })

    //Runs before every test!
    beforeEach(() => {
        cy.visit('/about'); // http://localhost:5173/about
        //Can seed a database here, etc. 
    });

    //Can also use afterEach and after(), but these are less commono

  it('should navigate between pages', { defaultCommandTimeout: 1000 }, () => {
    //Example task call:
    //cy.task('seedDatabase', 'fileName.csv').then(returnValue => {console.log(returnValue)});
    
    cy.getById('contact-input-message').type('Hello World!');
    cy.getById('contact-input-name').type('John Doe');
    cy.getById('contact-btn-submit').then((el) => {
        //el here is a wrapper object!
        //We lose availability to the "should" assertion with this element!
        //Instead, use the globally available expect method!
        expect(el.attr('disabled')).to.be.undefined; //Fails if the button IS disabled!
        expect(el.text()).to.equal('Send Message'); //note, .eq() is a shorthand for .equal()
    })
    
    cy.getById('contact-input-email').type('test@example.com'); //cy.get('[data-cy="contact-input-email"]').type('test@example.com{enter}');
    cy.submitForm(); //Custom command here!

    //NOTE: Doing this below 
    const btn = cy.get('[data-cy="contact-btn-submit"]'); //This is essentially just creating another function call
    //DON'T DO THIS! Needlessly complex and the button is NOT stored in the btn constant!

    cy.getById('contact-btn-submit').as('submitBtn'); //Instead, use aliases!
    cy.get('@submitBtn') 
        .contains('Sending...')
        .should('have.attr', 'disabled'); //Button should be disabled after submitting the form
    })

    it('should validate the form input', () => {
        //Remember, visit is called with beforeEach()!
        cy.getById('contact-btn-submit').as('submitBtn');
        cy.getById('contact-input-message').as('msgInput');
        cy.submitForm();
        cy.get('@submitBtn').then(el => {
            expect(el).to.not.have.attr('disabled');
            expect(el.text()).to.not.equal('Sending...');
        })

        cy.get('@msgInput').blur();
        cy.get('@msgInput')
        .parent()
        .should((el) => {
            expect(el.attr('class')).not.to.be.undefined;
            expect(el.attr('class')).to.contain('invalid');
        })
        // .should('have.attr', 'class').and('match', /invalid/); //Match provides REGEX matching!

        //To test further fields, you can use .focus() then .blur()
    })
})