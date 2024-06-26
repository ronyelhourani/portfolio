/// <reference types="Cypress" />

describe("API test for endpoint GET /alpha/{code}", () => {
  it("1- Request for a country by its cca2 (normal usage)", () => {
    cy.request("GET", "https://restcountries.com/v3.1/alpha/US").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only 1 country");

        // Assertion 3: This one country is United States ("cca2": "US", "ccn3": "840", "cca3": "USA", "cioc": "USA")
        const usa = response.body[0];
        expect(usa.name.common).to.equal("United States");
        expect(usa.name.official).to.equal("United States of America");
        expect(usa.cca2).to.equal("US");
        expect(usa.ccn3).to.equal("840");
        expect(usa.cca3).to.equal("USA");
        expect(usa.cioc).to.equal("USA");

        // Assertion 4: All the properties related to United States are present
        const expectedProperties = [
          "name",
          "tld",
          "cca2",
          "ccn3",
          "cca3",
          "cioc",
          "independent",
          "status",
          "unMember",
          "currencies",
          "idd",
          "capital",
          "altSpellings",
          "region",
          "subregion",
          "languages",
          "translations",
          "latlng",
          "landlocked",
          "borders",
          "area",
          "demonyms",
          "flag",
          "maps",
          "population",
          "gini",
          "fifa",
          "car",
          "timezones",
          "continents",
          "flags",
          "coatOfArms",
          "startOfWeek",
          "capitalInfo",
          "postalCode",
        ];

        expectedProperties.forEach((property) => {
          expect(usa).to.have.property(property);
        });
      }
    );
  });

  it("2- Request for a country by its ccn3 (normal usage)", () => {
    cy.request("GET", "https://restcountries.com/v3.1/alpha/076").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only 1 country");

        // Assertion 3: This one country is Brazil ("cca2": "BR",  "ccn3": "076", "cca3": "BRA",  "cioc": "BRA")
        const brazil = response.body[0];
        expect(brazil.name.common).to.equal("Brazil");
        expect(brazil.name.official).to.equal("Federative Republic of Brazil");
        expect(brazil.cca2).to.equal("BR");
        expect(brazil.ccn3).to.equal("076");
        expect(brazil.cca3).to.equal("BRA");
        expect(brazil.cioc).to.equal("BRA");
      }
    );
  });

  it("3- Request for a country by its cca3 (normal usage)", () => {
    cy.request("GET", "https://restcountries.com/v3.1/alpha/CHL").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only 1 country");

        // Assertion 3: This one country is Chile ("cca2": "CL",  "ccn3": "152", "cca3": "CHL", "cioc": "CHI")
        const chile = response.body[0];
        expect(chile.name.common).to.equal("Chile");
        expect(chile.name.official).to.equal("Republic of Chile");
        expect(chile.cca2).to.equal("CL");
        expect(chile.ccn3).to.equal("152");
        expect(chile.cca3).to.equal("CHL");
        expect(chile.cioc).to.equal("CHI");
      }
    );
  });

  it("4- Request for a country by its cioc (normal usage)", () => {
    cy.request("GET", "https://restcountries.com/v3.1/alpha/UAE").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only 1 country");

        // Assertion 3: This one country is United Arab Emirates ("cca2": "AE", "ccn3": "784", "cca3": "ARE",  "cioc": "UAE")
        const uae = response.body[0];
        expect(uae.name.common).to.equal("United Arab Emirates");
        expect(uae.name.official).to.equal("United Arab Emirates");
        expect(uae.cca2).to.equal("AE");
        expect(uae.ccn3).to.equal("784");
        expect(uae.cca3).to.equal("ARE");
        expect(uae.cioc).to.equal("UAE");
      }
    );
  });

  it("5- Test the properties 'cca2', 'ccn3', 'cca3' and 'cioc' by showing that the endpoint performs a case-insensitive match against the country's cca2, ccn3, cca3, cioc", () => {
    cy.request("GET", "https://restcountries.com/v3.1/alpha/eS").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only 1 country");

        // Assertion 3: This one country is Spain ("cca2": "ES", "ccn3": "724",  "cca3": "ESP",  "cioc": "ESP")
        const spain = response.body[0];
        expect(spain.name.common).to.equal("Spain");
        expect(spain.name.official).to.equal("Kingdom of Spain");
        expect(spain.cca2).to.equal("ES");
        expect(spain.ccn3).to.equal("724");
        expect(spain.cca3).to.equal("ESP");
        expect(spain.cioc).to.equal("ESP");
      }
    );
  });

  it("6- Test the properties 'cca2', 'ccn3', 'cca3' and 'cioc' by showing that the endpoint performs a perfect match against a country's cca2, ccn3, cca3, cioc. The endpoint is false, thus an error message is expected", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/alpha/72",
      failOnStatusCode: false, // Do not fail the test on non-2xx status codes
    }).then((response) => {
      // Assertion 1: Response is 404
      expect(response.status).to.eq(404);

      // Assertion 2: The message is "Not Found"
      expect(response.body).to.deep.equal({
        status: 404,
        message: "Not Found",
      });
    });
    cy.wait(1000);
  });

  it("7- Test the properties 'cca2', 'ccn3', 'cca3' and 'cioc' by showing that the endpoint with 1 letter gives a response error of 400", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/alpha/e",
      failOnStatusCode: false, // Do not fail the test on non-2xx status codes
    }).then((response) => {
      // Assertion 1: Response is 400
      expect(response.status).to.eq(400);

      // Assertion 2: The message is "Bad Request"
      expect(response.body).to.deep.equal({
        status: 400,
        message: "Bad Request",
      });
    });
  });

  it("8- Test the properties 'cca2', 'ccn3', 'cca3' and 'cioc' by showing that the endpoint with more than 3 letters gives a response error of 400", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/alpha/espa",
      failOnStatusCode: false, // Do not fail the test on non-2xx status codes
    }).then((response) => {
      // Assertion 1: Response is 400
      expect(response.status).to.eq(400);

      // Assertion 2: The message is "Bad Request"
      expect(response.body).to.deep.equal({
        status: 400,
        message: "Bad Request",
      });
    });
  });

  it("9- Test the query parameter '/alpha?codes={code},{code},{code}' using a basic normal endpoint and show also that it is case-insensitive", () => {
    cy.request(
      "GET",
      "https://restcountries.com/v3.1/alpha?codes=170,No,eSt,pE"
    ).then((response) => {
      // Assertion 1: Response is 200
      expect(response.status).to.equal(200);

      // Assertion 2: The array contains only 4 objects (four countries)
      cy.wrap(response.body).should("have.length", 4);
      cy.log("There are 4 countries");

      /*
        Assertion 3:
        The countries are:
            - Peru has the country code cca2: "PE"
            - Colombia has the country code ccn3: "170"
            - Estonia has the country code cca3 and cioc: "EST"
            - Norway has the country code  cca3 and cioc: "NO"
      */
      // Assert that Peru has the country code cca2: "PE"
      // We use the find method on the response.body array to find the country object that has the cca2 property equal to "PE" (which corresponds to Peru)
      // The expect statement checks if the found country object has a property named cca2 with the value "PE". This asserts that Peru has the country code "PE"
      // We are also asserting that the name is correct and that the code is not giving us another country
      const peru = response.body.find((country) => country.cca2 === "PE");
      expect(peru).to.have.property("cca2", "PE");
      expect(peru.name.common).to.equal("Peru");

      // Assert that Colombia has the country code ccn3: "170"
      const colombia = response.body.find((country) => country.ccn3 === "170");
      expect(colombia).to.have.property("ccn3", "170");
      expect(colombia.name.common).to.equal("Colombia");

      // Assert that Estonia has the country code cca3: "EST"
      const estonia = response.body.find((country) => country.cca3 === "EST");
      expect(estonia).to.have.property("cca3", "EST");
      expect(estonia.name.common).to.equal("Estonia");

      // Assert that Norway has the country code cioc: "NO"
      const norway = response.body.find((country) => country.cioc === "NOR");
      // expect(norway).to.have.property("cca3", "NOR");
      expect(norway).to.have.property("cioc", "NOR");
      expect(norway.name.common).to.equal("Norway");

      // Display the 4 countries using cy.log()
      response.body.forEach((country, index) => {
        // Access the different properties
        const commonName = country.name.common;
        const cca2 = country.cca2;
        const cca3 = country.cca3;
        const ccn3 = country.ccn3;
        const cioc = country.cioc;

        cy.log(`Common Name ${index + 1}: ${commonName}`);
        cy.log(`cca2 ${index + 1}: ${cca2}`);
        cy.log(`cca3 ${index + 1}: ${cca3}`);
        cy.log(`ccn3 ${index + 1}: ${ccn3}`);
        cy.log(`cioc ${index + 1}: ${cioc}`);
      });

      cy.log("Peru has the country code cca2: 'PE'");
      cy.log("Colombia has the country code ccn3: '170'");
      cy.log("Estonia has the country code cca3 and cioc: 'EST'");
      cy.log("Norway has the country code  cca3 and cioc: 'NO'");
    });
  });

  it("10- Test the query parameter '/alpha?codes={code},{code},{code}' by showing that  At least one code must be correct in order to have a correct response of 200", () => {
    cy.request(
      "GET",
      "https://restcountries.com/v3.1/alpha?codes=170,sp,e,p"
    ).then((response) => {
      // Assertion 1: Response is 200
      expect(response.status).to.equal(200);

      // Assertion 2: The array contains only one object (one country)
      cy.wrap(response.body).should("have.length", 1);
      cy.log("There is only 1 country");

      // Assertion 3: This one country is Colombia ("cca2": "CO", "ccn3": "170", "cca3": "COL", "cioc": "COL")
      const colombia = response.body[0];
      expect(colombia.name.common).to.equal("Colombia");
      expect(colombia.name.official).to.equal("Republic of Colombia");
      expect(colombia.cca2).to.equal("CO");
      expect(colombia.ccn3).to.equal("170");
      expect(colombia.cca3).to.equal("COL");
      expect(colombia.cioc).to.equal("COL");
    });
  });

  it("11- Test the query parameter '/alpha?codes={code},{code},{code}' by showing that repetition of codes does not affect the search", () => {
    cy.request(
      "GET",
      "https://restcountries.com/v3.1/alpha?codes=170,No,170,no"
    ).then((response) => {
      // Assertion 1: Response is 200
      expect(response.status).to.equal(200);

      // Assertion 2: The array contains 2 objects (Two countries)
      cy.wrap(response.body).should("have.length", 2);
      cy.log("There are 2 countries");

      /*
        Assertion 3:
        This countries are:
         - Colombia ("cca2": "CO", "ccn3": "170", "cca3": "COL", "cioc": "COL")
         -  Norway ("cca2": "NO", "ccn3": "578", "cca3": "NOR", "cioc": "NOR")
        */
      const colombia = response.body[0];
      expect(colombia.name.common).to.equal("Colombia");
      expect(colombia.name.official).to.equal("Republic of Colombia");
      expect(colombia.cca2).to.equal("CO");
      expect(colombia.ccn3).to.equal("170");
      expect(colombia.cca3).to.equal("COL");
      expect(colombia.cioc).to.equal("COL");

      const norway = response.body[1];
      expect(norway.name.common).to.equal("Norway");
      expect(norway.name.official).to.equal("Kingdom of Norway");
      expect(norway.cca2).to.equal("NO");
      expect(norway.ccn3).to.equal("578");
      expect(norway.cca3).to.equal("NOR");
      expect(norway.cioc).to.equal("NOR");
    });
  });

  it("12- Test the query parameter '/alpha?codes={code},{code},{code}' by showing if all codes are wrong, it will give an error response of 404", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/alpha?codes=17,o,eSar,p",
      failOnStatusCode: false, // Do not fail the test on non-2xx status codes
    }).then((response) => {
      // Assertion 1: Response is 404
      expect(response.status).to.eq(404);

      // Assertion 2: The message is "Not Found"
      expect(response.body).to.deep.equal({
        status: 404,
        message: "Not Found",
      });
    });
  });
});
