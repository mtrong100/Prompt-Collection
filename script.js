document.addEventListener("DOMContentLoaded", function () {
  // Load theme preference
  const currentTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  // Theme toggle button
  const themeBtn = document.getElementById("themeBtn");
  themeBtn.addEventListener("click", toggleTheme);

  // View mode toggle
  const columnViewBtn = document.getElementById("columnView");
  const grid2ViewBtn = document.getElementById("grid2View");
  const grid3ViewBtn = document.getElementById("grid3View");
  const categoriesContainer = document.getElementById("categoriesContainer");

  columnViewBtn.addEventListener("click", function () {
    setActiveView("column");
  });

  grid2ViewBtn.addEventListener("click", function () {
    setActiveView("grid2");
  });

  grid3ViewBtn.addEventListener("click", function () {
    setActiveView("grid3");
  });

  // Load and display data
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      displayData(data);
      setupSearch(data);
    })
    .catch((error) => console.error("Error loading JSON:", error));

  // Copy functionality
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("copy-btn") ||
      e.target.closest(".copy-btn")
    ) {
      const btn = e.target.classList.contains("copy-btn")
        ? e.target
        : e.target.closest(".copy-btn");
      const content = btn.parentElement.nextElementSibling.textContent.trim();
      copyToClipboard(content);
      showNotification();

      // Add temporary animation
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        btn.innerHTML = '<i class="far fa-copy"></i> Copy';
      }, 2000);
    }
  });
});

function setActiveView(mode) {
  const container = document.getElementById("categoriesContainer");
  const columnBtn = document.getElementById("columnView");
  const grid2Btn = document.getElementById("grid2View");
  const grid3Btn = document.getElementById("grid3View");

  // Reset all active states
  columnBtn.classList.remove("active");
  grid2Btn.classList.remove("active");
  grid3Btn.classList.remove("active");

  // Remove all view classes
  container.classList.remove("column-view", "grid2-view", "grid3-view");

  // Add the selected view class
  container.classList.add(`${mode}-view`);

  // Set the active button
  document.getElementById(`${mode}View`).classList.add("active");
}

setActiveView("grid3");

function displayData(data) {
  const container = document.getElementById("categoriesContainer");
  container.innerHTML = "";

  for (const [category, prompts] of Object.entries(data)) {
    const categoryCard = document.createElement("div");
    categoryCard.className = "category-card";

    const categoryHeader = document.createElement("div");
    categoryHeader.className = "category-header";
    categoryHeader.textContent = category;

    const promptsList = document.createElement("div");
    promptsList.className = "prompts-list";

    prompts.forEach((prompt) => {
      const promptItem = document.createElement("div");
      promptItem.className = "prompt-item";

      const promptTitle = document.createElement("div");
      promptTitle.className = "prompt-title";
      promptTitle.textContent = prompt.title;

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';

      const promptContent = document.createElement("div");
      promptContent.className = "prompt-content";
      promptContent.textContent = prompt.prompt;

      promptTitle.appendChild(copyBtn);
      promptItem.appendChild(promptTitle);
      promptItem.appendChild(promptContent);
      promptsList.appendChild(promptItem);
    });

    categoryCard.appendChild(categoryHeader);
    categoryCard.appendChild(promptsList);
    container.appendChild(categoryCard);
  }
}

function setupSearch(data) {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm) {
      displayData(data);
      return;
    }

    const filteredData = {};

    for (const [category, prompts] of Object.entries(data)) {
      const filteredPrompts = prompts.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchTerm) ||
          prompt.prompt.toLowerCase().includes(searchTerm)
      );

      if (filteredPrompts.length > 0) {
        filteredData[category] = filteredPrompts;
      }
    }

    displayData(filteredData);
  }

  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      performSearch();
    }
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector("#themeBtn i");
  icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function showNotification() {
  const notification = document.getElementById("notification");
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}
