/// <reference types="Cypress" />
//Testing the workflow of bringing up a 'new note' modal, 
//and either click cancel and/or click away from it to make it disappear
describe('tasks management', () => {
    it('should open and close the new task modal with cancel button', () => {
        cy.visit('http://localhost:5173/');
        cy.contains('Add Task').click();
        cy.contains('Cancel').click();
        verifyMissingModal();
    })

    it('should open and close the new task modal by clicking away', () => {
        cy.visit('http://localhost:5173/');
        //Note: .contains() also YIELDS the item!
        cy.contains('Add Task').click();
        //We can click the backdrop (which we find by 
        //inspecting element after clicking add note), or click the cancel button
        cy.get('.backdrop').click({force : true});
        verifyMissingModal();
    })

    function verifyMissingModal() {
        cy.get('.backdrop').should('not.exist');
        cy.get('.modal').should('not.exist');
    }

    it('should create a new task', () => {
        cy.visit('http://localhost:5173/');
        cy.contains('Add Task').click();
        //.type() lets cypress type something into the selected field!
        cy.get('#title').type('Sample Task Name');
        cy.get('#summary').type('Sample Description');

        //We want to make sure we make these seleectors as unique as possible!
        cy.get('.modal').contains('Add Task').click(); //We're grabbing the matching
                                                     //button that is INSIDE the modal!
        //Verify results:
        cy.get('.task').should('have.length', 1);
        cy.get('.task h2').contains('Sample Task Name');
        cy.get('.task p').contains('Sample Description');
    })
})

