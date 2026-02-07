import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mode: { type: String, enum: ['hint', 'image'], required: true },
  difficulty: String,
  competition: String,
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  playerName: String,
  isCorrect: Boolean,
  pointsEarned: Number,
  hintLevel: Number,
  timeSpent: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('GameSession', gameSessionSchema);
