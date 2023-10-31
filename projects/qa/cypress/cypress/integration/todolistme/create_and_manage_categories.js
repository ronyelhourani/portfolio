/// <reference types="Cypress" />

describe("Feature: create and manage categories", () => {
  beforeEach(() => {
    // Prereq.: Todolistme page is already opened
    cy.visit("https://todolistme.net/");

    // Prereq.: Local storage is erased and the web application is returned to its default state
    cy.clearAllLocalStorage();

    cy.wait(1000);

    // Prereq.: Create new list called "Test todo list"
    // Click on the icon "new list"
    cy.get("#addlist").click();
    // Type the name of the new file
    cy.get("#inplaceeditor").find("#updatebox").type("Test todo list");
    // Save the new file
    cy.get("#inplaceeditor").find('input[type="submit"]').click();
    // Enter the list called "Testtodolist"
    cy.get("li span.listname")
      .filter(':contains("Test todo list")')
      .parent("li")
      .click();
  });

  it("1- Nominal case: The user can create categories", () => {
    // 1.1: Click on the icon "add new category"
    cy.get("img.adddivider").click();

    // 1.2: Click on the "save" button
    cy.get("#inplaceeditor").find('input[type="submit"]').click();
    // Expected return: A new category is created. It is named "New Category" (which is the default name)
    // Check if there is only 1 category
    cy.get("#lists #mycategories ").find("li").should("have.length", 1);
    // Check if the name of the new file is "New Category"
    cy.get("#lists #mycategories li:eq(0)")
      .find("span")
      .should("have.text", "New Category");

    // 1.3: Click on the icon "add new category"
    cy.get("img.adddivider").click();

    // 1.4: Click on the "save" button
    cy.get("#inplaceeditor").find('input[type="submit"]').click();
    // Expected return: A new category is created. It is named "New Category" (which is the default name)
    // Check if there are 2 categories
    cy.get("#lists #mycategories ").find("li").should("have.length", 2);
    // Check if the name of the new file is "New Category"
    cy.get("#lists #mycategories li:eq(1)")
      .find("span")
      .should("have.text", "New Category");

    // 1.5: Click on the icon "add new category"
    cy.get("img.adddivider").click();

    // 1.6: Click on the "cancel" button
    cy.get("#inplaceeditor").find('input[type="button"]').click();
    // Expected return: The category was not created
    // Check if there are STILL 2 categories
    cy.get("#lists #mycategories ").find("li").should("have.length", 2);
  });

  it("2- Nominal case: The user can name categories when created", () => {
    // 2.1: Click on the icon "add new category" and name it "Work"
    cy.get("img.adddivider").click();
    cy.get("#lists #inplaceeditor").find("#updatebox").type("Work");

    // 2.2: Click on the "save" button
    cy.get("#inplaceeditor").find('input[type="submit"]').click();
    // Expected result: A new category is created. It is named "Work"
    // Check if there is only 1 category
    cy.get("#lists #mycategories ").find("li").should("have.length", 1);
    // Check if the name of the new file is "Work"
    cy.get("#lists #mycategories li:eq(0)")
      .find("span")
      .should("have.text", "Work");

    // 2.3: Click on the icon "add new category" and name it "Home"
    cy.get("img.adddivider").click();
    cy.get("#lists #inplaceeditor").find("#updatebox").type("Home");

    // 2.4: Click on the "save" button
    cy.get("#inplaceeditor").find('input[type="submit"]').click();
    // Expected return: A new category is created. It is named "Home"
    // Check if there is only 2 category
    cy.get("#lists #mycategories ").find("li").should("have.length", 2);
    // Check if the name of the new file is "Home"
    cy.get("#lists #mycategories li:eq(1)")
      .find("span")
      .should("have.text", "Home");

    // 2.5: Click on the icon "add new category" and name it "Travel"
    cy.get("img.adddivider").click();
    cy.get("#lists #inplaceeditor").find("#updatebox").type("Travel");

    // 2.6: Click on the "cancel" button
    cy.get("#inplaceeditor").find('input[type="button"]').click();
    // Expected return: The category was not created
    // Check if there are STILL 2 categories
    cy.get("#lists #mycategories ").find("li").should("have.length", 2);
  });

  it("3- Nominal case: The user can rename categories", () => {
    // 3.1: Click on the icon "add new category"
    cy.get("img.adddivider").click();

    // 3.2: Click on the "save" button
    cy.get("#inplaceeditor").find('input[type="submit"]').click();
    // Expected return: A new category is created. It is named "New Category" (which is the default name)
    // Check if there is only 1 category
    cy.get("#lists #mycategories ").find("li").should("have.length", 1);
    // Check if the name of the new file is "New Category"
    cy.get("#lists #mycategories li:eq(0)")
      .find("span")
      .should("have.text", "New Category");

    // 3.3: Double-click on the category "New Category" and name it "Work"
    cy.get("#lists #mycategories li:eq(0)").dblclick();
    cy.get("#lists #inplaceeditor").find("#updatebox").type("Work");

    // 3.4: Click on the "save" button
    cy.get("#inplaceeditor").find('input[type="submit"]').click();
    // Expected return: The category is now named "Work"
    // Check if there is STILL only 1 category
    cy.get("#lists #mycategories ").find("li").should("have.length", 1);
    // Check if the name of the file is "Work"
    cy.get("#lists #mycategories li:eq(0)")
      .find("span")
      .should("have.text", "Work");

    // 3.5: Double-click on the category "Work" and name it "Home"
    cy.get("#lists #mycategories li:eq(0)").dblclick();
    cy.get("#lists #inplaceeditor").find("#updatebox").type("Home");

    // 3.6: Click on the "cancel" button
    cy.get("#inplaceeditor").find('input[type="button"]').click();
    // Expected return: The category's name remains "Work"
    // Check if there is STILL only 1 category
    cy.get("#lists #mycategories ").find("li").should("have.length", 1);
    // Check if the name of the file is "Work"
    cy.get("#lists #mycategories li:eq(0)")
      .find("span")
      .should("have.text", "Work");
  });
});