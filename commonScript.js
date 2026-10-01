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

// (2) "Experience" dropdown: a click on the menu item opens/closes the two choices, a click anywhere else closes them
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

// (3) Theme toggle: dark is the default. The choice is saved in localStorage and applied before the page paints by theme-init.js
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  const root = document.documentElement;

  function updateThemeToggleLabel() {
    themeToggle.textContent =
      root.dataset.theme === "light" ? "dark mode" : "light mode";
  }

  updateThemeToggleLabel();

  themeToggle.addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch (error) {
      // Storage can be blocked (private window). The theme still changes for this visit.
    }
    updateThemeToggleLabel();
  });
}
