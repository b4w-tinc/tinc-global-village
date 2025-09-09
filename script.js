
//Sign-Up form

const form = document.getElementById("signupForm");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const showPassword = document.getElementById("showPassword");
const toggleLabel = document.getElementById("toggleLabel");
const profilePic = document.getElementById("profilePic");

form.addEventListener("submit", function (event) {
    const file = profilePic.files[0];

    if (file) { 

        if (file && file.size > 10 * 1024 * 1024) { // 10 MB limit
            event.preventDefault(); // stop form from submitting
            alert("Profile picture size exceeds 10 MB. Please choose a smaller file.");
        }

        // 🔹 2. File type check (only images allowed)
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      event.preventDefault();
      alert("Only image files (JPG, PNG, GIF, WebP) are allowed.");
      return;
    }

    }
});

// Password match validation

form.addEventListener("submit", function(event) {
  if (password.value !== confirmPassword.value) {
    event.preventDefault(); // stop form from submitting
    alert("Passwords do not match!");
  }
});

// Show Password feature

showPassword.addEventListener("change", function () {
    const type = this.checked ? "text" : "password";
    password.type = type;
    confirmPassword.type = type;
  
    toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
});
