// Runs in <head> before the page paints, so a saved "light" choice does not flash dark first.
try {
  document.documentElement.dataset.theme =
    localStorage.getItem("theme") === "light" ? "light" : "dark";
} catch (error) {
  document.documentElement.dataset.theme = "dark";
}
