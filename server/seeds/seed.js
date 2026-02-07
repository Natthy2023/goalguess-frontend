import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from '../models/Player.js';
import { staticPlayersData } from './staticPlayers.js';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/goalguess');
    
    console.log('🌱 Starting database seeding...');
    
    await Player.deleteMany({});
    await Player.insertMany(staticPlayersData);
    
    console.log(`\n✅ Database seeded successfully with ${staticPlayersData.length} players!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
