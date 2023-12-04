// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// I took the advice about cy.tab() from "https://www.programsbuzz.com/article/how-press-tab-key-cypress" and I also did "npm install cypress-real-events --save-dev"
require("cypress-plugin-tab");

// https://www.youtube.com/watch?v=v_3-H00N5Go
// https://www.youtube.com/watch?v=T1xpl1_A2dU
//https://reflect.run/articles/testing-drag-and-drop-workflows-using-cypress/#:~:text=You%20can%20add%20drag%2Dand,cypress%2Ddrag%2Ddrop%20plugin.&text=Then%2C%20add%20the%20following%20line,cypress%2Ddrag%2Ddrop%22)%3B
require("@4tw/cypress-drag-drop");

// This function works only if you select the date 2 days after today
// NOTE: "td.ui-datepicker-current-day" is the tomorrow day
// This is related to todolistme project
Cypress.Commands.add("pickDate2dayslaterInTodolistme", () => {
  cy.get("table.ui-datepicker-calendar td.ui-datepicker-current-day").then(
    ($today) => {
      // Select all the <td> after the current <td>
      const $nextTd = $today.nextAll("td");
      // Select the parent of the current <td> which is the <tr>
      const $parentTd = $today.parent();
      // Select all the <tr> after the current <tr>
      const $nextTr = $parentTd.nextAll("tr");

      // CHECK IF THERE IS ANOTHER NEXT <TR> IN THE CURRENT TABLE PAGE CALENDAR. IF THERE IS, IT MEANS THAT THERE MUST AT LEAST ONE <TD> IN THE NEXT <TR>
      if ($nextTr.length >= 1) {
        // Case 1: Check if there is 1 or more <td> after the current <td> in the current <tr> and the next <td> is NOT empty and disabled
        if ($nextTd.length >= 1) {
          cy.wrap($nextTd)
            .eq(0)
            .should("not.have.class", "ui-state-disabled")
            .then(() => {
              cy.wrap($nextTd).eq(0).find("a").click();
            });
        }

        //  Case 2: Check if there is no <td> after the current <td> in the current <tr>, go to the next <tr> and select the first <td>
        else if ($nextTd.length === 0) {
          cy.wrap($nextTr).eq(0).find("td:first-child a").click();
        }
      }

      // CHECK IF THERE ARE NO <TR> AFTER THE CURRENT <TR>
      else {
        // Case 1: Check if there is 1 or more <td> after the current <td> in the current <tr>, and the next <td> is NOT empty and disabled

        if (
          $nextTd.length >= 1 &&
          !$nextTd.eq(0).hasClass("ui-state-disabled")
        ) {
          cy.wrap($nextTd).eq(0).find("a").click();
        }

        // cy.wrap($nextTd)
        //   .eq(0)
        //   .should("not.have.class", "ui-state-disabled")
        //   .then(() => {
        //     cy.wrap($nextTd).eq(0).find("a").click();
        //   });

        // Case 2: Check if there is 1 or more <td> after the current <td> in the current <tr> and the next <td> is empty and disabled.Thus go to the next calendar page and select the first NON-disabled <td> in the first <tr>
        else {
          cy.wrap($nextTd)
            .eq(0)
            .should("have.class", "ui-state-disabled")
            .then(() => {
              cy.get("div.hasDatepicker a.ui-datepicker-next").click();

              // Find the first <td> who is NOT disabled in the next month
              cy.get("table.ui-datepicker-calendar")
                .find("tr")
                .eq(1)
                .find("td:not(.ui-state-disabled)")
                .first()
                .click();
            });
        }
      }
    }
  );
});
