const form = document.getElementById("signUp");
const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");

// SheetDB URL
const SHEETDB_URL = "https://sheetdb.io/api/v1/tsa10q47pdryu"; 

// Utility: Hash Password
async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Utility: Check if email exists in SheetDB
async function emailExistsInSheet(email) {
    try {
        const res = await fetch(`${SHEETDB_URL}/search?Email=${encodeURIComponent(email)}`, {
            method: "GET",
        });
        const data = await res.json();
        return data.length > 0;
    } catch (err) {
        console.error("Error checking email in SheetDB:", err);
        return false;
    }
}

// Handle Form Submission
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

    //Device ID generation
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("deviceId", deviceId);
    }

    // Check if email exists in SheetDB
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
    localStorage.setItem("deviceId", deviceId)
    localStorage.setItem("activeUser", JSON.stringify(newUser));

    // Save user to SheetDB
    try {
        await fetch(SHEETDB_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: {
                    "Full Name": fullName,
                    "Email": email,
                    "PasswordHash": hashedPass,
                    "Signup Date": new Date().toISOString(),
                    "Verified": "false", //not verfied until OTP/email verification
                    "Device Info": JSON.stringify([deviceId]),
                    "OTP Attempts": 0
                }
            })
        });
    } catch (err) {
        console.error("Error adding user to SheetDB:", err);
    }

    // Redirect to OTP/verification page
    window.location.href = "./sign-up-auth.html";
});

// Show/Hide Password Feature
showPassword.addEventListener("change", function() {
    const type = this.checked ? "text" : "password";
    signupPassword.type = type;
    confirmPassword.type = type;
    toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
});
