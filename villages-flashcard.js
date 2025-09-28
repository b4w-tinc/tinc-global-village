// --- ELEMENTS ---
const form = document.getElementById("resetPw");
const otpInput = document.getElementById("otpCode");
const verifyBtn = document.getElementById("verifyOtpBtn");
const resendBtn = document.getElementById("resendOtp");
const countdownSpan = document.getElementById("countdown");
const timerDisplay = document.getElementById("timerDisplay");
const newPassword = document.getElementById("newPw");
const confirmPassword = document.getElementById("confirmPw");
const saveBtn = form.querySelector('.submit'); // Save Changes button
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");

// --- INITIAL STATE ---
verifyBtn.disabled = true;
saveBtn.disabled = true;
otpInput.value = "";

// --- SHOW/HIDE PASSWORD ---
if (showPassword && newPassword && confirmPassword) {
    showPassword.addEventListener("change", () => {
        const type = showPassword.checked ? "text" : "password";
        newPassword.type = type;
        confirmPassword.type = type;
        toggleLabel.textContent = showPassword.checked ? "Hide Password" : "Show Password";
    });
}

// --- ENABLE VERIFY BUTTON WHEN OTP IS 6 CHARACTERS ---
otpInput.addEventListener("input", () => {
    verifyBtn.disabled = otpInput.value.length !== 6;
});

// --- VERIFY OTP BUTTON CLICK ---
verifyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("OTP validated");
    saveBtn.disabled = false; // Enable Save Changes after OTP is validated
});

// --- SAVE CHANGES BUTTON ---
saveBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const pass = newPassword.value.trim();
    const confirmPass = confirmPassword.value.trim();

    if (!pass || !confirmPass) {
        alert("Please fill in all password fields");
        return;
    }

    if (pass !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    alert("Password reset successfully!");
    window.location.href = "./log-in.html"; // Redirect to login page
});

// --- RESEND OTP BUTTON & COUNTDOWN ---
let resendCount = 0;
let cooldown = 60; // seconds
let cooldownInterval;

function startCooldown() {
    resendBtn.disabled = true;
    timerDisplay.style.display = "block";
    let timeLeft = cooldown;
    countdownSpan.textContent = timeLeft;

    cooldownInterval = setInterval(() => {
        timeLeft--;
        countdownSpan.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(cooldownInterval);
            if (resendCount < 3) resendBtn.disabled = false;
            timerDisplay.style.display = "none";
        }
    }, 1000);
}

// Start countdown immediately
startCooldown();

// Resend OTP click
resendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (resendCount >= 3) return;

    alert("OTP resent!");
    resendCount++;
    startCooldown();
});
