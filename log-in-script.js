const loginForm = document.getElementById("logIn");
const loginPassword = document.getElementById("loginPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");
const loaderOverlay = document.getElementById("loaderOverlay"); // Loader element

// --- HELPERS ---
function showLoader() {
    if (!loaderOverlay) return;
    loaderOverlay.style.display = "flex"; // make sure it's visible
    loaderOverlay.classList.add("active");
}

function hideLoader(force = false) {
    if (!loaderOverlay) return;
    loaderOverlay.classList.remove("active");
    if (force) loaderOverlay.style.display = "none"; // HARD RESET
}

// --- FORM SUBMISSION ---
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        showLoader();

        setTimeout(() => {
            hideLoader();
            alert("Login successful!");
            window.location.href = "./global-feed.html";
        }, 900);
    });
}

// --- SHOW/HIDE PASSWORD FEATURE ---
if (showPassword && loginPassword) {
    showPassword.addEventListener("change", function () {
        loginPassword.type = this.checked ? "text" : "password";
        if (toggleLabel) {
            toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
        }
    });
}

// --- FIX: FORCE RESET LOADER ON HISTORY NAVIGATION ---
(function loaderNavFix() {
    function resetLoader(reason) {
        if (!loaderOverlay) return;
        loaderOverlay.classList.remove("active");
        loaderOverlay.style.display = "none"; // 🔥 FORCE HIDE
        console.debug("Loader reset (" + reason + ")");
    }

    document.addEventListener("DOMContentLoaded", () => resetLoader("DOMContentLoaded"));
    window.addEventListener("pageshow", () => {
        resetLoader("pageshow");
        setTimeout(() => resetLoader("pageshow-delayed"), 50);
    });
    window.addEventListener("popstate", () => resetLoader("popstate"));

    // Safety nets
    setTimeout(() => resetLoader("fallback-250ms"), 250);
    setTimeout(() => resetLoader("failsafe-10s"), 10000);
})();
