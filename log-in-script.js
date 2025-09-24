const loginForm = document.getElementById("logIn");
const loginPassword = document.getElementById("loginPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");
const loaderOverlay = document.getElementById("loaderOverlay"); // 🔑 Loader element

// Utility: Hash Password
async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// 🔑 Utility: Get or create a persistent device ID stored in localStorage
function getDeviceId() {
    // Use the deviceId saved at signup (or saved earlier). This ensures signup & login use same id on same browser.
    let deviceId = localStorage.getItem('deviceId');
    if (deviceId && deviceId.toString().trim() !== "") return deviceId;

    // If none saved, generate one and store it (fallback for older clients)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        deviceId = crypto.randomUUID();
    } else {
        deviceId = 'dev-' + Math.random().toString(36).slice(2, 12);
    }
    localStorage.setItem('deviceId', deviceId);
    return deviceId;
}

const SHEETDB_URL = "https://sheetdb.io/api/v1/tsa10q47pdryu";

// Handle Login
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = loginPassword.value;

        // Show loader when login starts
        if (loaderOverlay) loaderOverlay.classList.add("active");

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

            // 🔑 Device ID check (robust parsing of "Device Info")
            const currentDeviceId = getDeviceId();

            // Parse Device Info field (supports JSON array or comma-separated list)
            let userDevices = [];
            const raw = user["Device Info"];

            if (raw && raw.toString().trim() !== "") {
                try {
                    // Try JSON.parse first (handles ["id1","id2"])
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        userDevices = parsed.map(d => d + '').map(s => s.trim()).filter(Boolean);
                    } else if (typeof parsed === 'string') {
                        userDevices = parsed.split(',').map(d => d.trim()).filter(Boolean);
                    }
                } catch (e) {
                    // Not valid JSON — fallback to comma-split (handles "id1, id2")
                    userDevices = raw.toString().split(',').map(d => d.trim()).filter(Boolean);
                }
            }

            // If currentDeviceId not found, treat as new device
            if (!userDevices.includes(currentDeviceId)) {
                // New device → redirect to login-auth page
                // We store only what we need for the next step; do NOT add device to DB here.
                sessionStorage.setItem("pendingAuthUser", JSON.stringify({
                    email,
                    hashedPassword,
                    currentDeviceId
                }));
                alert("We detected a login from a new device. Please verify with OTP.");
                window.location.href = "./log-in-auth.html";
                return;
            }

            // Existing device → proceed with normal login flow
            localStorage.setItem("activeUser", JSON.stringify(user));
            alert("Login successful!");
            window.location.href = "./global-feed.html";

        } catch (err) {
            console.error("Error fetching user from SheetDB:", err);
            alert("An error occurred while logging in. Please try again later.");
        } finally {
            // Always hide loader once login attempt is finished
            if (loaderOverlay) loaderOverlay.classList.remove("active");
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
