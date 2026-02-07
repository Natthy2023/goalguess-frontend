import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: Date,
    progress: Number,
    target: Number
  }],
  totalPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Achievement', achievementSchema);
