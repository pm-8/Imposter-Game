const socket = io();

const status = document.getElementById('status');
const wordDiv = document.getElementById('word');
const startBtn = document.getElementById('startBtn');

startBtn.onclick = () => {
  socket.emit('startGame');
};

socket.on('playerCount', (count) => {
  status.innerText = `${count}/4 players joined`;
});

socket.on('enableStart', () => {
  startBtn.disabled = false;
  status.innerText = "Ready to start!";
});

socket.on('disableStart', () => {
  startBtn.disabled = true;
});

socket.on('word', (word) => {
  wordDiv.innerText = `Your word: ${word}`;
});

socket.on('roomFull', () => {
  alert("Room is full! Only 4 players allowed.");
});
