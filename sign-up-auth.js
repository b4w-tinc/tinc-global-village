// ---------------- ELEMENTS ----------------
const resendBtn = document.getElementById("sendOtpBtn");
const timerBox = document.getElementById("timerDisplay");
const countdownSpan = document.getElementById("countdown");

let cooldownInterval;
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes in ms

// ---------------- FUNCTION: START RESEND COOLDOWN ----------------
function startResendCooldown() {
    resendBtn.disabled = true;
    timerBox.style.display = "block";

    let timeLeft = 60;
    countdownSpan.textContent = timeLeft;

    clearInterval(cooldownInterval); // reset old countdown
    cooldownInterval = setInterval(() => {
        timeLeft--;
        countdownSpan.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(cooldownInterval);
            resendBtn.disabled = false;
            timerBox.style.display = "none";
        }
    }, 1000);
}

// ---------------- FUNCTION: TRACK ATTEMPTS ----------------
function getAttempts() {
    let attempts = JSON.parse(localStorage.getItem("otpResendAttempts")) || [];
    const now = Date.now();

    // filter out attempts older than 10 minutes
    attempts = attempts.filter(ts => now - ts < WINDOW_MS);
    localStorage.setItem("otpResendAttempts", JSON.stringify(attempts));
    return attempts;
}

function addAttempt() {
    const attempts = getAttempts();
    attempts.push(Date.now());
    localStorage.setItem("otpResendAttempts", JSON.stringify(attempts));
    return attempts;
}

// ---------------- RESEND OTP HANDLER ----------------
resendBtn.addEventListener("click", () => {
    const attempts = getAttempts();

    if (attempts.length >= MAX_ATTEMPTS) {
        alert("You’ve reached the maximum OTP resend limit (3 times in 10 mins). Please wait.");
        resendBtn.disabled = true;
        return;
    }

    addAttempt();
    alert("OTP resent");
    startResendCooldown(); // restart cooldown
});

// ---------------- INIT ----------------
window.addEventListener("load", () => {
    startResendCooldown();
});
