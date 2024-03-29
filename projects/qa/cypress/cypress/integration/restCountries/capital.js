/// <reference types="Cypress" />

describe("API test for endpoint GET /capital/{capital}", () => {
  it("1- Request for a country by its capital (normal usage)", () => {
    cy.request("GET", "https://restcountries.com/v3.1/capital/Tallinn").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only 1 country");

        /*
         Assertion 3:
        ) This one country is Estonia ("capital": [
            "Tallinn"
        ])
        */
        const estonia = response.body[0];
        expect(estonia.name.common).to.equal("Estonia");
        expect(estonia.name.official).to.equal("Republic of Estonia");
        expect(estonia.capital[0]).to.equal("Tallinn");
        cy.log(JSON.stringify(estonia.name.common));
        cy.log(JSON.stringify(estonia.capital));

        // Assertion 4: All the properties related to Estonia are present
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
          expect(estonia).to.have.property(property);
        });
      }
    );
  });

  it("2- Test the property 'capital' by showing that the endpoint performs a case-insensitive substring match against the country's capital'", () => {
    cy.request("GET", "https://restcountries.com/v3.1/capital/taLliN").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only 1 country");

        /*
        Assertion 3:
        ) This one country is Estonia ("capital": [
            "Tallinn"
        ])
        */
        const estonia = response.body[0];
        expect(estonia.name.common).to.equal("Estonia");
        expect(estonia.name.official).to.equal("Republic of Estonia");
        expect(estonia.capital[0]).to.equal("Tallinn");
        cy.log(JSON.stringify(estonia.name.common));
        cy.log(JSON.stringify(estonia.capital));
      }
    );
  });

  it("3- Test the property 'capital' by showing that the endpoint can give more than one country", () => {
    cy.request("GET", "https://restcountries.com/v3.1/capital/war").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains 3 object (three countries)
        cy.wrap(response.body).should("have.length", 3);
        cy.log("There are 3 countries");

        /*
        Assertion 3:
        The countries are:
            - South Georgia ("capital": [ "King Edward Point" ])
            - Sri Lanka ("capital": [ "Sri Jayawardenepura Kotte" ])
            - Poland ("capital": [ "Warsaw" ])
        */

        // An array countriesNamesToCheck is defined, containing the common names of the countries you want to assert the presence of in the API response
        const countriesNamesToCheck = ["Poland", "South Georgia", "Sri Lanka"];
        // Check if each country is present in the response
        countriesNamesToCheck.forEach((country) => {
          // The find method looks for an item in the array where the common name (item.name.common) matches the current country in the loop
          const foundCountry = response.body.find(
            (item) => item.name.common === country
          );
          // The expect(foundCountry).to.exist statement asserts that the country is found in the response. If the country is not found, the test will fail
          expect(foundCountry).to.exist; // Assert that the country is found
        });

        // Display the countries using cy.log()
        response.body.forEach((country, index) => {
          // Access the different properties
          const commonName = country.name.common;
          const capital = country.capital[0];

          cy.log(`Common Name ${index + 1}: ${commonName}`);
          cy.log(`Capital ${index + 1}: ${capital}`);
        });
      }
    );
  });

  it("4- Test the query parameter 'fields' and get only 2 properties 'region' and 'demonyms'", () => {
    cy.request(
      "GET",
      "https://restcountries.com/v3.1/capital/Tallinn?fields=region,demonyms"
    ).then((response) => {
      // Assertion 1: Response is 200
      expect(response.status).to.equal(200);

      // Assertion 2: The array contains only one object (one country)
      cy.wrap(response.body).should("have.length", 1);

      /*
        Assertion 3:
        This one country is Estonia ("capital": [
            "Tallinn"
        ])
        */
      const estonia = response.body[0];
      expect(estonia.region).to.equal("Europe");
      expect(estonia.demonyms.eng).to.include({
        f: "Estonian",
        m: "Estonian",
      });
      cy.log(JSON.stringify(estonia.region));
      cy.log(JSON.stringify(estonia.demonyms.eng));

      //   Assertion 4: Only properties (region and demonyms) related to Estonia are present
      const expectedProperties = ["region", "demonyms"];

      expectedProperties.forEach((property) => {
        expect(estonia).to.have.property(property);
      });
    });
  });
});
