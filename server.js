const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = [];
let words = [
  "apple", "banana", "castle", "pyramid", "movie", "pizza", "Jahnvi", "Pokemon",
  "mountain", "river", "computer", "keyboard", "television", "ocean", "jungle",
  "space", "robot", "rocket", "elephant", "guitar", "violin", "bicycle", "airplane",
  "library", "doctor", "engineer", "teacher", "student", "school", "university",
  "rainbow", "cloud", "storm", "desert", "forest", "volcano", "planet", "sun",
  "moon", "star", "comet", "galaxy", "zebra", "lion", "tiger", "panda", "koala",
  "penguin", "dolphin", "whale", "shark", "octopus", "submarine", "pirate", "ninja",
  "samurai", "dragon", "wizard", "witch", "ghost", "zombie", "vampire", "werewolf",
  "magnet", "battery", "lamp", "candle", "mirror", "glasses", "chair", "table",
  "notebook", "pencil", "pen", "eraser", "ruler", "calculator", "phone", "camera",
  "tripod", "microphone", "speaker", "clock", "watch", "hat", "glove", "jacket",
  "socks", "shoes", "sandals", "boots", "belt", "scarf", "bag", "wallet", "money",
  "coin", "ticket", "passport", "map", "train", "bus", "car", "bike", "taxi", "plane",
  "airport", "station", "hotel", "room", "bed", "pillow", "blanket", "soap", "brush",
  "toothpaste", "shampoo", "towel", "fridge", "oven", "stove", "sink", "mirror"
];


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