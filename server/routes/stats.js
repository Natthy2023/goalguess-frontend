import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/firebaseAuth.js';

const router = express.Router();

router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    // Get game sessions
    const sessionsSnapshot = await db.collection('gameSessions')
      .where('userId', '==', req.params.userId)
      .limit(50)
      .get();

    const sessions = sessionsSnapshot.docs.map(doc => doc.data());
    const hintStats = sessions.filter(s => s.mode === 'hint');
    const imageStats = sessions.filter(s => s.mode === 'image');

    res.json({
      user: {
        username: userData.username,
        score: userData.score,
        correctAnswers: userData.correctAnswers,
        totalAttempts: userData.totalAttempts,
        streak: userData.streak,
        bestScore: userData.bestScore,
        accuracy: userData.totalAttempts > 0 
          ? ((userData.correctAnswers / userData.totalAttempts) * 100).toFixed(2)
          : 0
      },
      hintMode: {
        played: hintStats.length,
        correct: hintStats.filter(s => s.isCorrect).length,
        avgPoints: hintStats.length 
          ? (hintStats.reduce((sum, s) => sum + s.pointsEarned, 0) / hintStats.length).toFixed(2)
          : 0
      },
      imageMode: {
        played: imageStats.length,
        correct: imageStats.filter(s => s.isCorrect).length,
        accuracy: imageStats.length 
          ? ((imageStats.filter(s => s.isCorrect).length / imageStats.length) * 100).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
