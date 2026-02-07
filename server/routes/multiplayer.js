import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/firebaseAuth.js';

const router = express.Router();

// Create room
router.post('/create-room', verifyToken, async (req, res) => {
  try {
    const { difficulty, maxPlayers } = req.body;
    const roomId = Math.random().toString(36).substring(7).toUpperCase();
    
    const room = {
      roomId,
      host: req.userId,
      difficulty: difficulty || 'Medium',
      maxPlayers: maxPlayers || 4,
      players: [{
        userId: req.userId,
        username: req.body.username || 'Player',
        score: 0,
        socketId: null
      }],
      status: 'waiting',
      currentQuestion: 0,
      totalQuestions: 5,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    };
    
    await db.collection('multiplayerRooms').doc(roomId).set(room);
    res.json({ roomId, room });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get room details
router.get('/room/:roomId', async (req, res) => {
  try {
    const roomDoc = await db.collection('multiplayerRooms').doc(req.params.roomId).get();
    
    if (!roomDoc.exists) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ id: roomDoc.id, ...roomDoc.data() });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: error.message });
  }
});

// Join room
router.post('/join-room/:roomId', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { username } = req.body;
    
    const roomRef = db.collection('multiplayerRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = roomDoc.data();

    // Check if room is full
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ error: 'Room is full' });
    }

    // Check if user already in room
    const userExists = room.players.some(p => p.userId === req.userId);
    if (userExists) {
      return res.json({ roomId, room });
    }

    // Add player to room
    room.players.push({
      userId: req.userId,
      username: username || 'Player',
      score: 0,
      socketId: null
    });

    // Auto-start game if max players reached
    if (room.players.length === room.maxPlayers) {
      room.status = 'playing';
    }

    await roomRef.update(room);
    res.json({ roomId, room });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get active rooms
router.get('/active-rooms', async (req, res) => {
  try {
    const snapshot = await db.collection('multiplayerRooms')
      .where('status', '==', 'waiting')
      .limit(20)
      .get();

    const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching active rooms:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit answer in multiplayer
router.post('/submit-answer/:roomId', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { isCorrect, pointsEarned } = req.body;

    const roomRef = db.collection('multiplayerRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = roomDoc.data();
    const playerIdx = room.players.findIndex(p => p.userId === req.userId);

    if (playerIdx === -1) {
      return res.status(400).json({ error: 'Player not in room' });
    }

    if (isCorrect) {
      room.players[playerIdx].score += pointsEarned;
    }

    room.currentQuestion += 1;

    // End game if all questions answered
    if (room.currentQuestion >= room.totalQuestions) {
      room.status = 'finished';
    }

    await roomRef.update(room);
    res.json({ room });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(400).json({ error: error.message });
  }
});

// Leave room / Delete room
router.post('/leave-room/:roomId', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomRef = db.collection('multiplayerRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = roomDoc.data();

    // Remove player from room
    room.players = room.players.filter(p => p.userId !== req.userId);

    // Delete room if empty or if host left
    if (room.players.length === 0 || room.host === req.userId) {
      await roomRef.delete();
      return res.json({ message: 'Room deleted' });
    }

    // Update room
    await roomRef.update(room);
    res.json({ message: 'Left room', room });
  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete room (host only)
router.post('/delete-room/:roomId', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomRef = db.collection('multiplayerRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = roomDoc.data();

    // Only host can delete
    if (room.host !== req.userId) {
      return res.status(403).json({ error: 'Only host can delete room' });
    }

    await roomRef.delete();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(400).json({ error: error.message });
  }
});

// Finish game and cleanup
router.post('/finish-game/:roomId', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomRef = db.collection('multiplayerRooms').doc(roomId);
    
    // Delete room after game finishes
    await roomRef.delete();
    res.json({ message: 'Game finished and room deleted' });
  } catch (error) {
    console.error('Error finishing game:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
