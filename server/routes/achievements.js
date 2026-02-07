import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();

// Get user achievements
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('achievements')
      .where('userId', '==', userId)
      .get();

    const achievements = snapshot.docs.map(doc => doc.data());
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlock achievement
router.post('/unlock', async (req, res) => {
  try {
    const { userId, achievementId, title, description } = req.body;

    await db.collection('achievements').add({
      userId,
      achievementId,
      title,
      description,
      unlockedAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
