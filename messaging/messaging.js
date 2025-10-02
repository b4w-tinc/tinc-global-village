// ===== SIDEBAR TOGGLE =====
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("mainSidebar");
const overlay = document.getElementById("overlay");

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    if (sidebar.classList.contains("active")) {
        overlay.style.display = "block";
    } else {
        overlay.style.display = "none";
    }
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.style.display = "none";
});

// ===== CHAT SYSTEM =====
const chats = document.querySelectorAll('.chat');
const chatHead = document.querySelector('.chat-head header h2');
const messagesContainer = document.querySelector('.messages');
const sendInput = document.querySelector('.send-span');
const sendBtn = document.querySelector('.send-extra img'); // send svg
const attachBtn = document.querySelector('.send-msg img:first-child'); // attachment svg

// Store chat histories separately
let chatData = {
  "Product Team": [
    { type: "received", text: "Hey team, are we ready for the review?" },
    { type: "sent", text: "Almost, give me 5 minutes." },
    { type: "received", text: "Cool, waiting on you 🚀" }
  ],
  "Design Squad": [
    { type: "received", text: "Can you check the new mockups?" },
    { type: "sent", text: "Sure, sending feedback soon." }
  ],
  "HR Team": [
    { type: "sent", text: "Any update on the onboarding?" },
    { type: "received", text: "Yes, new hires start Monday!" }
  ]
};

let activeChat = null;

// Render chat messages
function renderMessages(chatName) {
  messagesContainer.innerHTML = "";
  if (chatData[chatName]) {
    chatData[chatName].forEach(msg => {
      const msgEl = document.createElement('div');
      msgEl.classList.add('message', msg.type);

      if (msg.file) {
        // If message is a file
        const fileLink = document.createElement('a');
        fileLink.href = msg.file.url;
        fileLink.textContent = msg.file.name;
        fileLink.target = "_blank";
        msgEl.appendChild(fileLink);
      } else {
        msgEl.textContent = msg.text;
      }

      messagesContainer.appendChild(msgEl);
    });
  }
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send text message
function sendMessage() {
  if (!activeChat) return;
  const text = sendInput.value.trim();
  if (text !== "") {
    const newMsg = { type: "sent", text };
    chatData[activeChat].push(newMsg);
    renderMessages(activeChat);
    sendInput.value = "";
  }
}

// ===== EVENT LISTENERS =====

// Switch between chats
chats.forEach(chat => {
  chat.addEventListener('click', () => {
    chats.forEach(c => c.classList.remove('active-chat'));
    chat.classList.add('active-chat');

    const chatName = chat.querySelector('.chat-name h3').textContent;
    activeChat = chatName;

    chatHead.textContent = chatName;
    renderMessages(chatName);
  });
});

// Send via send button
sendBtn.addEventListener('click', sendMessage);

// Send via Enter key
sendInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// Handle file attachments
attachBtn.addEventListener('click', () => {
  if (!activeChat) return;

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.multiple = false;
  fileInput.style.display = 'none';

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const newMsg = {
        type: "sent",
        file: { name: file.name, url: fileUrl }
      };
      chatData[activeChat].push(newMsg);
      renderMessages(activeChat);
    }
  });

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
});
