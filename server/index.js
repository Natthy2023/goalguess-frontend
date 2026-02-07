import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { db } from './config/firebase.js';
import authRoutes from './routes/auth.js';
import playerRoutes from './routes/players.js';
import leaderboardRoutes from './routes/leaderboard.js';
import gameRoutes from './routes/game.js';
import statsRoutes from './routes/stats.js';
import multiplayerRoutes from './routes/multiplayer.js';
import challengesRoutes from './routes/challenges.js';
import achievementsRoutes from './routes/achievements.js';
import teamsRoutes from './routes/teams.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Test Firebase connection
app.get('/health', async (req, res) => {
  try {
    await db.collection('players').limit(1).get();
    res.json({ status: 'Firebase connected' });
  } catch (error) {
    res.status(500).json({ status: 'Firebase error', error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/multiplayer', multiplayerRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/teams', teamsRoutes);

// WebSocket for multiplayer
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', async (data) => {
    const { roomId, userId, username } = data;
    socket.join(roomId);
    
    try {
      const roomDoc = await db.collection('multiplayerRooms').doc(roomId).get();
      if (roomDoc.exists) {
        const room = roomDoc.data();
        if (room.players.length < room.maxPlayers) {
          room.players.push({ userId, username, socketId: socket.id });
          await db.collection('multiplayerRooms').doc(roomId).update({ players: room.players });
          io.to(roomId).emit('player-joined', { username, totalPlayers: room.players.length });
          
          // Auto-start if max players reached
          if (room.players.length === room.maxPlayers) {
            io.to(roomId).emit('game-auto-start');
          }
        }
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });

  socket.on('submit-answer', (data) => {
    io.to(data.roomId).emit('answer-submitted', data);
  });

  socket.on('start-game', (roomId) => {
    io.to(roomId).emit('game-started');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔥 Firebase connected`);
  console.log(`🌐 Accessible from any IP address`);
});
