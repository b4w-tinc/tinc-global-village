// theme.js

function setTheme(dark) {
  const modeIcon = document.getElementById("darkMode");
  const modeText = document.getElementById("modeToggleText");

  if (dark) {
    document.body.classList.add("dark");

    if (modeIcon) {
      modeIcon.src = "./sun-2-svgrepo-com.svg";
      modeIcon.alt = "Light Mode";
      modeIcon.title = "Light Mode";
    }

    if (modeText) {
      modeText.textContent = "Light Mode";
    }

    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");

    if (modeIcon) {
      modeIcon.src = "./moon-svgrepo-com.svg";
      modeIcon.alt = "Dark Mode";
      modeIcon.title = "Dark Mode";
    }

    if (modeText) {
      modeText.textContent = "Dark Mode";
    }

    localStorage.setItem("theme", "light");
  }
}

// Apply saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  setTheme(true);
} else {
  setTheme(false); // default light
}

// Toggle handlers
document.addEventListener("DOMContentLoaded", () => {
  const modeIcon = document.getElementById("darkMode");
  const modeText = document.getElementById("modeToggleText");

  if (modeIcon) {
    modeIcon.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
  }

  if (modeText) {
    modeText.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
  }
});
