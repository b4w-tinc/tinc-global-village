// ------ LOADER ----------
function showLoader() {
    document.getElementById("loaderOverlay").classList.add("active");
}

function hideLoader() {
    document.getElementById("loaderOverlay").classList.remove("active");
}

// ------- FORM ELEMENTS -------------
const form = document.getElementById("signUp");
const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");

// ---------------- HANDLE FORM SUBMISSION ----------------
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
        alert("Signup successful! Pls verify Email");
        window.location.href = "./sign-up-auth.html"; // redirect to sign-up authentication
    }, 1500);
});

// -------- SHOW/HIDE PASSWORD FEATURE --------
showPassword.addEventListener("change", function () {
    const type = this.checked ? "text" : "password";
    signupPassword.type = type;
    confirmPassword.type = type;
    toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
});

// ---------------- FIX: RESET LOADER ON HISTORY NAVIGATION ----------------
window.addEventListener("pageshow", (event) => {
    const loader = document.getElementById("loaderOverlay");
    if (loader) loader.classList.remove("active");
});