import mongoose from 'mongoose';

const multiplayerRoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  players: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    score: { type: Number, default: 0 },
    socketId: String
  }],
  status: { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
  difficulty: { type: String, default: 'Medium' },
  maxPlayers: { type: Number, default: 4 },
  currentQuestion: Number,
  totalQuestions: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(+new Date() + 30 * 60 * 1000) }
});

multiplayerRoomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('MultiplayerRoom', multiplayerRoomSchema);
