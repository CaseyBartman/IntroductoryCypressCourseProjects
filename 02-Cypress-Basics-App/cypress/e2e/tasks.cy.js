/// <reference types="Cypress" />
//Testing the workflow of bringing up a 'new note' modal, 
//and either click cancel and/or click away from it to make it disappear
describe('tasks management', () => {
    it('should open and close the new task modal with cancel button', () => {
        visitModal();
        cy.contains('Cancel').click();
        verifyMissingModal();
    })

    it('should open and close the new task modal by clicking away', () => {
        visitModal();
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
        visitModal();
        //.type() lets cypress type something into the selected field!
        cy.get('#title').type('Sample Task Name');
        cy.get('#summary').type('Sample Description');
        cy.get('#category').select('urgent');

        //We want to make sure we make these seleectors as unique as possible!
        cy.get('.modal').contains('Add Task').click(); //We're grabbing the matching
                                                     //button that is INSIDE the modal!
        //Verify results:
        cy.get('.task').should('have.length', 1);
        cy.get('.task h2').contains('Sample Task Name');
        cy.get('.task p').contains('Sample Description');
    }) 

    //Testing to see the validation that if you make a note missing summary etc. the modal stays up
    it('should validate user input', () => {
        visitModal();

        verifyValidationWarning();

        cy.get('#title').type('Something');
        verifyValidationWarning();

        cy.get('#title').clear();
        cy.get('#summary').type('Sample Description');
        verifyValidationWarning();

        cy.get('#summary').clear();
        cy.get('#category').select('urgent');
        verifyValidationWarning();
    })

    it('should filter added task', () => {
        visitModal();
        
        fillInModalPrompts('taskName');

        cy.get('.modal').contains('Add Task').click();

        cy.get('.task').should('have.length', 1);
        cy.get('#filter').select('moderate');
        cy.get('.task').should('have.length', 0);
        
        cy.get('#filter').select('urgent');
        cy.get('.task').should('have.length', 1);

    })

    function verifyValidationWarning() {
        cy.get('.modal').contains('Add Task').click(); 
        cy.get('.error-message').contains('Please provide values for task title, summary and category!');
    }

    function visitModal() {
        //Note: .contains() also YIELDS the item!
        cy.visit('http://localhost:5173/');
        cy.contains('Add Task').click();
    }

    function fillInModalPrompts(taskName) {
        cy.get('#title').type(taskName);
        cy.get('#summary').type('Sample Description');
        cy.get('#category').select('urgent');
    }

    it('should add multiple tasks', () => {
        visitModal();
        fillInModalPrompts('TASK 1');
        cy.get('.modal').contains('Add Task').click();
        cy.get('.task').should('have.length', 1);

        cy.contains('Add Task').click();
        fillInModalPrompts('TASK 2');
        cy.get('.modal').contains('Add Task').click();
        cy.get('.task').should('have.length', 2);

        //Verify that task two comes after task 1!
        cy.get('.task').eq(0).contains('TASK 1'); //eq documentation: Get A DOM element at a specific index in an array of elements.
        cy.get('.task').eq(1).contains('TASK 2');
    })
})

