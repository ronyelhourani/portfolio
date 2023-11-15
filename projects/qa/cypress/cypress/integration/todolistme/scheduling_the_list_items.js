/// <reference types="Cypress" />

describe("Scheduling the list items", () => {
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

  it("1- Nominal case: The user can schedule the list items for tomorrow by dragging the item to 'Tomorrow' part in scheduled-items", () => {
    // 1.1: There is no number next to both title "Tomorrow" and "Later" in the Scheduled-items
    cy.get("#tomorrowpanel #tomorrowtitle ")
      .find("span#tomorrow_number")
      .should("not.have.text");
    cy.get("#tomorrowpanel #latertitle")
      .find("span#later_number")
      .eq(0)
      .should("not.have.text");

    // 1.2: Create new item in the To-do-items: TaskforTomorrow
    cy.get("#additempanel")
      .find("#newtodo")
      .type("TaskforTomorrow")
      .type("{enter}");

    // 1.3: Drag the item "TaskforTomorrow" to the Scheduled-items (Tomorrow category)
    cy.get("#todolistpanel #todo_0").drag("#tomorrowtitle", { force: true });
    /*
    Expected result:
    Next to title "Tomorrow": (1)

    Inside the Scheduled-items:
      - There's a section with title : the title is tomorrow's date & Item "TaskforTomorrow"  is just under the title
    */
    cy.get("#tomorrowpanel #tomorrowtitle ")
      .find("span#tomorrow_number")
      .should("have.text", "( 1 )");
    cy.get("#tomorrowitemspanel").find("li").should("have.length", 1);
    cy.get("#tomorrowitemspanel #todo_0")
      .find("span#mytodo_0")
      .should("have.text", "TaskforTomorrow");
  });

  it("2- Edge case: The user can schedule the list items for tomorrow by dragging the item to Later part in scheduled-items ", () => {
    // 2.1: Create new item in the To-do-items: TaskforTomorrow
    cy.get("#additempanel")
      .find("#newtodo")
      .type("TaskforTomorrow")
      .type("{enter}");

    // 2.2: Drag the item "TaskforTomorrow" to the Scheduled-items (Later category) and choose the date to be tomorrow
    cy.get("#todolistpanel #todo_0").drag("#latertitle", { force: true });
    cy.get("table.ui-datepicker-calendar").find("a.ui-state-active").click();
    /*
    Next to title "Tomorrow": (1)

    Inside the Scheduled-items:
      - There's a section with title : the title is tomorrow's date & Item "TaskforTomorrow" is just under the title

    */
    cy.get("#tomorrowpanel #tomorrowtitle ")
      .find("span#tomorrow_number")
      .should("have.text", "( 1 )");
    cy.get("#tomorrowitemspanel").find("li").should("have.length", 1);
    cy.get("#tomorrowitemspanel #todo_0")
      .find("span#mytodo_0")
      .should("have.text", "TaskforTomorrow");
  });

  it("3- Nominal case: The user can schedule the list items to be any other day, other than today or tomorrow", () => {
    // 3.1: Create new item in the To-do-items: Taskafter2Days
    cy.get("#additempanel")
      .find("#newtodo")
      .type("Taskafter2Days")
      .type("{enter}");

    // 3.2: Drag the item "Taskafter2Days" to the Scheduled-items (later category; Select 2 days after today)
    cy.get("#todolistpanel #todo_0").drag("#latertitle", { force: true });
    cy.get("table.ui-datepicker-calendar")
      .find("td.ui-datepicker-current-day")
      .next("td")
      .should("exist")
      .then((nextTd) => {
        cy.wrap(nextTd).find("a").click();
      });
    /*
    Expected result: 
   
    Next to title "Later": (1)

    Inside the Scheduled-items:
      - There's a section with title : the title is after 2 days' date & Item  "Taskafter2Days"  is just under the title
    */
    cy.get("#tomorrowpanel #latertitle")
      .find("span#later_number")
      .eq(0)
      .should("have.text", "( 1 )");
    cy.get("#tomorrowitemspanel").find("li").should("have.length", 1);
    cy.get("#tomorrowitemspanel ul li:eq(0)")
      .find("span")
      .should("have.text", "Taskafter2Days");
  });

  it("4- Nominal case: The user can mix various date (both tomorrow and Later part) in the schedule-items", () => {
    // 4.1: Create new item in the To-do-items: TaskforTomorrow
    cy.get("#additempanel")
      .find("#newtodo")
      .type("TaskforTomorrow")
      .type("{enter}");

    // 4.2: Create new item in the To-do-items: Taskafter2Days
    cy.get("#additempanel")
      .find("#newtodo")
      .type("Taskafter2Days")
      .type("{enter}");

    // 4.3: Drag the item "TaskforTomorrow" to the Scheduled-items (Tomorrow category)
    cy.get("#todolistpanel #todo_0").drag("#tomorrowtitle", { force: true });

    /*
    Expected result:

    Next to title "Tomorrow": (1)

    Inside the Scheduled-items:
      - There's a section with title : the title is tomorrow's date & Item "TaskforTomorrow" is just under the title
    */
    cy.get("#tomorrowpanel #tomorrowtitle ")
      .find("span#tomorrow_number")
      .should("have.text", "( 1 )");
    cy.get("#tomorrowitemspanel").find("li").should("have.length", 1);
    cy.get("#tomorrowitemspanel ul li:eq(0)")
      .find("span")
      .should("have.text", "TaskforTomorrow");

    // 4.4: Drag the item "Taskafter2Days" to the Scheduled-items (later category; Select 2 days after today)
    cy.get("#todolistpanel #todo_1").drag("#latertitle", { force: true });
    cy.get("table.ui-datepicker-calendar")
      .find("td.ui-datepicker-current-day")
      .next("td")
      .should("exist")
      .then((nextTd) => {
        cy.wrap(nextTd).find("a").click();
      });
    /*
    Expected result:

    Next to title "Tomorrow": (1)
    Next to title "Later": (1)

    Inside the Scheduled-items:
      - There's a section with title : the title is tomorrow's date & Item "TaskforTomorrow" is just under the title
      - There's another section with title : the title is after 2 days' date & Item  "Taskafter2Days"  is just under the title

    The dates are automatically sorted from newest on top to latest on bottom
    */
    cy.get("#tomorrowpanel #tomorrowtitle ")
      .find("span#tomorrow_number")
      .should("have.text", "( 1 )");
    cy.get("#tomorrowpanel #latertitle")
      .find("span#later_number")
      .eq(0)
      .should("have.text", "( 1 )");
    cy.get("#tomorrowitemspanel").find("li").should("have.length", 2);
    cy.get("#tomorrowitemspanel ul li:eq(0)")
      .find("span")
      .should("have.text", "TaskforTomorrow");
    cy.get("#tomorrowitemspanel ul li:eq(1)")
      .find("span")
      .should("have.text", "Taskafter2Days");
  });

  it("5- Nominal case: The user can hide the list items in the scheduled-items", () => {
    // 5.1: Create new item in the To-do-items: TaskforTomorrow1
    cy.get("#additempanel")
      .find("#newtodo")
      .type("TaskforTomorrow1")
      .type("{enter}");

    // 5.2: Create new item in the To-do-items: TaskforTomorrow2
    cy.get("#additempanel")
      .find("#newtodo")
      .type("TaskforTomorrow2")
      .type("{enter}");

    // 5.3: Drag the item "TaskforTomorrow1" to the Scheduled-items (Tomorrow category)
    cy.get("#todolistpanel #todo_0").drag("#tomorrowtitle", { force: true });
    /*
    Expected result:
    Next to title "Tomorrow": (1)

    Inside the Scheduled-items:
      - There's a section with title : the title is tomorrow's date & Item "TaskforTomorrow1" is just under the title
    */
    cy.get("#tomorrowpanel #tomorrowtitle ")
      .find("span#tomorrow_number")
      .should("have.text", "( 1 )");
    cy.get("#tomorrowitemspanel").find("li").should("have.length", 1);
    cy.get("#tomorrowitemspanel #todo_0")
      .find("span#mytodo_0")
      .should("have.text", "TaskforTomorrow1");

    // 5.4: Drag the item "TaskforTomorrow2" to the Scheduled-items (Tomorrow category)
    cy.get("#todolistpanel #todo_1").drag("#tomorrowtitle", { force: true });
    /*
    Expected result:
    Next to title "Tomorrow": (2)

    Inside the Scheduled-items:
      - There's a section with title : the title is tomorrow's date & Items  "TaskforTomorrow1" and   "TaskforTomorrow2"  are just under the title
    */
    cy.get("#tomorrowpanel #tomorrowtitle ")
      .find("span#tomorrow_number")
      .should("have.text", "( 2 )");
    cy.get("#tomorrowitemspanel").find("li").should("have.length", 2);
    cy.get("#tomorrowitemspanel #todo_0")
      .find("span#mytodo_0")
      .should("have.text", "TaskforTomorrow1");
    cy.get("#tomorrowitemspanel #todo_1")
      .find("span#mytodo_1")
      .should("have.text", "TaskforTomorrow2");

    // 5.5: Click on blue arrow
    cy.get("#tomorrowpanel #tomorrowheader").find("img#tomorrowarrow").click();
    cy.get("#tomorrowpanel #tomorrowheader")
      .find("img#tomorrowarrow")
      .should("have.attr", "src", "https://todolistme.net/images/arrow_up.png");

    // 5.6: Click on blue arrow
    cy.get("#tomorrowpanel #tomorrowheader").find("img#tomorrowarrow").click();
    cy.get("#tomorrowpanel #tomorrowheader")
      .find("img#tomorrowarrow")
      .should(
        "have.attr",
        "src",
        "https://todolistme.net/images/arrow_down.png"
      );
  });
});
