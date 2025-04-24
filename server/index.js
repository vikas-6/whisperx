import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import { randomUUID } from 'node:crypto';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 10000,
  pingInterval: 5000
});

const PORT = process.env.PORT || 3001;

// In-memory storage for user data (for demo purposes, use a database in production)
const users = new Map(); // Maps socket.id to username

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Set a permanent username when the user joins the room
  socket.on('join-room', ({ user, roomId }) => {
    // Save the username for the current socket
    users.set(socket.id, user.username);

    socket.join(roomId);
    
    io.to(roomId).emit('message', {
      id: randomUUID(),
      content: `${user.username} joined the room`,
      timestamp: Date.now(),
      type: 'system',
      sender: { id: 'system', username: 'System' }
    });
  });

  // Send message handler
  socket.on('send-message', (message) => {
    const messageWithId = {
      ...message,
      id: randomUUID(),
      timestamp: Date.now()
    };
    
    // Broadcast to all clients in the room including sender
    io.in(message.roomId).emit('message', messageWithId);
  });

  // Typing handler
  socket.on('typing', ({ userId, roomId }) => {
    socket.to(roomId).emit('user-typing', userId);
  });

  // Disconnect event, remove user from memory
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    users.delete(socket.id);
  });
  
  // You can also create an event to get the permanent username when needed:
  socket.on('get-username', () => {
    const username = users.get(socket.id);
    socket.emit('username', username); // Send username back to the client
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
