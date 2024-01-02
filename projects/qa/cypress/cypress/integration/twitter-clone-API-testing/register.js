/// <reference types="Cypress" />

describe("Feature: Register", () => {
  beforeEach(() => {
    // Prereq.: The database is empty. There are no users in the database
    cy.exec(".\\cypress\\scripts\\twitter-clone-e2e\\clear_mongo.bat");

    /*
      Prereq.:
  
      Import the data in "twitter clone test data/ REGISTER" in mongoDb 
      (The data contains a user named John with username "john", email "john@gmail.com" and password "Clonejohn23")
      */
    cy.exec(
      ".\\cypress\\scripts\\twitter-clone-e2e\\import_data_to_mongo.bat users .\\cypress\\fixtures\\twitter-clone-API-testing\\register\\twitter-clone-db.users.json"
    );
    cy.exec(
      ".\\cypress\\scripts\\twitter-clone-e2e\\import_data_to_mongo.bat profiles .\\cypress\\fixtures\\twitter-clone--API-testing\\register\\twitter-clone-db.profiles.json"
    );
  });

  it("1- POST /auth/register creates a user's account", () => {
    // Get the current date (year-month-day) for the assertion of createdAt and updatedAt
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const year = currentDate.getFullYear();
    const formattedDateTime = `${year}-${month}-${day}`;

    // Define the request payload
    const payload = {
      name: "Rony",
      email: "rony@gmail.com",
      username: "rony",
      password: "Clonerony23",
    };

    // Make the POST request
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: payload,
    }).then((response) => {
      // Assertion 1: Assert that the response status is 201
      expect(response.status).to.equal(201);

      // Assertion 2: Assert that the response body contains the correct data (name, email, username, createdAt, updatedAt)
      expect(response.body.user).to.have.property("name", "Rony");
      expect(response.body.user).to.have.property("email", "rony@gmail.com");
      expect(response.body.user).to.have.property("username", "rony");
      expect(response.body.user.createdAt).to.include(formattedDateTime);
      expect(response.body.user.updatedAt).to.include(formattedDateTime);

      //   Assertion 3: Assert that the user's account was truly created after registration (Sign Up). We will get the user details by using user's ID and user's token and assert the data is correct
      const userId = response.body.user._id;
      const token = response.body.token;
      cy.request({
        method: "GET",
        url: `http://localhost:3001/api/users/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((getUserResponse) => {
        // Assert that the GET response status is 200
        expect(getUserResponse.status).to.equal(200);

        // Assert that the user details are correct in the GET response
        expect(getUserResponse.body.user).to.have.property("name", "Rony");
        expect(getUserResponse.body.user).to.have.property(
          "email",
          "rony@gmail.com"
        );
        expect(getUserResponse.body.user).to.have.property("username", "rony");
      });
    });
  });

  it("2- POST /auth/register cannot create more than one account with the same username", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "Johnny",
        email: "Johnny@gmail.com",
        username: "john",
        password: "Clonejohnny23",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: status is 400
      expect(response.status).to.equal(400);
      // Assertion 2: error message is "Username already taken"
      expect(response.body.message).to.equal("Username already taken");
    });
  });

  it("3- POST /auth/register cannot create more than one account with the same email", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "Johnny",
        email: "John@gmail.com",
        username: "johnny",
        password: "Clonejohnny23",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: status is 400
      expect(response.status).to.equal(400);
      // Assertion 2: error message is "Email already taken"
      expect(response.body.message).to.equal("Email already taken");
    });
  });

  it("4- POST /auth/register can create multiple users with the same name", () => {
    // Get the current date (year-month-day) for the assertion of createdAt and updatedAt
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const year = currentDate.getFullYear();
    const formattedDateTime = `${year}-${month}-${day}`;

    // Define the request payload
    const payload = {
      name: "John",
      email: "johnny@gmail.com",
      username: "johnny",
      password: "Clonejohnny23",
    };

    // Make the POST request
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: payload,
    }).then((response) => {
      // Assertion 1: Assert that the response status is 201
      expect(response.status).to.equal(201);

      // Assertion 2: Assert that the response body contains the correct data (name, email, username, createdAt, updatedAt)
      expect(response.body.user).to.have.property("name", "John");
      expect(response.body.user).to.have.property("email", "johnny@gmail.com");
      expect(response.body.user).to.have.property("username", "johnny");
      expect(response.body.user.createdAt).to.include(formattedDateTime);
      expect(response.body.user.updatedAt).to.include(formattedDateTime);

      //   Assertion 3: Assert that the user's account was truly created after registration (Sign Up). We will get the user details by using user's ID and user's token and assert the data is correct
      const userId = response.body.user._id;
      const token = response.body.token;
      cy.request({
        method: "GET",
        url: `http://localhost:3001/api/users/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((getUserResponse) => {
        // Assert that the GET response status is 200
        expect(getUserResponse.status).to.equal(200);

        // Assert that the user details are correct in the GET response
        expect(getUserResponse.body.user).to.have.property("name", "John");
        expect(getUserResponse.body.user).to.have.property(
          "email",
          "johnny@gmail.com"
        );
        expect(getUserResponse.body.user).to.have.property(
          "username",
          "johnny"
        );
      });
    });
  });

  it("5- POST /auth/register cannot create an account with a wrong email format", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "John",
        email: "johnny#1gmail.com",
        username: "johnny",
        password: "Clonejohnny23",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: status is 400
      expect(response.status).to.equal(400);
      // Assertion 2: error message is "\"email\" must be a valid email"
      expect(response.body.message).to.equal('"email" must be a valid email');
    });
  });

  it("6- POST /auth/register cannot create an account with an empty email", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "Johnny",
        email: "",
        username: "johnny",
        password: "Clonejohnny23",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: status is 400
      expect(response.status).to.equal(400);
      // Assertion 2: error message is "\"email\" is not allowed to be empty"
      expect(response.body.message).to.equal(
        '"email" is not allowed to be empty'
      );
    });
  });

  it("7- POST /auth/register cannot create an account without an email in the payload", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "Johnny",
        username: "johnny",
        password: "Clonejohnny23",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: status is 400
      expect(response.status).to.equal(400);
      // Assertion 2: error message is "\"email\" is required"
      expect(response.body.message).to.equal('"email" is required');
    });
  });

  it("8- POST /auth/register cannot create an account with a password less than 8 characters", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "Johnny",
        email: "johnny@gmail.com",
        username: "johnny",
        password: "johnny",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: status is 400
      expect(response.status).to.equal(400);
      // Assertion 2: error message is "password must be at least 8 characters"
      expect(response.body.message).to.equal(
        "password must be at least 8 characters"
      );
    });
  });

  it("9- POST /auth/register cannot create an account with a password not having at least 1 number", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "Johnny",
        email: "johnny@gmail.com",
        username: "johnny",
        password: "Clonejohnny",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: status is 400
      expect(response.status).to.equal(400);
      // Assertion 2: error message is "password must contain at least 1 letter and 1 number"
      expect(response.body.message).to.equal(
        "password must contain at least 1 letter and 1 number"
      );
    });
  });

  it("10- POST /auth/register cannot create an account with an empty password", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "Johnny",
        email: "johnny@gmail.com",
        username: "johnny",
        password: "",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: status is 400
      expect(response.status).to.equal(400);
      // Assertion 2: error message is "\"password\" is not allowed to be empty"
      expect(response.body.message).to.equal(
        '"password" is not allowed to be empty'
      );
    });
  });

  it("11- POST /auth/register cannot create an account without a password in the payload", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "Johnny",
        email: "johnny@gmail.com",
        username: "johnny",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: status is 400
      expect(response.status).to.equal(400);
      // Assertion 2: error message is "\"password\" is required"
      expect(response.body.message).to.equal('"password" is required');
    });
  });

  it("12- POST /auth/register cannot create an account with a username containing special characters other than the period, dash adn underscore", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3001/api/auth/register",
      body: {
        name: "Johnny",
        email: "johnny@gmail.com",
        username: "johnny#",
        password: "Clonejohnny23",
      },
      failOnStatusCode: false, // Allows the test to continue even if the status code is not 2xx
    }).then((response) => {
      // Assertion 1: error message is "User validation failed: username: username must only contain numbers, letters, \".\", \"-\", \"_\""
      expect(response.body.message).to.equal(
        'User validation failed: username: username must only contain numbers, letters, ".", "-", "_"'
      );
      // Assertion 2: status is 400
      expect(response.status).to.equal(400);
    });
  });
});
