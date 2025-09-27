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

// ---------------- FIX: LOADER FAILSAFE ----------------
window.addEventListener("pageshow", () => {
    if (loaderOverlay) {
        // hide immediately on back nav
        loaderOverlay.classList.remove("active");

        // ⏳ failsafe: if still stuck, kill it after 10s
        setTimeout(() => {
            loaderOverlay.classList.remove("active");
            console.debug("Failsafe: loader forcibly hidden after 10s");
        }, 10000);
    }
});
