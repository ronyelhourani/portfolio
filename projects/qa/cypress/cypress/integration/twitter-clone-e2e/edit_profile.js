/// <reference types="Cypress" />

describe("Feature: Edit profile", () => {
  beforeEach(() => {
    // Prereq.: The database is empty. There are no users in the database
    cy.exec(".\\cypress\\scripts\\twitter-clone-e2e\\clear_mongo.bat");

    /*
        Import the data in "twitter clone test data/9- EDIT PROFILE" in mongoDb
        The data contains:
            (1) User John (username: john; email: john@gmail.com; password: Clonejohn23)
            (2) User Johnny (username: johnny; email: johnny@gmail.com; password: Clonejohnny23)
      */
    cy.exec(
      ".\\cypress\\scripts\\twitter-clone-e2e\\import_data_to_mongo.bat users .\\cypress\\fixtures\\twitter-clone-e2e\\edit_profile\\twitter-clone-db.users.json"
    );
    cy.exec(
      ".\\cypress\\scripts\\twitter-clone-e2e\\import_data_to_mongo.bat profiles .\\cypress\\fixtures\\twitter-clone-e2e\\edit_profile\\twitter-clone-db.profiles.json"
    );
    cy.exec(
      ".\\cypress\\scripts\\twitter-clone-e2e\\import_data_to_mongo.bat tweets .\\cypress\\fixtures\\twitter-clone-e2e\\edit_profile\\twitter-clone-db.tweets.json"
    );

    // Prereq.: Open Twitter-Clone and sign in as John
    cy.visit(Cypress.env("twitterCloneBaseUrl"));
    cy.get('a[data-cy="nav-signin-link"]').click();
    cy.get('form[data-cy="signin-form"]')
      .find('input[data-cy="signin-username-input"]')
      .type("john");
    cy.get('form[data-cy="signin-form"]')
      .find('input[data-cy="signin-password-input"]')
      .type("Clonejohn23");
    cy.get('form[data-cy="signin-form"]')
      .find('button[data-cy="signin-button"]')
      .click();
  });

  it("1- Nominal case: The user can change his name ", () => {
    // 1.1: The user clicks on his personal menu located in the navigation bar
    cy.get("button#menu-button--menu").click();

    // 1.2: The user enters his profile
    cy.get("a#option-0--menu--1").click();

    // Expected result: The user's profile has name "John" and username "@john"
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find("img")
      .next()
      .should("have.text", "John");
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");

    // 1.3: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // 1.4: The user changes his name from "John" to "Rony"
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Name:")
      .next("input")
      .clear();
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Name:")
      .next("input")
      .type("Rony");

    // 1.5: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A green sentence appears "Profile successfully updated!"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", "Profile successfully updated!")
      .should("have.css", "color", "rgb(62, 142, 65)");

    // 1.6: The user Clicks on "Go back" button
    cy.get('button[class*="CancelButton"]').click();

    /*
    Expected result:
        The user is in his profile

        The name of his profile changed to "Rony"
    */
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find("img")
      .next()
      .should("have.text", "Rony");
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");

    // 1.7: The user clicks on "All profiles" in the navigation bar
    cy.get('nav[class*="MainNav"]').contains("a", "All profiles").click();

    // Expected result: The name of the profile with username "@john" has also changed to "Rony"
    cy.get('ul[class*="ProfilesList"]')
      .find("li:nth-child(1)")
      .find('div[class*="TextContainer"]')
      .find("p:nth-child(1)")
      .should("have.text", "Rony");

    cy.get('ul[class*="ProfilesList"]')
      .find("li:nth-child(1)")
      .find('div[class*="TextContainer"]')
      .find("p:nth-child(2)")
      .should("have.text", "@john");

    // 1.8: The user clicks on "Home"
    cy.get("ul").contains("a", "Home").click();

    // Expected result: The name of the profile with username "@john" has also changed to "Rony"
    // Name of the author
    cy.get('div[class*="Homepage"]')
      .find('div[class*="TweetUserGroup"]')
      .find('span[class*="TweetUserName"]')
      .should("have.text", "Rony");

    // Username of the author
    cy.get('div[class*="Homepage"]')
      .find('div[class*="TweetUserGroup"]')
      .find("span:nth-child(2)")
      .should("have.text", "@john");

    // 1.9: The user clicks on personal menu
    cy.get("button#menu-button--menu").click();

    // Expected result: The name is updated to "Rony"
    cy.get('div[class*="MenuPopover"]')
      .find("div:nth-child(1) p:nth-child(1)")
      .should("have.text", "Rony");
    cy.get('div[class*="MenuPopover"]')
      .find("div:nth-child(1) p:nth-child(2)")
      .should("have.text", "@john");
  });
});