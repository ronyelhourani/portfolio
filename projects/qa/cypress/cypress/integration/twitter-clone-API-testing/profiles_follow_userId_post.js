/// <reference types="Cypress" />

describe("POST /profiles/follow/{userId}", () => {
  // Declaring the variables in order to be used in the entire test suite
  let johnToken;
  let johnId;
  let ronyToken;
  let ronyId;

  beforeEach(() => {
    // Prereq.: The database is empty. There are no users in the database
    cy.exec(".\\cypress\\scripts\\clear_mongo.bat twitter-clone-db");

    /*
                    Prereq.:
                
                    Import the data in "twitter clone API testing/profiles_follow_userId_post" in mongoDb
                    The data contains the users:
                        1- Name: John (username: john; email: john@gmail.com; password: Clonejohn23)

                         2- Name: Rony (username: rony; email: rony@gmail.com; password: Clonerony23)
                    */
    cy.exec(
      ".\\cypress\\scripts\\import_data_to_mongo.bat twitter-clone-db users .\\cypress\\fixtures\\twitter-clone-API-testing\\profiles_follow_userId_post\\twitter-clone-db.users.json"
    );

    cy.exec(
      ".\\cypress\\scripts\\import_data_to_mongo.bat twitter-clone-db profiles .\\cypress\\fixtures\\twitter-clone-API-testing\\profiles_follow_userId_post\\twitter-clone-db.profiles.json"
    );

    // Sign in as John in order to get John's token and ID
    cy.signInAsJohnAndGetTokenAndIdAsJohnInTwitterCloneApiTesting(
      (token, id) => {
        johnToken = token;
        johnId = id;
      }
    );

    // Sign in as Rony in order to get Rony's token and ID
    cy.signInAsRonyAndGetTokenAndIdAsRonyInTwitterCloneApiTesting(
      (token, id) => {
        ronyToken = token;
        ronyId = id;
      }
    );
  });

  it("1- POST /profiles/follow/{userId} make a user follow another user", () => {
    cy.request({
      method: "POST",
      url: `http://localhost:3001/api/profiles/follow/${ronyId}`,
      headers: {
        Authorization: `Bearer ${johnToken}`,
      },
    }).then((followUserResponse) => {
      // Assertion 1: Status is 200
      expect(followUserResponse.status).to.equal(200);

      // Assertion 2: The response body contains the correct data
      expect(followUserResponse.body.profile.following[0]).to.equal(ronyId);
      expect(followUserResponse.body.profile.following).to.have.lengthOf(1);
      expect(followUserResponse.body.profile.user).to.equal(johnId);
    });
  });

  it("2- POST /profiles/follow/{userId} cannot make a user follow another user with a wrong user ID", () => {
    // Create wrong user ID for testing
    const wrongUserId = "12345";
    cy.request({
      method: "POST",
      url: `http://localhost:3001/api/profiles/follow/${wrongUserId}`,
      headers: {
        Authorization: `Bearer ${johnToken}`,
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((followUserResponse) => {
      // Assertion 1: Status is 400
      expect(followUserResponse.status).to.equal(400);

      // Assertion 2: Error message is "\"userId\" must be a valid mongo id"
      expect(followUserResponse.body.message).to.equal(
        '"userId" must be a valid mongo id'
      );
    });
  });

  it("3- POST /profiles/follow/{userId} cannot make a user follow his own profile", () => {
    cy.request({
      method: "POST",
      url: `http://localhost:3001/api/profiles/follow/${johnId}`,
      headers: {
        Authorization: `Bearer ${johnToken}`,
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((followUserResponse) => {
      // Assertion 1: Status is 400
      expect(followUserResponse.status).to.equal(400);

      // Assertion 2: Error message is "You cannot follow your own profile"
      expect(followUserResponse.body.message).to.equal(
        "You cannot follow your own profile"
      );
    });
  });

  it("4- POST /profiles/follow/{userId} cannot make a user follow another user with a wrong user's token", () => {
    // Create wrong user's token for testing
    const wrongToken = "12345";

    cy.request({
      method: "POST",
      url: `http://localhost:3001/api/profiles/follow/${ronyId}`,
      headers: {
        Authorization: `Bearer ${wrongToken}`,
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((followUserResponse) => {
      // Assertion 1: Status is 401
      expect(followUserResponse.status).to.equal(401);

      // Assertion 2: Error message is "You are not authenticated"
      expect(followUserResponse.body.message).to.equal(
        "You are not authenticated"
      );
    });
  });

  it("5- POST /profiles/follow/{userId} cannot make a user follow another user without a user's token", () => {
    cy.request({
      method: "POST",
      url: `http://localhost:3001/api/profiles/follow/${ronyId}`,
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((followUserResponse) => {
      // Assertion 1: Status is 401
      expect(followUserResponse.status).to.equal(401);

      // Assertion 2: Error message is "You are not authenticated"
      expect(followUserResponse.body.message).to.equal(
        "You are not authenticated"
      );
    });
  });

  it("6- POST /profiles/follow/{userId} cannot make a user follow another user twice in a row", () => {
    // John follows Rony the first time
    cy.request({
      method: "POST",
      url: `http://localhost:3001/api/profiles/follow/${ronyId}`,
      headers: {
        Authorization: `Bearer ${johnToken}`,
      },
    });

    // John follows Rony the second time (activate the "follow" function the second time in a row)
    cy.request({
      method: "POST",
      url: `http://localhost:3001/api/profiles/follow/${ronyId}`,
      headers: {
        Authorization: `Bearer ${johnToken}`,
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((followUserResponse) => {
      // Assertion 1: Status is 400
      expect(followUserResponse.status).to.equal(400);

      // Assertion 2: Error message is "You already follow that profile"
      expect(followUserResponse.body.message).to.equal(
        "You already follow that profile"
      );
    });
  });
});
