const loginForm = document.getElementById("logIn");
const loginPassword = document.getElementById("loginPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");

// Handle Login
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = loginPassword.value;

    // Pull stored users
    let users = JSON.parse(localStorage.getItem("tincUsers")) || [];

    // Look for a match
    const existingUser = users.find(user => user.email === email && user.password === password);

    if (!existingUser) {
        alert("No account found with these email. Please sign up first.");
        return;
    }

    // Check password
    if (existingUser.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
    }

    // Save as active session
    localStorage.setItem("activeUser", JSON.stringify(existingUser));

    alert("Login successful!");
    // Redirect to homepage/dashboard
    window.location.href = "./global-feed.html";
});

// Show/Hide Password feature
showPassword.addEventListener("change", function () {
    const type = this.checked ? "text" : "password";
    loginPassword.type = type;

    toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
});
