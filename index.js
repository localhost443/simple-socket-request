const io = require('socket.io')(3000, {
  cors: {
    origins: ['http://localhost:8080']
  }
})

const roomList = {};

io.on('connection', (socket) => {
  socket.on("createRoom", (roomName) => {
    // socket.join(roomName);
    if(!roomList[roomName]) {
      roomList[roomName] = true;
      socket.emit("isRoomCreated", true, socket.id);
    } else {
      socket.emit("isRoomCreated", false, socket.id);
    }
    console.log(`created room: ${roomName}`);
  })

  socket.on("joinRoom", (roomName) => {
    if(roomList[roomName]) {
      socket.join(roomName);
      socket.emit("isRoomJoined", true, socket.id);
      console.log(`joined room: ${roomName}`);
    } else {
      socket.emit("isRoomJoined", false, socket.id);
    }
  })

  socket.on("sendMessage", ({ message, roomName }) => {
    console.log(`message: ${message}, room: ${roomName}`);
    socket.to(roomName).emit("receiveMessage", message);
  });
})
