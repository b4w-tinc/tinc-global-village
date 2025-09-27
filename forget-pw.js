// ---------- ELEMENTS ----------
const form = document.getElementById("resetPw");
const password = document.getElementById("newPw");
const confirmPassword = document.getElementById("confirmPw");
const showPassword = document.getElementById("checkPassword");
const toggleLabel = document.getElementById("toggleLabel");

const otpCode = document.getElementById("otpCode");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const resendOtpBtn = document.getElementById("resendOtpBtn");
const timerDisplay = document.getElementById("timerDisplay");
const countdownSpan = document.getElementById("countdown");

// ---------- RESEND OTP STATE ----------
let countdownTimer;
let resendCount = 0;
let firstResendTime = null;

// ---------- ENABLE VERIFY OTP WHEN 6 CHARACTERS ----------
otpCode.addEventListener("input", () => {
    verifyOtpBtn.disabled = otpCode.value.trim().length !== 6;
});

// ---------- START COUNTDOWN ----------
function startCountdown() {
    let seconds = 60;
    resendOtpBtn.disabled = true;
    timerDisplay.style.display = "block";
    countdownSpan.textContent = seconds;

    countdownTimer = setInterval(() => {
        seconds--;
        countdownSpan.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(countdownTimer);
            resendOtpBtn.disabled = false;
            timerDisplay.style.display = "none";
        }
    }, 1000);
}

// ---------- RESEND OTP WITH LIMIT (max 3 in 10 min) ----------
resendOtpBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const now = Date.now();

    if (!firstResendTime) {
        firstResendTime = now;
    }

    // Reset counter if more than 10 minutes passed
    if (now - firstResendTime > 10 * 60 * 1000) {
        resendCount = 0;
        firstResendTime = now;
    }

    if (resendCount >= 3) {
        alert("❌ You’ve reached the maximum of 3 OTP requests within 10 minutes.");
        return;
    }

    resendCount++;
    alert("✅ A new OTP has been sent to your email!");

    startCountdown();
});

// ---------- PASSWORD MATCH VALIDATION ----------
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (password.value.trim() !== confirmPassword.value.trim()) {
        alert("❌ Passwords do not match!");
        return;
    }

    if (otpCode.value.trim().length !== 6) {
        alert("❌ Invalid OTP!");
        return;
    }

    alert("✅ Password reset successful! Please log in with your new password.");
    window.location.href = "./login.html"; // redirect to login
});

// ---------- SHOW / HIDE PASSWORD ----------
if (showPassword && password && confirmPassword) {
    showPassword.addEventListener("change", function () {
        const type = this.checked ? "text" : "password";
        password.type = type;
        confirmPassword.type = type;

        if (toggleLabel) {
            toggleLabel.textContent = this.checked ? "Hide Password" : "Show Password";
        }
    });
}

// ---------- PERSIST FORM ON BACK NAVIGATION ----------
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        console.debug("Page restored from cache, keeping form values.");
    }
});

// ---------- INIT ----------
startCountdown(); // start timer immediately on load
