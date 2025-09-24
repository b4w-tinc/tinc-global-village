(function () {
    emailjs.init("SJ8FYr5mn_AlPAdup");
})();

// ---------------- GET HTML ELEMENTS ----------------
const otpInput = document.getElementById("otpCode");
const verifyBtn = document.getElementById("verifyOtpBtn");
const resendBtn = document.getElementById("sendOtpBtn");
const messageBox = document.getElementById("messageBox");
const timerBox = document.getElementById("timerDisplay");
const countdownSpan = document.getElementById("countdown");

// ---------------- VARIABLES ----------------
let generatedOtp;
let otpExpiry;
let cooldownInterval;

// ---------------- SHEETDB URL ----------------
const SHEETDB_URL = "https://sheetdb.io/api/v1/tsa10q47pdryu"; 

// ---------------- IPINFO API KEY ----------------
const IPINFO_TOKEN = "39e54df78a2594"; 

// ---------------- FUNCTION: GET USER FROM SHEETDB ----------------
async function getUserFromSheet(email) {
    try {
        const res = await fetch(`${SHEETDB_URL}/search?Email=${encodeURIComponent(email)}`);
        const data = await res.json();
        return data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error("Error checking user in SheetDB:", err);
        return null;
    }
}

// ---------------- FUNCTION: SEND OTP ----------------
function sendOtp(userName, userEmail) {
    generatedOtp = Math.floor(100000 + Math.random() * 900000);
    otpExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

    emailjs.send("service_5fwha32", "template_x9rnj1p", {
        user_name: userName,
        passcode: generatedOtp,
        email: userEmail
    })
    .then(() => {
        showMessage(`OTP sent to ${userEmail}`, "success");
        startResendCooldown();
    })
    .catch((error) => {
        showMessage("Failed to send OTP. Try again.", "error");
        console.error("EmailJS Error:", error);
    });
}

// ---------------- FUNCTION: VERIFY OTP ----------------
async function verifyOtp(e) {
    e.preventDefault();

    const enteredOtp = otpInput.value.trim();
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const newDeviceId = localStorage.getItem("currentDeviceId");

    if (!enteredOtp) {
        showMessage("Please enter the OTP.", "error");
        return;
    }

    if (Date.now() > otpExpiry) {
        showMessage("OTP expired. Request a new one.", "error");
        return;
    }

    if (enteredOtp == generatedOtp) {
        const user = await getUserFromSheet(userEmail);
        if (!user) {
            showMessage("User not found in database.", "error");
            return;
        }

        // Append new device ID if not already stored
        let existingDevices = user["Device Info"] ? user["Device Info"].split(",") : [];
        if (!existingDevices.includes(newDeviceId)) {
            existingDevices.push(newDeviceId);
        }
        const updatedDevices = existingDevices.join(",");

        // Update the row in SheetDB
        fetch(`${SHEETDB_URL}/Email/${encodeURIComponent(userEmail)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { "Device Info": updatedDevices } }),
        })
        .then(res => res.json())
        .then(() => {
            showMessage("Device verified successfully!", "success");
            sendLoginNotification(userName, userEmail);
        })
        .catch((err) => {
            showMessage("Device verified locally, but failed to update database.", "error");
            console.error("SheetDB Update Error:", err);
        });

    } else {
        showMessage("Invalid OTP. Try again.", "error");
    }
}

// ---------------- FUNCTION: SEND LOGIN NOTIFICATION ----------------
async function sendLoginNotification(userName, userEmail) {
    try {
        // Get location data from ipinfo.io
        const locationRes = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
        const locationData = await locationRes.json();

        const location = locationData.city && locationData.country
            ? `${locationData.city}, ${locationData.country}`
            : "Unknown location";

        const isp = locationData.org || "Unknown ISP";

        // Detect device/browser
        const ua = navigator.userAgent;
        let device = "Unknown Device";
        if (ua.includes("Windows")) device = "Windows PC";
        else if (ua.includes("Mac")) device = "Mac";
        else if (ua.includes("Android")) device = "Android Phone";
        else if (ua.includes("iPhone")) device = "iPhone";
        else if (ua.includes("iPad")) device = "iPad";

        let browser = "Unknown Browser";
        if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Edge")) browser = "Edge";

        const deviceInfo = `${browser} on ${device}`;

        // Format login time
        const time = new Date().toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short"
        });

        // Send EmailJS notification
        emailjs.send("service_5fwha32", "template_jkktmer", {
            user_name: userName,
            email: userEmail,
            device: deviceInfo,
            location: location,
            isp: isp,
            time: time
        })
        .then(() => {
            showMessage("Login verified mail sent!", "success");
            setTimeout(() => {
                window.location.href = "./global-feed.html";
            }, 2000);
        })
        .catch((error) => {
            showMessage("Login complete, but failed to send mail.", "error");
            console.error("EmailJS Error:", error);
        });
    } catch (err) {
        console.error("Error fetching location:", err);
        showMessage("Login complete, but location fetch failed.", "error");
    }
}

// ---------------- FUNCTION: START RESEND COOLDOWN ----------------
function startResendCooldown() {
    resendBtn.disabled = true;
    timerBox.style.display = "block";

    let timeLeft = 60;
    countdownSpan.textContent = timeLeft;

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

// ---------------- FUNCTION: SHOW MESSAGE ----------------
function showMessage(msg, type) {
    messageBox.innerHTML = msg;
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
        const user = await getUserFromSheet(userEmail);
        if (user) {
            sendOtp(userName, userEmail);
        } else {
            showMessage(
                `User not found. Please <a href="./sign-up.html" style="color: blue; text-decoration: underline;">go back to signup</a>.`,
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
