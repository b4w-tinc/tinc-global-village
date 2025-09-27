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
            // For clarity: hide loader just before navigation attempt
            hideLoader();
            alert("Login successful!");
            window.location.href = "./global-feed.html";
        }, 900); // small simulated processing delay
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
// Purpose: handle bfcache (pageshow restore), popstate, and normal loads.
// Put this at the bottom so it always runs after other handlers.

(function loaderNavFix() {
    const loader = loaderOverlay; // may be null

    function ensureHidden(reason) {
        if (!loader) {
            console.debug("loaderNavFix: no #loaderOverlay in DOM (reason:", reason, ")");
            return;
        }
        // Remove active class (this keeps CSS transitions intact)
        loader.classList.remove("active");
        console.debug("loaderNavFix: hid loader (reason:", reason, ")");
    }

    // Hide as soon as DOM is ready (covers fresh loads)
    document.addEventListener("DOMContentLoaded", () => ensureHidden("DOMContentLoaded"));

    // Handle pageshow (fires on back/forward and normal loads)
    window.addEventListener("pageshow", (event) => {
        ensureHidden("pageshow");
        // Safari / some browsers restore from bfcache and still show weird state.
        // Do a tiny delayed hide as a safety net.
        setTimeout(() => ensureHidden("pageshow-delayed"), 50);

        // Optional: if you prefer to force a full reload for bfcache restores uncomment below:
        // if (event.persisted) window.location.reload();
    });

    // Also hide on popstate (history navigation)
    window.addEventListener("popstate", () => ensureHidden("popstate"));

    // Finally, a fallback after 250ms in case edge cases slip through
    setTimeout(() => ensureHidden("fallback-250ms"), 250);
})();
