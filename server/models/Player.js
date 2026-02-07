import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationality: String,
  position: String,
  clubs: [String],
  competitions: [String],
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Expert'], default: 'Medium' },
  imageUrl: String,
  hints: {
    hint1: String,
    hint2: String,
    hint3: String
  },
  mcqOptions: [String],
  funFact: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Player', playerSchema);
