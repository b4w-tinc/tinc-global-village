// ------ LOADER ----------
const loaderOverlay = document.getElementById("loaderOverlay");

function showLoader() {
    if (loaderOverlay) {
        loaderOverlay.style.display = "flex"; // ensure visible
        loaderOverlay.classList.add("active");
    }
}

function hideLoader(force = false) {
    if (loaderOverlay) {
        loaderOverlay.classList.remove("active");
        if (force) loaderOverlay.style.display = "none"; // 🔥 hard reset
    }
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

        if (pass !== confirmPass) {
            alert("Passwords do not match!");
            hideLoader(true); // force reset if validation fails
            return;
        }

        // Simulate signup success
        setTimeout(() => {
            hideLoader(true); // force hide before navigating
            alert("Signup successful! Please verify your Email.");
            window.location.href = "../signup-auth/sign-up-auth.html";
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

// ---------------- FIX: LOADER FAILSAFE ----------------
(function loaderNavFix() {
    function resetLoader(reason) {
        if (!loaderOverlay) return;
        loaderOverlay.classList.remove("active");
        loaderOverlay.style.display = "none"; // 🔥 force hide
        console.debug("Loader reset (" + reason + ")");
    }

    document.addEventListener("DOMContentLoaded", () => resetLoader("DOMContentLoaded"));
    window.addEventListener("pageshow", () => {
        resetLoader("pageshow");
        setTimeout(() => resetLoader("pageshow-delayed"), 50);
    });
    window.addEventListener("popstate", () => resetLoader("popstate"));

    // safety nets
    setTimeout(() => resetLoader("failsafe-250ms"), 250);
    setTimeout(() => resetLoader("failsafe-10s"), 10000);
})();
