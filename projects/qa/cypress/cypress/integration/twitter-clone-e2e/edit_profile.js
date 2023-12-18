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

  it("2- Edge case: The user can change his name and have the same name as another user", () => {
    // 2.1: The user clicks on his personal menu located in the navigation bar
    cy.get("button#menu-button--menu").click();

    // 2.2: The user enters his profile
    cy.get("a#option-0--menu--1").click();

    cy.wait(1000);
    // 2.3: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // 2.4: The user changes his name from "John" to "Johnny"
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Name:")
      .next("input")
      .clear();
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Name:")
      .next("input")
      .type("Johnny");

    // 2.5: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A green sentence appears "Profile successfully updated!"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", "Profile successfully updated!")
      .should("have.css", "color", "rgb(62, 142, 65)");

    // 2.6: The user Clicks on "Go back" button
    cy.get('button[class*="CancelButton"]').click();

    /*
    Expected result:
    The user is in his profile

    The name of his profile changed to "Johnny"
    */
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find("img")
      .next()
      .should("have.text", "Johnny");
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");
  });

  it("3- Edge case: The user cannot leave the name empty", () => {
    // 3.1: The user clicks on his personal menu located in the navigation bar
    cy.get("button#menu-button--menu").click();

    // 3.2: The user enters his profile
    cy.get("a#option-0--menu--1").click();

    // 3.3: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // 3.4: The user leaves the name textbox empty
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Name:")
      .next("input")
      .clear();

    // Expected result: The name textbox is empty
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Name:")
      .next("input")
      .should("have.value", "");

    // 3.5: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A red sentence appears: ""name" is not allowed to be empty"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", '"name" is not allowed to be empty')
      .should("have.css", "color", "rgb(226, 61, 104)");

    // 3.6: The user clicks on "Go back" button
    cy.get('button[class*="CancelButton"]').click();

    /*
    Expected result:
    The user is in his profile
    The name of the profile is still "John"
    */
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find("img")
      .next()
      .should("have.text", "John");
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");

    // 3.7: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // Expected result: The name textbox contains "John" which is the original name
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Name:")
      .next("input")
      .should("have.value", "John");
  });

  it("4- Nominal case: The user can change his bio", () => {
    // 4.1: The user clicks on his personal menu located in the navigation bar
    cy.get("button#menu-button--menu").click();

    // 4.2: The user enters his profile
    cy.get("a#option-0--menu--1").click();

    // 4.3: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // 4.4: The user writes in bio textbox: "Blood type A+   Age 23"
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Bio:")
      .next("input")
      .type("Blood type A+   Age 23");

    // 4.5: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A green sentence appears "Profile successfully updated!"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", "Profile successfully updated!")
      .should("have.css", "color", "rgb(62, 142, 65)");

    // 4.6: The user clicks on "Go back" button
    cy.get('button[class*="CancelButton"]').click();

    /*
    Expected result:
    The user is in his profile
    The bio "Blood type A+   Age 23" appears on the profile
    */
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find("img")
      .next()
      .should("have.text", "John");
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");
    cy.get('div[class*="Profile___StyledDiv5"] > div:first').should(
      "have.text",
      "Blood type A+   Age 23"
    );

    // 4.7: The user clicks on "All profiles" in the navigation bar
    cy.get('nav[class*="MainNav"]').contains("a", "All profiles").click();

    // Expected result: The profile with username "@john" has the bio  "Blood type A+   Age 23"
    cy.get('ul[class*="ProfilesList"]')
      .find("li:nth-child(1)")
      .find('div[class*="TextContainer"]')
      .find("p:nth-child(2)")
      .should("have.text", "@john");
    cy.get('ul[class*="ProfilesList"]')
      .find("li:nth-child(1)")
      .find('div[class*="TextContainer"]')
      .find("p:nth-child(3)")
      .should("have.text", "Blood type A+   Age 23");
  });

  it("5- Nominal case: The user can change his location", () => {
    // 5.1: The user clicks on his personal menu located in the navigation bar
    cy.get("button#menu-button--menu").click();

    // 5.2: The user enters his profile
    cy.get("a#option-0--menu--1").click();

    // 5.3: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // 5.4: The user writes in the location textbox: "Boulevard street 10+"
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Location:")
      .next("input")
      .type("Boulevard street 10+");

    // 5.5: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A green sentence appears "Profile successfully updated!"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", "Profile successfully updated!")
      .should("have.css", "color", "rgb(62, 142, 65)");

    // 5.6: The user clicks on "Go back" button
    cy.get('button[class*="CancelButton"]').click();

    /*
    Expected result:
        The user is in his profile
        The location "Boulevard street 10+" appears on the profile
    */
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");
    cy.get('div[class*="Profile___StyledDiv6"] > div:first').should(
      "have.text",
      " Boulevard street 10+"
    );
  });

  it("6- Nominal case: The user can change his website", () => {
    // 6.1: The user clicks on his personal menu located in the navigation bar
    cy.get("button#menu-button--menu").click();

    // 6.2: The user enters his profile
    cy.get("a#option-0--menu--1").click();

    // 6.3: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // 6.4: The user writes in the website textbox: john.com
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Website:")
      .next("input")
      .type("john.com");

    // 6.5: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A green sentence appears "Profile successfully updated!"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", "Profile successfully updated!")
      .should("have.css", "color", "rgb(62, 142, 65)");

    // 6.6: The user clicks on "Go back" button
    cy.get('button[class*="CancelButton"]').click();

    /*
    Expected result:
    The user is in his profile
    The website "john.com" appears on the profile
    */
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");
    cy.get('div[class*="Profile___StyledDiv6"] > div:first').should(
      "have.text",
      " john.com"
    );
  });

  it("7- Edge case: The user must write a valid URL as his website", () => {
    // 7.1: The user clicks on his personal menu located in the navigation bar
    cy.get("button#menu-button--menu").click();

    // 7.2: The user enters his profile
    cy.get("a#option-0--menu--1").click();

    // 7.3: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // 7.4: The user writes in the website textbox: john.com
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Website:")
      .next("input")
      .type("john.com");

    // 7.5: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A green sentence appears "Profile successfully updated!"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", "Profile successfully updated!")
      .should("have.css", "color", "rgb(62, 142, 65)");

    // 7.6: The user writes in the website textbox: john
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Website:")
      .next("input")
      .clear();
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Website:")
      .next("input")
      .type("john");

    // 7.7: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A red sentence appears: ""website" must be a valid url"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", '"website" must be a valid url')
      .should("have.css", "color", "rgb(226, 61, 104)");

    // 7.8: The user clicks on "Go back" button
    cy.get('button[class*="CancelButton"]').click();

    /*
    Expected result:
    The user is in his profile
    The website "john.com" appears instead of "john"on the profile
    */
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");
    cy.get('div[class*="Profile___StyledDiv6"] > div:first').should(
      "have.text",
      " john.com"
    );
  });

  it("8- Edge case: The user cannot leave the website textbox empty after it had contained a URL ", () => {
    // 8.1: The user clicks on his personal menu located in the navigation bar
    cy.get("button#menu-button--menu").click();

    // 8.2: The user enters his profile
    cy.get("a#option-0--menu--1").click();

    // 8.3: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // 8.4: The user writes in the website textbox: john.com
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Website:")
      .next("input")
      .type("john.com");

    // 8.5: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A green sentence appears "Profile successfully updated!"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", "Profile successfully updated!")
      .should("have.css", "color", "rgb(62, 142, 65)");

    // 8.6:The user empty the website textbox
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Website:")
      .next("input")
      .clear();

    // 8.7: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    // Expected result: A red sentence appears: "Profile validation failed: website: Website must be a valid URL"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should(
        "have.text",
        "Profile validation failed: website: Website must be a valid URL"
      )
      .should("have.css", "color", "rgb(226, 61, 104)");

    // 8.8: The user clicks on "Go back" button
    cy.get('button[class*="CancelButton"]').click();

    // Expected result: The website "john.com" appears in his profile
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");
    cy.get('div[class*="Profile___StyledDiv6"] > div:first').should(
      "have.text",
      " john.com"
    );
  });

  it("9- Nominal case: The user can change his avatar", () => {
    // 9.1: The user clicks on his personal menu located in the navigation bar
    cy.get("button#menu-button--menu").click();

    // 9.2: The user enters his profile
    cy.get("a#option-0--menu--1").click();

    cy.wait(1000);
    // 9.3: The user clicks on "edit profile" button
    cy.get('a[class*="EditProfileButton"]').click();

    // 9.4: The user writes in the avatar textbox: "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"   (This URL gives a photo of a black dog)
    cy.get('form[class*="StyledForm"]')
      .contains("label", "Avatar (URL):")
      .next("input")
      .type(
        "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
        { delay: 50 }
      );

    // 9.5: The user clicks on "Update profile" button
    cy.get('button[class*="SaveButton"]').click();

    cy.wait(1000);

    // Expected result: A green sentence appears "Profile successfully updated!"
    cy.get('div[class*="EditProfile"]')
      .find('div[class*="FeedbackMessage"]')
      .should("have.text", "Profile successfully updated!")
      .should("have.css", "color", "rgb(62, 142, 65)");

    // 9.6: The user clicks on "Go back" button
    cy.get('button[class*="CancelButton"]').click();

    /*
    Expected result:
    The user is in his profile
    The avatar has a photo of a black dog
    */
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find('span[class*="Profile___StyledSpan2"]')
      .should("have.text", "@john");
    cy.get('div[class*="Profile___StyledDiv4"]')
      .find("img")
      .should(
        "have.attr",
        "src",
        "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"
      );

    // 9.7: The user clicks on "All profiles" in the navigation bar
    cy.get('nav[class*="MainNav"]').contains("a", "All profiles").click();

    // Expected result: The profile with the username "@john" have a photo of a black dog in the avatar
    cy.get('ul[class*="ProfilesList"]')
      .find("li:nth-child(1)")
      .find('div[class*="TextContainer"]')
      .find("p:nth-child(2)")
      .should("have.text", "@john");

    cy.get('ul[class*="ProfilesList"]')
      .find("li:nth-child(1)")
      .find('div[class*="FlexContainer"]')
      .find("img")
      .should(
        "have.attr",
        "src",
        "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"
      );

    // 9.8: The user clicks on "Home" in the navigation bar
    cy.get("ul").contains("a", "Home").click();

    // Expected result: The tweet has a photo of a black dog in his avatar
    cy.get('div[class*="Homepage"]')
      .find("ul li:nth-child(1)")
      .find("img")
      .should(
        "have.attr",
        "src",
        "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"
      );

    // 9.9: Expected result: The user's personal menu has a photo of a black dog
    cy.get('button[data-cy="auth-nav-dropdown-button"]')
      .find("img")
      .should("exist");
  });
});
