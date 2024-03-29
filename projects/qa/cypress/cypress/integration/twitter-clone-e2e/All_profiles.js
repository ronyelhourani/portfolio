/// <reference types="Cypress" />

describe("Feature: All profiles", () => {
  beforeEach(() => {
    // Prereq.: The database is empty. There are no users in the database
    cy.exec(".\\cypress\\scripts\\clear_mongo.bat twitter-clone-db");

    /*
        Import the data in "twitter clone test data/5- VISIT ALL PROFILES" in mongoDb
        The data contains the users:
            (1) Name: John (username: john; email: john@gmail.com; password: Clonejohn23)
            (2) Name: Paul (username: paul; email: paul@gmail.com; password: Clonepaul23)
            (3) Name: Rony (username: rony; email: rony@gmail.com; password: Clonerony23)
            (4) Name: Kevin (username: kevin; email: kevin@gmail.com; password: Clonekevin23)
            (5) Name: Julia (username: julia; email: julia@gmail.com; password: Clonejulia23)
    */
    cy.exec(
      ".\\cypress\\scripts\\import_data_to_mongo.bat twitter-clone-db users .\\cypress\\fixtures\\twitter-clone-e2e\\visit_all_profiles\\twitter-clone-db.users.json"
    );

    cy.exec(
      ".\\cypress\\scripts\\import_data_to_mongo.bat twitter-clone-db profiles .\\cypress\\fixtures\\twitter-clone-e2e\\visit_all_profiles\\twitter-clone-db.profiles.json"
    );

    // Prereq.: Open Twitter-Clone as an anonymous user
    cy.visit(Cypress.env("twitterCloneBaseUrl"));
  });

  it("1- Nominal case: An anonymous user can see the profiles in All profiles page", () => {
    // 1.1: An anonymous user clicks on "All profiles" button in the navigation bar
    cy.get('nav[class*="MainNav"]').contains("a", "All profiles").click();

    /*
    There are 5 users displayed with their name and username, and they are sorted from oldest member to newest member (left to right; top to bottom)
        John  @john
        Paul  @paul
        Rony  @rony
        Kevin  @kevin
        Julia     @julia
    */
    cy.checkIfAllFiveUsersJohnPaulRonyKevinJuliaAreInThePageAllProfilesAndSortedFromOldestTopToNewestBottomInTwitterClone();
  });

  it("2- Nominal case: An anonymous user can access a user's profile through All profiles page", () => {
    // 2.1: An anonymous user clicks on "All profiles" button in the navigation bar
    cy.get('nav[class*="MainNav"]').contains("a", "All profiles").click();

    // 2.2: An anonymous user clicks on the link related to the profile of Paul
    cy.get('ul[class*="ProfilesList"]')
      .find("li:nth-child(2)")
      .find('div[class*="TextContainer"]')
      .find("p:nth-child(2)")
      .should("have.text", "@paul")
      .click();

    // Expected result: An anonymous user is in the profile of Paul
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find("img")
      .next()
      .should("have.text", "Paul");
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@paul");
  });

  it("3- Nominal case: The logged-in user can see the profiles in All profiles page", () => {
    // 3.1: The user signs in as John
    cy.signInTwitterClone("john", "Clonejohn23");

    // 3.2: The user clicks on "All profiles" button in the navigation bar
    cy.get('nav[class*="MainNav"]').contains("a", "All profiles").click();

    /*
    Expected result:
    There are 5 users displayed with their name and username, and they are sorted from oldest member to newest member (left to right; top to bottom)
        John  @john
        Paul  @paul
        Rony  @rony
        Kevin  @kevin
        Julia     @julia
    */
    cy.checkIfAllFiveUsersJohnPaulRonyKevinJuliaAreInThePageAllProfilesAndSortedFromOldestTopToNewestBottomInTwitterClone();
  });

  it("4- Nominal case: The logged-in user can access a user's profile", () => {
    // 4.1: The user signs in as John
    cy.signInTwitterClone("john", "Clonejohn23");

    // 4.2: The user clicks on "All profiles" button in the navigation bar
    cy.get('nav[class*="MainNav"]').contains("a", "All profiles").click();

    // 4.3: The user clicks on the link related to the profile of Paul
    cy.get('ul[class*="ProfilesList"]')
      .find("li:nth-child(2)")
      .find('div[class*="TextContainer"]')
      .find("p:nth-child(2)")
      .should("have.text", "@paul")
      .click();

    // Expected result: The  user is in the profile of Paul
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find("img")
      .next()
      .should("have.text", "Paul");
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@paul");
  });
});
