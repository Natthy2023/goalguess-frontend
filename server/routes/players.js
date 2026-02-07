import express from 'express';
import axios from 'axios';
import { db } from '../config/firebase.js';

const router = express.Router();

// Popular footballers from major leagues
const POPULAR_PLAYERS = [
  'Cristiano Ronaldo', 'Lionel Messi', 'Kylian Mbappé', 'Erling Haaland', 'Vinícius Júnior',
  'Harry Kane', 'Robert Lewandowski', 'Mohamed Salah', 'Neymar Jr', 'Lautaro Martínez',
  'Rodri', 'Jude Bellingham', 'Phil Foden', 'Cole Palmer', 'Bruno Fernandes',
  'Florian Wirtz', 'Jamal Musiala', 'Pedri', 'Gavi', 'Declan Rice',
  'Virgil van Dijk', 'Rúben Dias', 'Sergio Ramos', 'Achraf Hakimi', 'Trent Alexander-Arnold',
  'Kyle Walker', 'Alphonso Davies', 'Lisandro Martínez', 'Eder Militão', 'Antonio Rüdiger',
  'Manuel Neuer', 'Gianluigi Donnarumma', 'Ederson', 'Alisson', 'Jan Oblak',
  'Bukayo Saka', 'Raphinha', 'Leroy Sané', 'Riyad Mahrez', 'Antony',
  'Richarlison', 'Rodrygo', 'Lamine Yamal', 'Christian Pulisic', 'Michael Olise'
];

// Cache for fetched players to avoid duplicates
let fetchedPlayersSession = new Set();

// Reset session players every hour
setInterval(() => {
  fetchedPlayersSession.clear();
}, 60 * 60 * 1000);

// Cache for player images from TheSportsDB
const playerImageCache = {};

async function fetchPlayerImageFromAPI(playerName) {
  if (playerImageCache[playerName]) {
    return playerImageCache[playerName];
  }

  try {
    const response = await axios.get(
      `https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=${encodeURIComponent(playerName)}`,
      { timeout: 5000 }
    );

    // API returns { player: [...] } structure
    if (response.data && response.data.player && response.data.player.length > 0) {
      const player = response.data.player[0];
      // Prioritize strCutout (player cutout image), then strThumb (thumbnail)
      const playerData = {
        name: player.strPlayer || playerName,
        image: player.strCutout || player.strThumb || null,
        cutout: player.strCutout || null,
        thumb: player.strThumb || null
      };
      playerImageCache[playerName] = playerData;
      console.log(`✅ Fetched image for ${playerName}:`, playerData.cutout);
      return playerData;
    } else {
      console.warn(`⚠️ No player data found for ${playerName}`);
    }
  } catch (error) {
    console.error(`Error fetching player image for ${playerName}:`, error.message);
  }

  return { name: playerName, image: null, cutout: null, thumb: null };
}

// Cache for players (refresh every 5 minutes)
let playersCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

async function getAllPlayers() {
  const now = Date.now();
  
  if (playersCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return playersCache;
  }

  const snapshot = await db.collection('players').get();
  playersCache = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      nationality: data.nationality || '',
      position: data.position || '',
      imageUrl: data.imageUrl || 'https://via.placeholder.com/300x400?text=Player',
      hints: data.hints || { hint1: '', hint2: '', hint3: '' },
      mcqOptions: data.mcqOptions || [],
      funFact: data.funFact || '',
      difficulty: data.difficulty || 'Medium',
      competitions: data.competitions || []
    };
  });
  cacheTimestamp = now;
  
  return playersCache;
}

// Get all players with filters
router.get('/', async (req, res) => {
  try {
    const { difficulty, competition } = req.query;
    let players = await getAllPlayers();

    if (difficulty) {
      players = players.filter(p => p.difficulty === difficulty);
    }

    if (competition) {
      players = players.filter(p => p.competitions?.includes(competition));
    }

    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get random player (optimized) - MUST be before /:id
router.get('/random', async (req, res) => {
  try {
    const { difficulty, competition } = req.query;
    let players = await getAllPlayers();

    if (difficulty) {
      players = players.filter(p => p.difficulty === difficulty);
    }

    if (competition) {
      players = players.filter(p => p.competitions?.includes(competition));
    }

    if (players.length === 0) {
      return res.status(404).json({ error: 'No players found' });
    }

    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    
    // Fetch real image from TheSportsDB
    const playerImage = await fetchPlayerImageFromAPI(randomPlayer.name);
    
    res.json({
      ...randomPlayer,
      imageUrl: playerImage.cutout || playerImage.image || playerImage.thumb || randomPlayer.imageUrl,
      cutout: playerImage.cutout,
      thumb: playerImage.thumb
    });
  } catch (error) {
    console.error('Error fetching random player:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get random popular player for image mode (no duplicates in session)
router.get('/image-mode/random', async (req, res) => {
  try {
    // Get available players (not yet fetched in this session)
    const availablePlayers = POPULAR_PLAYERS.filter(p => !fetchedPlayersSession.has(p));
    
    // If all players have been fetched, reset the session
    if (availablePlayers.length === 0) {
      fetchedPlayersSession.clear();
      availablePlayers.push(...POPULAR_PLAYERS);
    }

    // Pick a random player from available ones
    const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    fetchedPlayersSession.add(randomPlayer);

    // Fetch player image and details from TheSportsDB
    const playerImage = await fetchPlayerImageFromAPI(randomPlayer);
    
    // Get 3 random other players for MCQ options
    const otherPlayers = POPULAR_PLAYERS.filter(p => p !== randomPlayer);
    const mcqOptions = [randomPlayer];
    for (let i = 0; i < 3; i++) {
      const randomOption = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
      if (!mcqOptions.includes(randomOption)) {
        mcqOptions.push(randomOption);
      }
    }

    res.json({
      id: `image-${randomPlayer}`,
      name: playerImage.name || randomPlayer,
      imageUrl: playerImage.cutout || playerImage.image || playerImage.thumb || `https://via.placeholder.com/300x400?text=${encodeURIComponent(randomPlayer)}`,
      cutout: playerImage.cutout,
      thumb: playerImage.thumb,
      mcqOptions: mcqOptions.sort(() => Math.random() - 0.5),
      funFact: `${randomPlayer} is a world-class footballer playing in top European leagues.`,
      difficulty: 'Medium'
    });
  } catch (error) {
    console.error('Error fetching image mode player:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get player image from TheSportsDB - MUST be before /:id
router.get('/image/:playerName', async (req, res) => {
  try {
    const { playerName } = req.params;
    const playerData = await fetchPlayerImageFromAPI(decodeURIComponent(playerName));
    res.json(playerData);
  } catch (error) {
    console.error('Error fetching player image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get player by ID - MUST be last
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('players').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const data = doc.data();
    res.json({
      id: doc.id,
      name: data.name || '',
      nationality: data.nationality || '',
      position: data.position || '',
      imageUrl: data.imageUrl || 'https://via.placeholder.com/300x400?text=Player',
      hints: data.hints || { hint1: '', hint2: '', hint3: '' },
      mcqOptions: data.mcqOptions || [],
      funFact: data.funFact || '',
      difficulty: data.difficulty || 'Medium',
      competitions: data.competitions || []
    });
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new player
router.post('/', async (req, res) => {
  try {
    const playerData = req.body;
    const docRef = await db.collection('players').add({
      ...playerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    playersCache = null;

    res.status(201).json({ id: docRef.id, ...playerData });
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
