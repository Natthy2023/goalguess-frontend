import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/firebaseAuth.js';

const router = express.Router();

router.post('/submit-answer', verifyToken, async (req, res) => {
  try {
    const { playerId, isCorrect, pointsEarned, hintLevel } = req.body;
    const userId = req.userId;

    // Get user document
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    // Update user stats
    const totalAttempts = userData.totalAttempts + 1;
    const correctAnswers = isCorrect ? userData.correctAnswers + 1 : userData.correctAnswers;
    const score = userData.score + (isCorrect ? pointsEarned : 0);
    const streak = isCorrect ? userData.streak + 1 : 0;
    const bestScore = score > userData.bestScore ? score : userData.bestScore;

    await userRef.update({
      score,
      correctAnswers,
      totalAttempts,
      streak,
      bestScore,
      updatedAt: new Date()
    });

    // Save game session
    await db.collection('gameSessions').add({
      userId,
      playerId,
      isCorrect,
      pointsEarned,
      hintLevel,
      createdAt: new Date()
    });

    const accuracy = ((correctAnswers / totalAttempts) * 100).toFixed(2);

    res.json({
      score,
      streak,
      accuracy,
      totalAttempts,
      correctAnswers
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
