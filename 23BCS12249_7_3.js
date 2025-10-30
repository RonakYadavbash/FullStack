// public/main.js
const socket = io(); // connects to same origin

// UI elements
const usersList = document.getElementById('usersList');
const messagesDiv = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const joinBtn = document.getElementById('joinBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

let joined = false;
let typingTimeout = null;

// helper: append message
function appendMessage(text, cls = '') {
  const div = document.createElement('div');
  div.className = `message ${cls}`;
  div.innerHTML = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Join chat
joinBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim() || 'Anonymous';
  socket.emit('join', name);
  joined = true;
  usernameInput.disabled = true;
  joinBtn.disabled = true;
  messageInput.disabled = false;
  sendBtn.disabled = false;
  messageInput.focus();
});

// Send message
sendBtn.addEventListener('click', () => {
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit('chatMessage', text);
  messageInput.value = '';
  socket.emit('typing', false);
});

// Send on Enter
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  } else {
    // notify typing started
    socket.emit('typing', true);
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('typing', false);
    }, 800);
  }
});

// Socket events
socket.on('connect', () => {
  appendMessage(`<span class="system">Connected to server (socket id: ${socket.id})</span>`, 'system');
});

socket.on('disconnect', () => {
  appendMessage('<span class="system">Disconnected from server</span>', 'system');
  usersList.innerHTML = '';
});

// update users list
socket.on('users', (usersArray) => {
  usersList.innerHTML = '';
  usersArray.forEach((u) => {
    const li = document.createElement('li');
    li.textContent = u;
    usersList.appendChild(li);
  });
});

// incoming chat message
socket.on('chatMessage', (payload) => {
  const time = new Date(payload.time).toLocaleTimeString();
  appendMessage(`<strong>${payload.from}</strong> <small>${time}</small><br>${payload.message}`);
});

// system messages
socket.on('systemMessage', (payload) => {
  const time = new Date(payload.time).toLocaleTimeString();
  appendMessage(`<span class="system">${payload.message} <small>${time}</small></span>`, 'system');
});

// typing indicator
socket.on('typing', ({ username, isTyping }) => {
  if (isTyping) {
    typingIndicator.textContent = `${username} is typing...`;
  } else {
    typingIndicator.textContent = '';
  }
});
