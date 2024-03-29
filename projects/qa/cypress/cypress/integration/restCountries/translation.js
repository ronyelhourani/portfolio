/// <reference types="Cypress" />

describe("API test for endpoint GET /translation/{translation}", () => {
  it("1- Request for a country by its translation (normal usage)", () => {
    cy.request(
      "GET",
      "https://restcountries.com/v3.1/translation/Germany"
    ).then((response) => {
      // Assertion 1: Response is 200
      expect(response.status).to.equal(200);

      // Assertion 2: The array contains only one object (one country)
      cy.wrap(response.body).should("have.length", 1);
      cy.log("There is only one country");

      /*
      Assertion 3:
      This one country is Germany ("translations":"cym": {
                "official": "Federal Republic of Germany",
                "common": "Germany"
            })
      */
      const germany = response.body[0];
      expect(germany.translations.cym).to.include({
        official: "Federal Republic of Germany",
        common: "Germany",
      });
      cy.log(JSON.stringify(germany.translations));

      // Assertion 4: All the properties related to Germany are present
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
        expect(germany).to.have.property(property);
      });
    });
  });

  it("2- Test the property 'translation' by showing that the endpoint performs a case-insensitive substring match against the country's translation", () => {
    cy.request("GET", "https://restcountries.com/v3.1/translation/ErMany").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only one country");

        /*
      Assertion 3:
      This one country is Germany ("translations":"cym": {
                "official": "Federal Republic of Germany",
                "common": "Germany"
            })
      */
        const germany = response.body[0];
        expect(germany.translations.cym).to.include({
          official: "Federal Republic of Germany",
          common: "Germany",
        });
        cy.log(JSON.stringify(germany.translations));
      }
    );
  });

  it("3- Test the property 'translations' by showing that the endpoint can perform with languages other than the english language and give us a correct response", () => {
    cy.request(
      "GET",
      "https://restcountries.com/v3.1/translation/جمهورية ألمانيا الاتحادية"
    ).then((response) => {
      // Assertion 1: Response is 200
      expect(response.status).to.equal(200);

      // Assertion 2: The array contains only one object (one country)
      cy.wrap(response.body).should("have.length", 1);
      cy.log("There is only one country");

      /*
        Assertion 3:
        This one country is Germany ("translations":"ara": {
                "official": "جمهورية ألمانيا الاتحادية",
                "common": "ألمانيا"
            })
        */
      const germany = response.body[0];
      expect(germany.translations.ara).to.include({
        official: "جمهورية ألمانيا الاتحادية",
        common: "ألمانيا",
      });
      cy.log(JSON.stringify(germany.translations));
    });
  });

  it("4- Test the property 'translations' by showing that the endpoint does not read from 'nativeName' located in the 'name' property. The response will be an error of 404", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/translation/မြန်မာ",
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

  it("5- Test the property 'translations' by showing that the endpoint does not read from the property 'altspellings'. The response will an error of 404 ", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/translation/Pyidaunzu",
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

  it("6- Test the property 'translations' by showing that the endpoint does not read the language abbreviation in the 'Translations' section", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/translation/slk",
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

  it("7- Test the property 'translations' by showing that the endpoint can give more than one country", () => {
    cy.request("GET", "https://restcountries.com/v3.1/translation/rman").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains 2 objects (Two countries)
        cy.wrap(response.body).should("have.length", 2);
        cy.log("There are 2 countries");

        /*
        Assertion 3:
        The countries are:
        - Germany
        - Myanmar
        */

        // An array countriesNamesToCheck is defined, containing the common names of the countries you want to assert the presence of in the API response
        const countriesNamesToCheck = ["Myanmar", "Germany"];

        // Check if each country is present in the response
        countriesNamesToCheck.forEach((country) => {
          // The find method looks for an item in the array where the common name (item.name.common) matches the current country in the loop
          const foundCountry = response.body.find(
            (item) => item.name.common === country
          );
          // The expect(foundCountry).to.exist statement asserts that the country is found in the response. If the country is not found, the test will fail
          expect(foundCountry).to.exist; // Assert that the country is found
        });

        // Display all countries with cy.log()
        response.body.forEach((country, index) => {
          // Access the different properties
          const commonName = country.name.common;
          cy.log(`Common Name ${index + 1}: ${commonName}`);
        });
      }
    );
  });

  it("8- Test the query parameter 'fields' and get only 3 properties 'name', 'capital' and 'currencies'", () => {
    cy.request(
      "GET",
      "https://restcountries.com/v3.1/translation/Germany?fields=name,capital,currencies"
    ).then((response) => {
      // Assertion 1: Response is 200
      expect(response.status).to.equal(200);

      // Assertion 2: The array contains only one object (one country)
      cy.wrap(response.body).should("have.length", 1);
      cy.log("There is only one country");

      /*
        This one country is Germany ("translations":"cym": {
                "official": "Federal Republic of Germany",
                "common": "Germany"
            })
        */
      const germany = response.body[0];
      expect(germany.name.common).to.equal("Germany");
      expect(germany.name.official).to.equal("Federal Republic of Germany");
      expect(germany.capital[0]).to.equal("Berlin");
      expect(germany.currencies.EUR).to.include({
        name: "Euro",
        symbol: "€",
      });
      cy.log(JSON.stringify(germany.name.common));
      cy.log(JSON.stringify(germany.name.official));
      cy.log(JSON.stringify(germany.capital[0]));
      cy.log(JSON.stringify(germany.currencies.EUR));

      // Assertion 4: Only properties (name,capital,currencies) related to Germany are present
      const expectedProperties = ["name", "currencies", "capital"];

      expectedProperties.forEach((property) => {
        expect(germany).to.have.property(property);
      });
    });
  });
});
