(function () {
    emailjs.init("n2ck3LYOGt_XTSnvy")
})();

// ---------------- GET HTML ELEMENTS ----------------
const otpInput = document.getElementById("otpCode");       // OTP input field
const verifyBtn = document.getElementById("verifyOtpBtn");     // Verify button
const resendBtn = document.getElementById("sendOtpBtn");     // Resend OTP button
const messageBox = document.getElementById("messageBox");   // For showing success/error messages
const timerBox = document.getElementById("timerDisplay");       // Box holding the countdown message
const countdownSpan = document.getElementById("countdown"); // Countdown number display

// ---------------- VARIABLES ----------------
let generatedOtp;
let otpExpiry;
let cooldownInterval;

// ---------------- SHEETDB URL ----------------
const SHEETDB_URL = "https://sheetdb.io/api/v1/tsa10q47pdryu"; 

// ---------------- FUNCTION: CHECK USER IN SHEETDB ----------------
async function userExistsInSheet(email) {
    try {
        const res = await fetch(`${SHEETDB_URL}/search?Email=${encodeURIComponent(email)}`, {
            method: "GET",
        });
        const data = await res.json();
        return data.length > 0;
    } catch (err) {
        console.error("Error checking user in SheetDB:", err);
        return false;
    }
}

// ---------------- FUNCTION: SEND OTP ----------------
function sendOtp(userName, userEmail) {
    generatedOtp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    otpExpiry = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

    emailjs.send("service_swosezx", "template_z8kpmhg", {
        user_name: userName,
        passcode: generatedOtp,
        email: userEmail
    })
    .then(() => {
        showMessage(`OTP sent to ${userEmail}`, "success");
        startResendCooldown(); // Start 60s cooldown
    })
    .catch((error) => {
        showMessage("Failed to send OTP. Try again.", "error");
        console.error("EmailJS Error:", error);
    });
}

// ---------------- FUNCTION: VERIFY OTP ----------------
function verifyOtp(e) {
    e.preventDefault();   // ✅ Prevent form reload

    const enteredOtp = otpInput.value.trim();
    const userEmail = localStorage.getItem("userEmail");

    if (!enteredOtp) {
        showMessage("Please enter the OTP.", "error");
        return;
    }

    if (Date.now() > otpExpiry) {
        showMessage("OTP expired. Request a new one.", "error");
        return;
    }

    if (enteredOtp == generatedOtp) {
        // Update user in SheetDB: set Verified = true
        fetch(`${SHEETDB_URL}/Email/${encodeURIComponent(userEmail)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { Verified: "true" } }),
        })
        .then(res => res.json())
        .then(() => {
            showMessage("OTP verified successfully!", "success");
            sendWelcomeEmail();
        })
        .catch((err) => {
            showMessage("Verification succeeded locally, but failed to update database.", "error");
            console.error("SheetDB Update Error:", err);
        });
    } else {
        showMessage("Invalid OTP. Try again.", "error");
    }
}

// ---------------- FUNCTION: SEND WELCOME MAIL ----------------
function sendWelcomeEmail() {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    emailjs.send("service_swosezx", "template_rjxjl4s", {
        user_name: userName,
        email: userEmail
    })
    .then(() => {
        showMessage("Welcome mail sent! Signup complete.", "success");
        // Redirect user after success
        setTimeout(() => {
            window.location.href = "./villages-flashcard.html";
        }, 2000);
    })
    .catch((error) => {
        showMessage("Signup complete, but failed to send welcome mail.", "error");
        console.error("EmailJS Error:", error);
    });
}

// ---------------- FUNCTION: START RESEND COOLDOWN ----------------
function startResendCooldown() {
    resendBtn.disabled = true;
    timerBox.style.display = "block"; // Show countdown message

    let timeLeft = 60; // 60s cooldown
    countdownSpan.textContent = timeLeft;

    cooldownInterval = setInterval(() => {
        timeLeft--;
        countdownSpan.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(cooldownInterval);
            resendBtn.disabled = false;
            timerBox.style.display = "none"; // Hide message
        }
    }, 1000);
}

// ---------------- FUNCTION: SHOW MESSAGE ----------------
function showMessage(msg, type) {
    messageBox.innerHTML = msg;  // ✅ Allow clickable HTML
    messageBox.style.color = type === "success" ? "green" : "red";
    messageBox.style.display = "block";
}

// ---------------- EVENT LISTENERS ----------------
verifyBtn.addEventListener("click", verifyOtp);
resendBtn.addEventListener("click", () => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    sendOtp(userName, userEmail);
});

// ---------------- AUTO SEND OTP ON PAGE LOAD ----------------
window.addEventListener("load", async () => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (userName && userEmail) {
        const exists = await userExistsInSheet(userEmail);
        if (exists) {
            sendOtp(userName, userEmail); // Auto send OTP when page loads
        } else {
            showMessage(
                `User not found in database. Please <a href="./sign-up.html" style="color: blue; text-decoration: underline;">go back to signup</a>.`,
                "error"
            );
            resendBtn.disabled = true;
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
        }
    } else {
        showMessage("Missing user data. Please go back and sign up again.", "error");
    }
});
