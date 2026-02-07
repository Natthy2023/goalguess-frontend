import { db } from '../config/firebase.js';
import { staticPlayersData } from './staticPlayers.js';

async function seedFirebase() {
  try {
    console.log('🌱 Starting Firestore seeding...');

    // Clear existing players
    const playersSnapshot = await db.collection('players').get();
    for (const doc of playersSnapshot.docs) {
      await doc.ref.delete();
    }

    // Add players to Firestore
    for (const player of staticPlayersData) {
      await db.collection('players').add({
        ...player,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log(`✅ Firestore seeded successfully with ${staticPlayersData.length} players!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedFirebase();
