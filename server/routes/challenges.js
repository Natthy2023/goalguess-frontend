import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();

// Get daily challenge status for user
router.get('/daily/status', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];

    // Check if user already completed today's challenge
    const completionSnapshot = await db.collection('dailyChallengeCompletions')
      .where('userId', '==', userId)
      .where('date', '==', todayString)
      .limit(1)
      .get();

    const isCompleted = !completionSnapshot.empty;
    const completionData = isCompleted ? completionSnapshot.docs[0].data() : null;

    // Calculate time until next day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const timeUntilNextDay = tomorrow - new Date();

    res.json({
      isCompleted,
      completionData,
      date: todayString,
      timeUntilNextDay,
      nextChallengeTime: tomorrow.toISOString()
    });
  } catch (error) {
    console.error('Error checking challenge status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit daily challenge completion
router.post('/daily/complete', async (req, res) => {
  try {
    const { userId, score } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];

    // Check if already completed
    const existingSnapshot = await db.collection('dailyChallengeCompletions')
      .where('userId', '==', userId)
      .where('date', '==', todayString)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return res.status(400).json({ error: 'Challenge already completed today' });
    }

    // Record completion
    await db.collection('dailyChallengeCompletions').add({
      userId,
      date: todayString,
      score,
      completedAt: new Date(),
      timestamp: new Date().getTime()
    });

    res.json({ success: true, message: 'Challenge completed! Come back tomorrow for a new one.' });
  } catch (error) {
    console.error('Error completing challenge:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get daily challenge
router.get('/daily', async (req, res) => {
  try {
    const today = new Date().toDateString();
    const snapshot = await db.collection('dailyChallenges')
      .where('date', '==', today)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No challenge for today' });
    }

    res.json(snapshot.docs[0].data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit challenge answer
router.post('/submit', async (req, res) => {
  try {
    const { userId, challengeId, isCorrect, pointsEarned } = req.body;

    await db.collection('challengeSubmissions').add({
      userId,
      challengeId,
      isCorrect,
      pointsEarned,
      submittedAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
