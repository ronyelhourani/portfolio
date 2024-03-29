/// <reference types="Cypress" />

describe("Feature: Sign In", () => {
  beforeEach(() => {
    // Prereq.: The database is empty. There are no users in the database
    cy.exec(".\\cypress\\scripts\\clear_mongo.bat twitter-clone-db");

    /*
      Prereq.:
  
      Import the data in "twitter clone test data/2- SIN IN" in mongoDb
      (The data contains a user named John with username "john", email "john@gmail.com" and password "Clonejohn23")
      */
    cy.exec(
      ".\\cypress\\scripts\\import_data_to_mongo.bat twitter-clone-db users .\\cypress\\fixtures\\twitter-clone-e2e\\sign-in\\twitter-clone-db.users.json"
    );

    cy.exec(
      ".\\cypress\\scripts\\import_data_to_mongo.bat twitter-clone-db profiles .\\cypress\\fixtures\\twitter-clone-e2e\\sign-in\\twitter-clone-db.profiles.json"
    );

    // Prereq.: Open Twitter-Clone as an anonymous user
    cy.visit(Cypress.env("twitterCloneBaseUrl"));
  });

  it("1- Nominal case: The user signs in by typing the username", () => {
    // 1.1: Expected result: The "Sign in" button is present in the navigation bar
    cy.get('a[data-cy="nav-signin-link"]').should("exist");

    // 1.2: The user clicks on the "Sign in" button
    cy.get('a[data-cy="nav-signin-link"]').click();

    /*
    1.3:
    The user fills the "Sign in" form:
        - Username: john
        - Password: Clonejohn23
    */
    cy.get('form[data-cy="signin-form"]')
      .find('input[data-cy="signin-username-input"]')
      .type("john");
    cy.get('form[data-cy="signin-form"]')
      .find('input[data-cy="signin-password-input"]')
      .type("Clonejohn23");

    // 1.4: The user clicks the "Log In" submit button
    cy.get('form[data-cy="signin-form"]')
      .find('button[data-cy="signin-button"]')
      .click();

    /*
    Expected result:
    The user enters his account (the user is signed-in)
    The user is taken to the “Home” page
    The “Sign In” button in the navigation bar disappears (Only anonymous user can see the “Sign In” button in the navigation bar
    */
    cy.assertSuccesfullSignIn();
  });

  it("2- Nominal case: The user signs in by typing the email ", () => {
    /*
    2.1:
    The user enters the "Sign In" page and fills the "Sign in" form:
        - Email: john@gmail.com
        - Password: Clonejohn23
    */
    // 2.2: The user clicks the "Log In" submit button

    cy.signInTwitterClone("john@gmail.com", "Clonejohn23");

    /*
    Expected result:
    The user enters his account (the user is signed-in)
    The user is taken to the “Home” page
    The “Sign In” button in the navigation bar disappears (Only anonymous user can see the “Sign In” button in the navigation bar
    */
    cy.assertSuccesfullSignIn();
  });

  it("3- Nominal case: The user signs in by typing the username or email wrong ", () => {
    /*
    3.1:
    The user enters the "Sign In" page and fills the "Sign in" form:
        - Username or email: joh
        - Password: Clonejohn23
    */
    // 3.2: The user click the "Log In" submit button
    cy.signInTwitterClone("joh", "Clonejohn23");

    // Expected result: A red sentence appears: "Invalid login credentials"
    cy.contains("h1", "Sign In")
      .next("p")
      .should("have.text", "Invalid login credentials")
      .should("have.css", "color", "rgb(226, 61, 104)");
  });

  it("4- Nominal case: The user signs in by typing the password wrong ", () => {
    /*
    4.1:
    The user enters the "Sign In" page and fills the "Sign in" form:
        - Username: john
        - Password: Clonejohn2
    */
    // 4.2: The user click the "Log In" submit button
    cy.signInTwitterClone("john", "Clonejohn2");

    // Expected result: A red sentence appears: "Invalid login credentials"
    cy.contains("h1", "Sign In")
      .next("p")
      .should("have.text", "Invalid login credentials")
      .should("have.css", "color", "rgb(226, 61, 104)");
  });

  it("5- Edge case: The user signs in by keeping the username or email empty", () => {
    /*
    5.1: 
    The user enters the "Sign In" page and fills the "Sign in" form:
      - Username or email: (empty)
      - Password: Clonejohn23
    */
    cy.get('a[data-cy="nav-signin-link"]').click();
    cy.get('form[data-cy="signin-form"]')
      .find('input[data-cy="signin-password-input"]')
      .type("Clonejohn23");

    // 5.2: The user click the "Log In" submit button
    cy.get('form[data-cy="signin-form"]')
      .find('button[data-cy="signin-button"]')
      .click();

    // Expected result: A red sentence appears: "Username is required"
    cy.get('input[data-cy="signin-username-input"]')
      .next("div")
      .should("have.text", "username is required")
      .should("have.css", "color", "rgb(226, 61, 104)");
  });

  it("6- Edge case: The user signs in by keeping the password empty", () => {
    /*
    6.1:
    The user enters the "Sign In" page and fills the "Sign in" form:
      - Username or email: John
      - Password: (empty)
    */
    cy.get('a[data-cy="nav-signin-link"]').click();
    cy.get('form[data-cy="signin-form"]')
      .find('input[data-cy="signin-username-input"]')
      .type("john");

    // 6.2: The user click the "Log In" submit button
    cy.get('form[data-cy="signin-form"]')
      .find('button[data-cy="signin-button"]')
      .click();

    // Expected result: A red sentence appears: "Password is required"
    cy.get('input[data-cy="signin-password-input"]')
      .next("div")
      .should("have.text", "password is required")
      .should("have.css", "color", "rgb(226, 61, 104)");
  });

  it("7- Edge case: The user signs in by keeping both the username or email and password empty", () => {
    // 7.1: The user enters the "Sign In" page and does not fill the "Sign in" form
    cy.get('a[data-cy="nav-signin-link"]').click();

    // 7.2: The user clicks the "Log In" submit button
    cy.get('form[data-cy="signin-form"]')
      .find('button[data-cy="signin-button"]')
      .click();

    // Expected result: 2 red sentences appears: "Username is required" and "Password is required"
    cy.get('input[data-cy="signin-username-input"]')
      .next("div")
      .should("have.text", "username is required")
      .should("have.css", "color", "rgb(226, 61, 104)");

    cy.get('input[data-cy="signin-password-input"]')
      .next("div")
      .should("have.text", "password is required")
      .should("have.css", "color", "rgb(226, 61, 104)");
  });

  it("8- Nominal case: The user can go to the Sign Up page from the Sign In page", () => {
    // 8.1: The user enters the "Sign In" page
    cy.get('a[data-cy="nav-signin-link"]').click();

    // 8.2: The user clicks on the "Sign up now" link
    cy.contains("a", "Sign up now").click();

    // Expected result: The user is sent to the "Sign Up" page
    cy.get("ul").contains("a", "Sign Up").should("have.class", "active");
  });
});
