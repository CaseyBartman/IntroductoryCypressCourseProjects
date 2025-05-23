// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.addQuery('getById', (id) => {
    const getFn = cy.now('get', `[data-cy="${id}"]`); //Allows you to execute any instruction immediately instead of waiting for it!
    //using a template literal to inject the id!
    return () => { //This is the function that is being retried within the 4 second timeframe (or, default one)
        //This inner function is the one that is continually retried!
        return getFn();
    }
});