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

// (3) Project tabs (experience pages): a click on a tab shows its panel and hides the others. Arrow keys move between tabs.
const projectTabList = Array.from(document.querySelectorAll(".project-tab"));
function selectProjectTab(selectedTab) {
  for (const tab of projectTabList) {
    const isSelected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden =
      !isSelected;
  }
}
projectTabList.forEach(function (tab, index) {
  tab.addEventListener("click", function () {
    selectProjectTab(tab);
  });
  tab.addEventListener("keydown", function (event) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % projectTabList.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + projectTabList.length) % projectTabList.length;
    else return;
    event.preventDefault();
    projectTabList[nextIndex].focus();
    selectProjectTab(projectTabList[nextIndex]);
  });
});

// ----------------------------------------------------------------------------------------------------

// (4) Theme toggle: dark is the default. The choice is saved in localStorage and applied before the page paints by theme-init.js
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
