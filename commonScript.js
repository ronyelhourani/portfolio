// (1) Accordion behavior

const accordionItemList = document.getElementsByClassName("accordion-item");
for (const accordionItem of accordionItemList) {
  const accordionTitle = accordionItem.querySelector(".accordion-title");
  const accordionIcon = accordionTitle.querySelector(".accordion-title-icon");
  accordionTitle.addEventListener("click", function () {
    accordionItem.classList.toggle("open");

    if (accordionItem.classList.contains("open")) {
      accordionIcon.textContent = "-";
    } else {
      accordionIcon.textContent = "+";
    }
  });
}

// ----------------------------------------------------------------------------------------------------

// (2) "Work experience" dropdown: a click on the menu item opens/closes the two choices, a click anywhere else closes them
const menuDropdown = document.querySelector(".menu-dropdown");
if (menuDropdown) {
  menuDropdown
    .querySelector(".menu-dropdown-toggle")
    .addEventListener("click", function (event) {
      event.preventDefault();
      menuDropdown.classList.toggle("open");
    });

  document.addEventListener("click", function (event) {
    if (!menuDropdown.contains(event.target)) {
      menuDropdown.classList.remove("open");
    }
  });
}

// ----------------------------------------------------------------------------------------------------

// (3) Purpose of the code below: when a link in the table of contents is clicked, the script prevents the default behavior, calculates the position of the target element, and smoothly scrolls the window to the position of the target element on the screen.
document.addEventListener("DOMContentLoaded", function () {
  // This selects all elements with the class table-of-contents-section-title, which are the links in the table of contents
  const links = document.querySelectorAll(".reach-section-title");

  // Iterates through each link
  links.forEach((link) => {
    // Adds a click event listener to each link
    link.addEventListener("click", function (event) {
      // Prevents the default behavior of the link, which is to navigate to a new page or anchor
      event.preventDefault();
      // Gets the target element's ID by extracting it from the href attribute of the clicked link
      // The substring(1) is used to remove the '#' character.
      const targetId = this.getAttribute("href").substring(1);
      // Gets the target element using its ID
      const targetElement = document.getElementById(targetId);

      // Checks if the target element exists
      if (targetElement) {
        // Calculates the offset from the top of the document to the target element
        const offsetTop = targetElement.offsetTop;
        // Adjusted for a 115px offset from the top
        const scrollPosition = offsetTop - 110;

        // Scrolls the window to the calculated position with a smooth scrolling behavior
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
