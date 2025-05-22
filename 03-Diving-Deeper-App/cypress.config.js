import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 40.0,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        seedDatabase(fileName) {
          //Run your NodeJS code!
          //edit a file here, run sql stuff, etc. 
          //This code is called within the tests, but is ran OUTSIDE of the browser!
          return fileName;
        }
      })
    },
  },
});
