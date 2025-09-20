const loginForm = document.getElementById("logIn");
const loginPassword = document.getElementById("loginPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");

// Utility: Hash Password
async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// SheetDB URL
const SHEETDB_URL = "https://sheetdb.io/api/v1/tsa10q47pdryu";

// Handle Login
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = loginPassword.value;

        // Hash entered password
        const hashedPassword = await hashPassword(password);

        try {
            // Fetch user from SheetDB
            const res = await fetch(`${SHEETDB_URL}/search?Email=${encodeURIComponent(email)}`, {
                method: "GET"
            });
            const data = await res.json();

            if (!data || data.length === 0) {
                alert("No account found with this email. Please sign up first.");
                return;
            }

            const user = data[0];

            // Check password
            if (user["PasswordHash"] !== hashedPassword) {
                alert("Incorrect password. Please try again.");
                return;
            }

            // Check verified status
            if (!user["Verified"] || user["Verified"].toString().toLowerCase() === "false") {
                alert("Your email is not verified. Please complete OTP verification first.");
                return;
            }

            // Save as active session in LocalStorage (fast cache)
            localStorage.setItem("activeUser", JSON.stringify(user));

            alert("Login successful!");
            // Redirect to homepage/dashboard
            window.location.href = "./global-feed.html";

        } catch (err) {
            console.error("Error fetching user from SheetDB:", err);
            alert("An error occurred while logging in. Please try again later.");
        }
    });
}

// Show/Hide Password Feature
if (showPassword && loginPassword) {
    showPassword.addEventListener("change", function () {
        const type = this.checked ? "text" : "password";
        loginPassword.type = type;

        if (toggleLabel) {
            toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
        }
    });
}
