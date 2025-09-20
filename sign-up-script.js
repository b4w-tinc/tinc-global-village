const form = document.getElementById("signUp");
const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");

// =====================
// Config: your deployed Web App URL
// =====================
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby47wBzI44LdG40zTI2WmASVkcHhoedYIabvlVNCYS3oL4lBUOPE9rzm6fZUM8n-fA0aw/exec";

// =====================
// Utility: Hash Password
// =====================
async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// =====================
// Check if email exists in Google Sheet (authoritative)
// =====================
async function emailExistsInSheet(email) {
    try {
        const response = await fetch(`${WEB_APP_URL}?action=checkEmail&email=${encodeURIComponent(email)}`, {
            method: "GET"
        });
        const data = await response.json();
        return data.exists; // true/false
    } catch (err) {
        console.error("Error checking email in Google Sheet:", err);
        return false; // fail safe
    }
}

// =====================
// Handle Form Submission
// =====================
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pass = signupPassword.value;
    const confirmPass = confirmPassword.value;

    // Password match validation
    if (pass !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    // Hash password
    const hashedPass = await hashPassword(pass);

    // Check if email exists in Google Sheet
    const existsInSheet = await emailExistsInSheet(email);
    if (existsInSheet) {
        alert("An account with this email already exists. Please log in instead.");
        return;
    }

    // Save user locally (fast cache)
    let users = JSON.parse(localStorage.getItem("tincUsers")) || [];
    const newUser = { fullName, email, password: hashedPass };
    users.push(newUser);
    localStorage.setItem("tincUsers", JSON.stringify(users));
    localStorage.setItem("activeUser", JSON.stringify(newUser));

    // Save user to Google Sheet
    try {
        const postResponse = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                passwordHash: hashedPass,
                verified: false,
                device: navigator.userAgent,
                otpAttempts: 0
            })
        });

        const postResult = await postResponse.json();
        if (postResult.result === "success") {
            console.log("User successfully added to Google Sheet at row:", postResult.row);
        } else {
            console.error("Failed to add user to Google Sheet:", postResult.message);
        }

    } catch (err) {
        console.error("Error adding user to Google Sheet:", err);
    }

    // Redirect to OTP/verification page
    window.location.href = "./sign-up-auth.html";
});

// =====================
// Show/Hide Password Feature
// =====================
showPassword.addEventListener("change", function() {
    const type = this.checked ? "text" : "password";
    signupPassword.type = type;
    confirmPassword.type = type;
    toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
});
