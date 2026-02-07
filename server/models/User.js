import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
