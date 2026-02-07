import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();

// Get top 100 players
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users')
      .orderBy('score', 'desc')
      .limit(100)
      .get();

    const leaderboard = snapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username,
      score: doc.data().score,
      correctAnswers: doc.data().correctAnswers,
      totalAttempts: doc.data().totalAttempts,
      streak: doc.data().streak,
      bestScore: doc.data().bestScore
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user rank
router.get('/:userId', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: userDoc.id,
      username: userDoc.data().username,
      score: userDoc.data().score,
      correctAnswers: userDoc.data().correctAnswers,
      totalAttempts: userDoc.data().totalAttempts,
      streak: userDoc.data().streak,
      bestScore: userDoc.data().bestScore
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
