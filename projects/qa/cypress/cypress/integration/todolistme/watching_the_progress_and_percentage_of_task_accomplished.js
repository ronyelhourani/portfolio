/// <reference types="Cypress" />

describe("Watching the progress and percentage of task accomplished", () => {
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

  it("1- Nominal case: Progress line with all To-do-items, Done-items and Scheduled-items empty", () => {
    /*
    1.1: expected result:
    To-do-items empty

    Done-items empty

    Scheduled-items empty

    Progress line is not visible in both To-do-items and Done-items. Their width is zero

    Progress line in To-do-items: width is 0%
    Progress line in Done-items: width is 0%
    */
    cy.get("#todolistpanel").find("#mytodos").find("li").should("not.exist");
    cy.get("div#todolistpanel p.notodos")
      .should("exist")
      .contains("No items. Why not add one below.");
    cy.get("#doneitemspanel")
      .find("#mydonetodos")
      .find("li")
      .should("not.exist");
    cy.get("#doneitemspanel p.notodos")
      .should("exist")
      .contains("No done items.");
    cy.get("#tomorrowpanel")
      .find("#tomorrowitemspanel")
      .find("ul")
      .should("not.exist");
    cy.get("#tomorrowpanel")
      .find("#tomorrowitemspanel p.notodos")
      .should("exist")
      .contains(
        "Drag todos onto the Tomorrow or Later titles above to put them off till later."
      );
    // Since nothing is done or added, the progress bar in todolist is 0%
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;

      const percentageWidth = (width / fullWidth) * 100;

      cy.log(
        `Since both to-do-items adn done-items are empty, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "0px");

    // Since nothing is done or added, the progress bar in donelist is 0%
    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;

      const percentageWidth = (width / fullWidth) * 100;

      cy.log(
        `Since both to-do-items adn done-items are empty, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "0px");
  });

  it("2- Nominal case: Progress line at 100% with items changing between To-do-items and Done-items", () => {
    // 2.1: Create new item in the To-do-items: Task1
    cy.get("#additempanel").find("#newtodo").type("Task1").type("{enter}");
    /*
    Expected result:
    Progress line in To-do-items: width is 0%

    Progress line in Done-items: width is 0%
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is only 1 item in todolist and no item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "0px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is only 1 item in todolist and no item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "0px");

    // 2.2: Check item "Task1"
    cy.get("#todolistpanel #mytodos #todo_0")
      .find('input[type="checkbox"]')
      .click();
    /*
    Expected result:
    Task1 is now in the Done-items

    Progress line in To-do-items: width is 100% 

    Progress line in Done-items: width is 100% 

      */
    cy.get("#doneitemspanel #mydonetodos #todo_0")
      .find("span#mytodo_0")
      .should("have.text", "Task1");
    cy.get("#doneitemspanel #mydonetodos #todo_0")
      .find('input[type="checkbox"]')
      .should("be.checked");

    cy.wait(2000);

    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is no item in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "536px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is no item in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "536px");
  });

  it("3- Nominal case: Progress line  from 0 to 100% with items changing between To-do-items and Done-items", () => {
    // 3.1: Create new item in the To-do-items: Task1
    cy.get("#additempanel").find("#newtodo").type("Task1").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 0%
    Progress line in Done-items: width is 0%
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is only 1 item in todolist and no item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "0px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is only 1 item in todolist and no item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "0px");

    //   3.2: Create new item in the To-do-items: Task2
    cy.get("#additempanel").find("#newtodo").type("Task2").type("{enter}");
    cy.wait(1000);

    /*
    Expected result:
    Progress line in To-do-items: width is 0%
    Progress line in Done-items: width is 0%
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and no item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "0px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and no item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "0px");

    // 3.3: Create new item in the To-do-items: Task3
    cy.get("#additempanel").find("#newtodo").type("Task3").type("{enter}");
    cy.wait(1000);

    /*
    Expected result:
    Progress line in To-do-items: width is 0%
    Progress line in Done-items: width is 0%
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and no item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "0px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and no item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "0px");

    // 3.4: Create new item in the To-do-items: Task4
    cy.get("#additempanel").find("#newtodo").type("Task4").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 0%
    Progress line in Done-items: width is 0%
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 4 items in todolist and no item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "0px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 4 items in todolist and no item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "0px");

    //  3.5: Create new item in the To-do-items: Task5
    cy.get("#additempanel").find("#newtodo").type("Task5").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 0%
    Progress line in Done-items: width is 0%
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 5 items in todolist and no item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "0px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 5 items in todolist and no item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "0px");

    //   3.6: Check item "Task5"
    cy.get("#todolistpanel #mytodos #todo_4")
      .find('input[type="checkbox"]')
      .click();
    cy.wait(1000);

    /*
    Expected result:
    Task5 is now in the Done-items
    Progress line in To-do-items: width is 20% 
    Progress line in Done-items: width is 20% 
    */
    cy.get("#doneitemspanel #mydonetodos #todo_4")
      .find("span#mytodo_4")
      .should("have.text", "Task5");
    cy.get("#doneitemspanel #mydonetodos #todo_4")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.wait(1000);

    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 4 items in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 107, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 4 items in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 107, 1);

    // 3.7: Check item "Task4"
    cy.get("#todolistpanel #mytodos #todo_3")
      .find('input[type="checkbox"]')
      .click();
    cy.wait(1000);
    /*
    Expected result:
    Task4 is now in the Done-items
    Progress line in To-do-items: width is 40% 
    Progress line in Done-items: width is 40% 
    */
    cy.get("#doneitemspanel #mydonetodos #todo_3")
      .find("span#mytodo_3")
      .should("have.text", "Task4");
    cy.get("#doneitemspanel #mydonetodos #todo_3")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.wait(1000);

    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 2 items in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 214, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 2 items in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 214, 1);

    // 3.8: Check item "Task3"
    cy.get("#todolistpanel #mytodos #todo_2")
      .find('input[type="checkbox"]')
      .click();
    cy.wait(1000);
    /*
    Expected result:
    Task3 is now in the Done-items
    Progress line in To-do-items: width is 60% 
    Progress line in Done-items: width is 60% 
    */
    cy.get("#doneitemspanel #mydonetodos #todo_2")
      .find("span#mytodo_2")
      .should("have.text", "Task3");
    cy.get("#doneitemspanel #mydonetodos #todo_2")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.wait(1000);
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and 3 items in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 322, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and 3 items in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 322, 1);

    // 3.9: Check item "Task2"
    cy.get("#todolistpanel #mytodos #todo_1")
      .find('input[type="checkbox"]')
      .click();
    cy.wait(1000);
    /*
    Expected result:
    Task2 is now in the Done-items
    Progress line in To-do-items: width is 80% 
    Progress line in Done-items: width is 80% 
    */
    cy.get("#doneitemspanel #mydonetodos #todo_1")
      .find("span#mytodo_1")
      .should("have.text", "Task2");
    cy.get("#doneitemspanel #mydonetodos #todo_1")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.wait(1000);
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is 1 item in todolist and 4 items in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 429, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is 1 item in todolist and 4 items in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 429, 1);

    // 3.10: Check item "Task1"
    cy.get("#todolistpanel #mytodos #todo_0")
      .find('input[type="checkbox"]')
      .click();
    cy.wait(1000);
    /*
    Expected result:
    Task1 is now in the Done-items
    Progress line in To-do-items: width is 100% 
    Progress line in Done-items: width is 100% 
    */
    cy.get("#doneitemspanel #mydonetodos #todo_0")
      .find("span#mytodo_0")
      .should("have.text", "Task1");
    cy.get("#doneitemspanel #mydonetodos #todo_0")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.wait(1000);
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is no item in todolist and 5 items in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "536px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is no item in todolist and 5 items in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "536px");
  });

  it("4- Nominal case: Progress line from changing items between To-do-items and Scheduled-items", () => {
    // 4.1: Create new item in the To-do-items: Task1
    cy.get("#additempanel").find("#newtodo").type("Task1").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 0%
    Progress line in Done-items: width is 0%
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is only 1 item in todolist and no item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "0px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is only 1 item in todolist and no item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "0px");

    // 4.2: Check item "Task1"
    cy.get("#todolistpanel #mytodos #todo_0")
      .find('input[type="checkbox"]')
      .click();
    cy.wait(1000);
    /*
    Expected result:
    Task1 is now in the Done-items
    Progress line in To-do-items: width is 100% 
    Progress line in Done-items: width is 100% 
    */
    cy.get("#doneitemspanel #mydonetodos #todo_0")
      .find("span#mytodo_0")
      .should("have.text", "Task1");
    cy.get("#doneitemspanel #mydonetodos #todo_0")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.wait(1000);
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is no item in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "536px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is no item in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "536px");

    // 4.3: Create new item in the To-do-items: Task2
    cy.get("#additempanel").find("#newtodo").type("Task2").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 50% 
    Progress line in Done-items: width is 50% 
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is 1 item in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 268, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is 1 item in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 268, 1);

    // 4.4: Create new item in the To-do-items: Task3
    cy.get("#additempanel").find("#newtodo").type("Task3").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 33% 
    Progress line in Done-items: width is 33% 
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 177, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 177, 1);

    // 4.5: Create new item in the To-do-items: Task4
    cy.get("#additempanel").find("#newtodo").type("Task4").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 25% 
    Progress line in Done-items: width is 25% 
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 134, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 134, 1);

    // 4.6: Create new item in the To-do-items: Task5
    cy.get("#additempanel").find("#newtodo").type("Task5").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 20% 
    Progress line in Done-items: width is 20% 
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 4 items in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 107, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 4 items in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 107, 1);

    // 4.7: Check item "Task2"
    cy.get("#todolistpanel #mytodos #todo_1")
      .find('input[type="checkbox"]')
      .click();
    cy.wait(1000);
    /*
    Task2 is now in the Done-items
    Progress line in To-do-items: width is 40% 
    Progress line in Done-items: width is 40% 
    */
    cy.get("#doneitemspanel #mydonetodos #todo_1")
      .find("span#mytodo_1")
      .should("have.text", "Task2");
    cy.get("#doneitemspanel #mydonetodos #todo_1")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.wait(1000);
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 2 items in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 214, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 2 items in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 214, 1);

    // 4.8: Drag the item "Task5" from To-do-items to Scheduled-items
    cy.get("#todolistpanel #mytodos #todo_4").drag("#tomorrowtitle", {
      force: true,
    });
    cy.wait(1000);
    /*
    Expected result:
    Task5 is now in the Scheduled-items
    Progress line in To-do-items: width is 50% 
    Progress line in Done-items: width is 50% 
    */
    cy.get("#tomorrowitemspanel #todo_4")
      .find("span#mytodo_4")
      .should("have.text", "Task5");
    cy.get("#tomorrowitemspanel #todo_4")
      .find('input[type="checkbox"]')
      .should("not.be.checked");
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and 2 items in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 268, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and 2 items in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 268, 1);
  });

  it("5- Nominal case: Progress line from changing items between Done-items and Scheduled-items", () => {
    // 5.1: Create new item in the To-do-items: Task1
    cy.get("#additempanel").find("#newtodo").type("Task1").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 0%
    Progress line in Done-items: width is 0%
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is only 1 item in todolist and no item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "0px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is only 1 item in todolist and no item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "0px");

    // 5.2: Check item "Task1"
    cy.get("#todolistpanel #mytodos #todo_0")
      .find('input[type="checkbox"]')
      .click();
    cy.wait(1000);
    /*
    Expected result:
    Task1 is now in the Done-items
    Progress line in To-do-items: width is 100% 
    Progress line in Done-items: width is 100% 
    */
    cy.get("#doneitemspanel #mydonetodos #todo_0")
      .find("span#mytodo_0")
      .should("have.text", "Task1");
    cy.get("#doneitemspanel #mydonetodos #todo_0")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.wait(1000);
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is no item in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").should("have.css", "width", "536px");

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is no item in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").should("have.css", "width", "536px");

    // 5.3: Create new item in the To-do-items: Task2
    cy.get("#additempanel").find("#newtodo").type("Task2").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 50% 
    Progress line in Done-items: width is 50% 
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is 1 item in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 268, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there is 1 item in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 268, 1);

    // 5.4: Create new item in the To-do-items: Task3
    cy.get("#additempanel").find("#newtodo").type("Task3").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 33% 
    Progress line in Done-items: width is 33% 
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 177, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 2 items in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 177, 1);

    // 5.5: Create new item in the To-do-items: Task4
    cy.get("#additempanel").find("#newtodo").type("Task4").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 25% 
    Progress line in Done-items: width is 25% 
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 134, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 134, 1);

    // 5.6: Create new item in the To-do-items: Task5
    cy.get("#additempanel").find("#newtodo").type("Task5").type("{enter}");
    cy.wait(1000);
    /*
    Expected result:
    Progress line in To-do-items: width is 20% 
    Progress line in Done-items: width is 20% 
    */
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 4 items in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 107, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 4 items in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 107, 1);

    // 5.7: Check item "Task2"
    cy.get("#todolistpanel #mytodos #todo_1")
      .find('input[type="checkbox"]')
      .click();
    cy.wait(1000);
    /*
    Task2 is now in the Done-items
    Progress line in To-do-items: width is 40% 
    Progress line in Done-items: width is 40% 
    */
    cy.get("#doneitemspanel #mydonetodos #todo_1")
      .find("span#mytodo_1")
      .should("have.text", "Task2");
    cy.get("#doneitemspanel #mydonetodos #todo_1")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.wait(1000);
    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 2 items in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 214, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 2 items in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 214, 1);

    // 5.8: Drag the item "Task2" from done-items to Scheduled-items
    cy.get("#doneitemspanel #todo_1").drag("#tomorrowtitle", { force: true });
    cy.wait(1000);
    /*
    Expected result:
    Task2 is now in the Scheduled-items
    Progress line in To-do-items: width is 25% 
    Progress line in Done-items: width is 25% 
    */
    cy.get("#tomorrowitemspanel #todo_1")
      .find("span#mytodo_1")
      .should("have.text", "Task2");
    cy.get("#tomorrowitemspanel #todo_1")
      .find('input[type="checkbox"]')
      .should("not.be.checked");
    cy.wait(1000);

    cy.get("#todoprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 1 item in donelist, the width of the progress bar in todolist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#todoprogress").invoke("width").should("be.closeTo", 134, 1);

    cy.get("#doneprogress").then(($progressBar) => {
      const width = parseFloat($progressBar.css("width"));
      const fullWidth = parseFloat($progressBar.parent().css("width")) + 10;
      const percentageWidth = (width / fullWidth) * 100;
      cy.log(
        `Since there are 3 items in todolist and 1 item in donelist, the width of the progress bar in donelist is: ${width.toFixed(
          2
        )}px/${fullWidth.toFixed(2)}px, ${percentageWidth.toFixed(2)}%`
      );
    });
    cy.get("#doneprogress").invoke("width").should("be.closeTo", 134, 1);
  });
});
