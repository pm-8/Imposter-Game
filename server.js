const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = [];
let words = ["apple", "banana", "castle", "pyramid", "movie", "pizza"];

io.on('connection', (socket) => {
  if (players.length >= 4) {
    socket.emit('roomFull');
    return;
  }

  players.push(socket);
  io.emit('playerCount', players.length);

  if (players.length === 4) {
    io.emit('enableStart');
  }

  socket.on('startGame', () => {
    let chosenWord = words[Math.floor(Math.random() * words.length)];
    let imposterIndex = Math.floor(Math.random() * 4);
    players.forEach((player, i) => {
      if (i === imposterIndex) {
        player.emit('word', "IMPOSTER");
      } else {
        player.emit('word', chosenWord);
      }
    });
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p !== socket);
    io.emit('playerCount', players.length);
    io.emit('disableStart');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});