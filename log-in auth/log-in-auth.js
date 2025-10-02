const resendBtn = document.getElementById("sendOtpBtn");
const timerBox = document.getElementById("timerDisplay");
const countdownSpan = document.getElementById("countdown");

let cooldownInterval;
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes in ms

// --- START RESEND COOLDOWN ---
function startResendCooldown() {
    if (!resendBtn || !timerBox || !countdownSpan) return;

    resendBtn.disabled = true;
    timerBox.style.display = "block";

    let timeLeft = 60;
    countdownSpan.textContent = timeLeft;

    clearInterval(cooldownInterval);
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

// --- ATTEMPTS TRACKING ---
function getAttempts() {
    let attempts = JSON.parse(localStorage.getItem("loginOtpResendAttempts")) || [];
    const now = Date.now();

    // filter out expired attempts (older than 10 mins)
    attempts = attempts.filter(ts => now - ts < WINDOW_MS);
    localStorage.setItem("loginOtpResendAttempts", JSON.stringify(attempts));
    return attempts;
}

function addAttempt() {
    const attempts = getAttempts();
    attempts.push(Date.now());
    localStorage.setItem("loginOtpResendAttempts", JSON.stringify(attempts));
    return attempts;
}

// --- PAGE LOAD: AUTO START COUNTDOWN ---
window.addEventListener("load", () => {
    startResendCooldown();
});

// --- RESEND OTP CLICK ---
if (resendBtn) {
    resendBtn.addEventListener("click", () => {
        const attempts = getAttempts();

        if (attempts.length >= MAX_ATTEMPTS) {
            alert("You’ve reached the maximum OTP resend limit (3 times in 10 mins). Please wait.");
            resendBtn.disabled = true;
            return;
        }

        addAttempt();
        alert("OTP resent");
        startResendCooldown();
    });
}
