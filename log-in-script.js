// login.js - loader + submit + show/hide password + robust pageshow handling

const loginForm = document.getElementById("logIn");
const loginPassword = document.getElementById("loginPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");
const loaderOverlay = document.getElementById("loaderOverlay"); // Loader element

// --- HELPERS: show/hide loader (single source of truth) ---
function showLoader() {
    if (!loaderOverlay) return;
    loaderOverlay.classList.add("active");
}

function hideLoader() {
    if (!loaderOverlay) return;
    loaderOverlay.classList.remove("active");
}

// --- FORM SUBMISSION ---
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Show loader
        showLoader();

        // Simulate login success (frontend-only)
        // NOTE: in real app you would await server response here
        setTimeout(() => {
            hideLoader();
            alert("Login successful!");
            window.location.href = "./global-feed.html";
        }, 900); // simulated processing delay
    });
}

// --- SHOW/HIDE PASSWORD FEATURE ---
if (showPassword && loginPassword) {
    showPassword.addEventListener("change", function () {
        const type = this.checked ? "text" : "password";
        loginPassword.type = type;

        if (toggleLabel) {
            toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
        }
    });
}

// ---------------- FIX: RESET LOADER ON HISTORY NAVIGATION ----------------
(function loaderNavFix() {
    function ensureHidden(reason) {
        if (!loaderOverlay) return;
        loaderOverlay.classList.remove("active");
        console.debug("loaderNavFix: hid loader (reason:", reason, ")");
    }

    // Hide immediately on load
    document.addEventListener("DOMContentLoaded", () => ensureHidden("DOMContentLoaded"));

    // Handle back/forward navigation
    window.addEventListener("pageshow", (event) => {
        ensureHidden("pageshow");
        setTimeout(() => ensureHidden("pageshow-delayed"), 50);

        // If browser restored from cache and stuck -> reload (optional)
        // if (event.persisted) window.location.reload();
    });

    // Hide on history navigation
    window.addEventListener("popstate", () => ensureHidden("popstate"));

    // Quick safety net
    setTimeout(() => ensureHidden("fallback-250ms"), 250);

    // 🔥 Hard failsafe: force hide after 10s no matter what
    setTimeout(() => ensureHidden("failsafe-10s"), 10000);
})();
