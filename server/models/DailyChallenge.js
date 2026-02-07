import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  difficulty: String,
  theme: String,
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    score: Number,
    completed: Boolean,
    completedAt: Date
  }],
  leaderboard: [{
    rank: Number,
    username: String,
    score: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

dailyChallengeSchema.index({ date: 1 });

export default mongoose.model('DailyChallenge', dailyChallengeSchema);
