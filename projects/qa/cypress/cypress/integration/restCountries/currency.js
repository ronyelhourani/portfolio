/// <reference types="Cypress" />

describe("API test for endpoint GET /currency/{currency}", () => {
  it("1- Request for a country by its currency (normal usage)", () => {
    cy.request("GET", "https://restcountries.com/v3.1/currency/JPY").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only 1 country");

        /*
        Assertion 3:
        This one country is Japan ("currencies": {
            "JPY": {
                "name": "Japanese yen",
                "symbol": "¥"
            })
        */
        const japan = response.body[0];
        expect(japan.currencies.JPY).to.include({
          name: "Japanese yen",
          symbol: "¥",
        });

        // Assertion 4: All the properties related to Japan are present
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
          expect(japan).to.have.property(property);
        });
      }
    );
  });

  it("2- Test the property 'currency' by showing that the endpoint performs a case-insensitive match against country's currency", () => {
    cy.request("GET", "https://restcountries.com/v3.1/currency/jPy").then(
      (response) => {
        // Assertion 1: Response is 200
        expect(response.status).to.equal(200);

        // Assertion 2: The array contains only one object (one country)
        cy.wrap(response.body).should("have.length", 1);
        cy.log("There is only 1 country");

        /*
        Assertion 3:
        This one country is Japan ("currencies": {
            "JPY": {
                "name": "Japanese yen",
                "symbol": "¥"
            })
        */
        const japan = response.body[0];
        expect(japan.currencies.JPY).to.include({
          name: "Japanese yen",
          symbol: "¥",
        });
      }
    );
  });

  it("3- Test the property 'currency' by showing that the endpoint performs a perfect match agisnt country's currency. The endpoint is incomplete, thus we will get a response error of 404", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/currency/jP",
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

  it("4- Test the property 'currency' by showing that the endpoint performs a substring match agisnt country's currency", () => {
    cy.request(
      "GET",
      "https://restcountries.com/v3.1/currency/japanese yen"
    ).then((response) => {
      // Assertion 1: Response is 200
      expect(response.status).to.equal(200);

      // Assertion 2: The array contains only one object (one country)
      cy.wrap(response.body).should("have.length", 1);
      cy.log("There is only 1 country");

      /*
        Assertion 3:
        This one country is Japan ("currencies": {
            "JPY": {
                "name": "Japanese yen",
                "symbol": "¥"
            })
        */
      const japan = response.body[0];
      expect(japan.currencies.JPY).to.include({
        name: "Japanese yen",
        symbol: "¥",
      });
    });
  });

  it("5- Test the property 'currency' by showing that the endpoint performs a substring match against a country's currency, but it have to be lowercase. If at least one of the letter is uppercase, we will get an response error of 404", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/currency/JapanEse yeN",
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

  it("6-  Test the property 'currency' by showing that the endpoint does not read symbol", () => {
    cy.request({
      method: "GET",
      url: "https://restcountries.com/v3.1/currency/$",
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

  it("7- Test the query parameter 'fields' and get only 2 properties 'name' and 'capital'", () => {
    cy.request(
      "GET",
      "https://restcountries.com/v3.1/currency/JPY?fields=name,capital"
    ).then((response) => {
      // Assertion 1: Response is 200
      expect(response.status).to.equal(200);

      // Assertion 2: The array contains only one object (one country)
      cy.wrap(response.body).should("have.length", 1);
      cy.log("There is only 1 country");

      /*
        Assertion 3:
         This one country is Japan ("name": {
            "common": "Japan",
            "official": "Japan"
            "capital": [
                "Tokyo"
            ]
        )
     */
      const japan = response.body[0];
      expect(japan.name.common).to.equal("Japan");
      expect(japan.name.official).to.equal("Japan");
      expect(japan.capital[0]).to.equal("Tokyo");

      // Assertion 4: Only properties (name, capital) related to Japan are present
      const expectedProperties = ["name", "capital"];

      expectedProperties.forEach((property) => {
        expect(japan).to.have.property(property);
      });
    });
  });
});
