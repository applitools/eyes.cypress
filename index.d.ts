/// <reference types="Cypress" />
/// <reference path="eyes.ts" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Create an Applitools test.
       * This will start a session with the Applitools server.
       * @example 
       * cy.eyesOpen({ appName: 'My App' })
      */
      eyesOpen(options?: Eyes.Open.Options): null

      /**
       * Generate a screenshot of the current page and add it to the Applitools Test.
       * @example 
       * cy.eyesCheckWindow()
       *
       * OR
       *
       * cy.eyesCheckWindow({
       *  target: 'region',
       *  selector: '.my-element' 
       * });
      */
      eyesCheckWindow(config: Eyes.Check.Options): null

      /**
       * Close the applitools test and check that all screenshots are valid.
       * @example cy.eyesClose()
      */
      eyesClose(): null
    }
  }