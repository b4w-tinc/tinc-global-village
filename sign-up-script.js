const form = document.getElementById("signUp");
const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");

// Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();
    
    const email = document.getElementById("signupEmail").value.trim();
    const pass = signupPassword.value;
    const confirmPass = confirmPassword.value;

    // Password match validation
    if (pass !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    // Get existing users or create empty array
    let users = JSON.parse(localStorage.getItem("tincUsers")) || [];

    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("An account with this email already exists. Please log in instead.");
        return;
    }
        
    // Save new user
    const newUser = { email: email, password: pass };
    users.push(newUser);
    localStorage.setItem("tincUsers", JSON.stringify(users));

    // Log the user in immediately (active session)
    localStorage.setItem("activeUser", JSON.stringify(newUser));

    // Redirect to next page
    window.location.href = "./villages-flashcard.html";
});

// Show/Hide Password feature
showPassword.addEventListener("change", function () {
    const type = this.checked ? "text" : "password";
    signupPassword.type = type;
    confirmPassword.type = type;
  
    toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
});
