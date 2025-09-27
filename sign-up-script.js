// ------ LOADER ----------
const loaderOverlay = document.getElementById("loaderOverlay");

function showLoader() {
    if (loaderOverlay) loaderOverlay.classList.add("active");
}

function hideLoader() {
    if (loaderOverlay) loaderOverlay.classList.remove("active");
}

// ------- FORM ELEMENTS -------------
const form = document.getElementById("signUp");
const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");

// ---------------- HANDLE FORM SUBMISSION ----------------
if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        showLoader();

        const pass = signupPassword.value.trim();
        const confirmPass = confirmPassword.value.trim();

        // Password match validation
        if (pass !== confirmPass) {
            alert("Passwords do not match!");
            hideLoader();
            return;
        }

        // Simulate signup success
        setTimeout(() => {
            hideLoader();
            alert("Signup successful! Please verify your Email.");
            window.location.href = "./sign-up-auth.html";
        }, 1500);
    });
}

// -------- SHOW/HIDE PASSWORD FEATURE --------
if (showPassword && signupPassword && confirmPassword) {
    showPassword.addEventListener("change", function () {
        const type = this.checked ? "text" : "password";
        signupPassword.type = type;
        confirmPassword.type = type;
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
        console.debug("signup.js: hid loader (reason:", reason, ")");
    }

    document.addEventListener("DOMContentLoaded", () => ensureHidden("DOMContentLoaded"));

    window.addEventListener("pageshow", (event) => {
        ensureHidden("pageshow");
        setTimeout(() => ensureHidden("pageshow-delayed"), 50);
        // If you prefer a hard reload on cached restore:
        // if (event.persisted) window.location.reload();
    });

    window.addEventListener("popstate", () => ensureHidden("popstate"));

    setTimeout(() => ensureHidden("fallback-250ms"), 250);
})();
