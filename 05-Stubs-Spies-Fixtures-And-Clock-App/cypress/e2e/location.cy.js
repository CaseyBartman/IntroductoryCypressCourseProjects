/// <reference types="cypress" />

describe('share location', () => {

  beforeEach(() => {
    cy.clock();
    cy.fixture('user-location.json').as('userLocation');
    cy.visit('/').then((win) => {
      cy.get('@userLocation').then(fakePosition => {
        //We want to replace how we call getting our current position!
        //We are trying to replace this: navigator.geolocation.getCurrentPosition
        cy.stub(win.navigator.geolocation, 'getCurrentPosition')
          .as('getUserPosition')
          .callsFake((cb) => { //Since getCurrentPosition() in the source code takes a callback function, so will we!
            setTimeout(() => {
              cb(fakePosition);
            }, 100);
          }); //We call the given callback argument, and pass a dummy position to it, so the actual callback is called!

        cy.stub(win.navigator.clipboard, 'writeText')
          .as('saveToClipboard')
          .resolves(); // So, simply calling resolves here is good enough!

        cy.spy(win.localStorage, 'setItem').as('storeLocation');
        cy.spy(win.localStorage, 'getItem').as('getStoredLocation');
      });
    });
  });

  it('should fetch the user location', () => {
    cy.getById('get-loc-btn').click(); //Clicking button to get location
    cy.get('@getUserPosition').should('have.been.called') ;//Note how we use get to access a NON-dom item too here! Cool!
    cy.getById('get-loc-btn').should('be.disabled');
    cy.getById('actions').should('contain', 'Location fetched');
  });

  it('should share a location url', () => {
    cy.getById('name-input').type('John Doe');
    cy.getById('get-loc-btn').click();
    cy.getById('share-loc-btn').click();
    cy.get('@userLocation').then(fakePosition => {
      const { latitude, longitude } = fakePosition.coords;    
        cy.get('@saveToClipboard').should('have.been.called'); //Confirms that the clipboard api has been called
        cy.get('@saveToClipboard')
          .should('have.been.calledWithMatch', new RegExp(`${latitude}.*${longitude}.*${encodeURI('John Doe')}`)) //{latitude}.*{longitude}.*{name};
        //This is checking if the spy has been called 
        cy.get('@storeLocation').should('have.been.calledWithMatch', /John Doe/, new RegExp(`${latitude}.*${longitude}.*${encodeURI('John Doe')}`));
     });
    cy.getById('share-loc-btn').click();
    cy.get('@getStoredLocation').should('have.been.called');
    cy.getById('info-message').should('be.visible');

    //Checking that the banner disappears after a while
    cy.tick(2000);
    cy.getById('info-message').should('not.be.visible');
  })
});
