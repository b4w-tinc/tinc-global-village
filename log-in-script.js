const loginForm = document.getElementById("logIn");
const loginPassword = document.getElementById("loginPassword");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");
const loaderOverlay = document.getElementById("loaderOverlay"); // Loader element

// --- FORM SUBMISSION ---
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Show loader
        if (loaderOverlay) loaderOverlay.classList.add("active");

        // Simulate login success
        alert("Login successful!");
        window.location.href = "./global-feed.html";

        // Hide loader after small delay (simulate processing)
        setTimeout(() => {
            if (loaderOverlay) loaderOverlay.classList.remove("active");
        }, 1200);
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
window.addEventListener("pageshow", (event) => {
    const loader = document.getElementById("loaderOverlay");
    if (loader) loader.classList.remove("active");

    // Optional: force reload if page was cached
    if (event.persisted) {
        window.location.reload();
    }
});
