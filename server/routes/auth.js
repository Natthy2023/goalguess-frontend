import express from 'express';
import { db } from '../config/firebase.js';
import crypto from 'crypto';

const router = express.Router();

// Simple hash function for passwords (not production-grade, use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user document
    const userId = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password);

    await db.collection('users').doc(userId).set({
      uid: userId,
      username,
      email,
      password: hashedPassword,
      score: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      streak: 0,
      bestScore: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${userId}:${email}`).toString('base64');

    res.json({
      token,
      user: {
        id: userId,
        username,
        email
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const hashedPassword = hashPassword(password);

    if (userData.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create a simple token
    const token = Buffer.from(`${userDoc.id}:${email}`).toString('base64');

    res.json({
      token,
      user: {
        id: userDoc.id,
        username: userData.username,
        email: userData.email
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({
      id: userDoc.id,
      username: userData.username,
      email: userData.email,
      score: userData.score,
      correctAnswers: userData.correctAnswers,
      totalAttempts: userData.totalAttempts,
      streak: userData.streak,
      bestScore: userData.bestScore,
      avatar: userData.avatar || '👨‍🦱',
      bio: userData.bio || '',
      favoriteTeam: userData.favoriteTeam || ''
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[0];

    const { username, email, avatar, bio, favoriteTeam } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;
    if (favoriteTeam !== undefined) updateData.favoriteTeam = favoriteTeam;
    updateData.updatedAt = new Date();

    await db.collection('users').doc(userId).update(updateData);

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    res.json({
      id: userId,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar,
      bio: userData.bio,
      favoriteTeam: userData.favoriteTeam
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
