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
const saveBtn = form.querySelector('button[type="submit"]'); // Save Changes button

// ---------- RESEND OTP STATE ----------
let countdownTimer;
let resendCount = 0;
let firstResendTime = null;
let otpVerified = false;

// ---------- INITIAL STATE ----------
password.disabled = true;
confirmPassword.disabled = true;
saveBtn.disabled = true;

// ---------- ENABLE VERIFY OTP WHEN 6 CHARACTERS ----------
otpCode.addEventListener("input", () => {
    verifyOtpBtn.disabled = otpCode.value.trim().length !== 6;
});

// ---------- VERIFY OTP BUTTON ----------
verifyOtpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (otpCode.value.trim().length === 6) {
        alert("✅ OTP verified!");
        otpVerified = true;
        password.disabled = false;
        confirmPassword.disabled = false;
        saveBtn.disabled = true; // still disabled until passwords are filled
    } else {
        alert("❌ Please enter a 6-digit OTP first.");
    }
});

// ---------- WATCH PASSWORD FIELDS TO ENABLE SAVE BUTTON ----------
function checkPasswordsFilled() {
    saveBtn.disabled = !(password.value.trim() && confirmPassword.value.trim());
}

password.addEventListener("input", checkPasswordsFilled);
confirmPassword.addEventListener("input", checkPasswordsFilled);

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

    if (!firstResendTime) firstResendTime = now;

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

// ---------- PASSWORD MATCH VALIDATION (SAVE CHANGES) ----------
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!otpVerified) {
        alert("❌ Please verify OTP first!");
        return;
    }

    if (password.value.trim() !== confirmPassword.value.trim()) {
        alert("❌ Passwords do not match!");
        return;
    }

    alert("✅ Password reset successful! Please log in with your new password.");
    window.location.href = "../log-in/log-in.html"; // redirect to login
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
    if (event.persisted) console.debug("Page restored from cache, keeping form values.");
});

// ---------- INIT ----------
startCountdown(); // start timer immediately on load
