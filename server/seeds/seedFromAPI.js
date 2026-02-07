import axios from 'axios';
import { db } from '../config/firebase.js';

const API_KEY = 'bf72c08198ac349abb10d2664c114612b4d8b462ea961f6dc0dc2ab99c40d6c2';
const API_BASE = 'https://apiv3.apifootball.com/';

// List of famous football players to fetch (100+ players)
const playerNames = [
  'Messi', 'Cristiano Ronaldo', 'Mbappé', 'Haaland', 'Salah',
  'Vinícius Júnior', 'Bellingham', 'Kane', 'Rodri', 'Yamal',
  'Palmer', 'Osimhen', 'Martínez', 'Wirtz', 'Lookman',
  'Raphinha', 'Semenyo', 'Pulisic', 'Paz', 'Olise',
  'Díaz', 'Gyökeres', 'Neymar', 'Lewandowski', 'Suárez',
  'Ramos', 'Kroos', 'Modrić', 'Iniesta', 'Xavi',
  'Buffon', 'Neuer', 'De Gea', 'Agüero', 'Benzema',
  'Bale', 'Özil', 'Müller', 'Robben', 'Ribéry',
  'Griezmann', 'Dybala', 'Cavani', 'Icardi', 'Immobile',
  'Insigne', 'Mahrez', 'Sané', 'Foden', 'Saka',
  'Mount', 'Havertz', 'Sancho', 'Rashford', 'Greenwood',
  'Vinicius', 'Rodrygo', 'Benzema', 'Modric', 'Kroos',
  'Busquets', 'Pique', 'Alba', 'Ter Stegen', 'Gavi',
  'Pedri', 'Ansu Fati', 'Depay', 'Lewandowski', 'Muller',
  'Sane', 'Gnabry', 'Coman', 'Neuer', 'Kimmich',
  'Alaba', 'Hernandez', 'Upamecano', 'De Bruyne', 'Gundogan',
  'Mahrez', 'Foden', 'Cancelo', 'Dias', 'Ederson',
  'Van Dijk', 'Alexander Arnold', 'Robertson', 'Alisson', 'Salah',
  'Mane', 'Firmino', 'Jota', 'Diaz', 'Nunez',
  'Ronaldo', 'Bruno Fernandes', 'Rashford', 'Sancho', 'Varane',
  'Lisandro Martinez', 'Shaw', 'De Gea', 'Casemiro', 'McTominay',
  'Eriksen', 'Antony', 'Garnacho', 'Martial', 'Elanga',
  'Trossard', 'Saka', 'Martinelli', 'Odegaard', 'Partey',
  'Xhaka', 'White', 'Saliba', 'Gabriel', 'Ramsdale',
  'Tomiyasu', 'Zinchenko', 'Tierney', 'Koscielny', 'Pepe',
  'Son', 'Kane', 'Richarlison', 'Maddison', 'Sarr',
  'Bissouma', 'Hojbjerg', 'Porro', 'Van de Ven', 'Romero',
  'Dier', 'Lloris', 'Forster', 'Emerson', 'Tanganga'
];

// Hints and facts templates
const hintsTemplates = {
  Forward: [
    'Known for incredible goal-scoring ability',
    'Has won multiple Golden Boot awards',
    'Famous for pace, dribbling, and attacking prowess'
  ],
  Midfielder: [
    'Master of midfield control and passing',
    'Known for vision and creating chances',
    'Dominates the center with technical excellence'
  ],
  Defender: [
    'One of the most reliable defenders',
    'Known for defensive prowess and leadership',
    'Famous for strength, positioning, and tackling'
  ],
  Goalkeeper: [
    'Legendary shot-stopper with incredible reflexes',
    'Known for distribution and penalty area command',
    'One of the greatest goalkeepers of all time'
  ]
};

const factsTemplates = {
  Forward: [
    'Has scored over 50 goals in international football',
    'Won multiple Ballon d\'Or awards',
    'Known for celebration style and charisma'
  ],
  Midfielder: [
    'Won multiple UEFA Champions League titles',
    'Known for leadership and midfield control',
    'Represented their country in multiple World Cups'
  ],
  Defender: [
    'Won multiple UEFA Champions League titles',
    'Known for consistency and reliability',
    'Captained their national team to major tournaments'
  ],
  Goalkeeper: [
    'Won multiple UEFA Champions League titles',
    'Known for longevity and consistency',
    'Holds records for clean sheets in major competitions'
  ]
};

async function fetchPlayerData(playerName) {
  try {
    const response = await axios.get(API_BASE, {
      params: {
        action: 'get_players',
        player_name: playerName,
        APIkey: API_KEY
      },
      timeout: 5000
    });

    if (response.data && response.data.length > 0) {
      const player = response.data[0];
      return {
        name: player.player_name || playerName,
        nationality: player.nationality || 'Unknown',
        position: player.position || 'Forward',
        imageUrl: player.player_image || `https://via.placeholder.com/300x400?text=${playerName}`,
        playerId: player.player_id
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${playerName}:`, error.message);
    return null;
  }
}

function getHintsForPosition(position, index) {
  const hints = hintsTemplates[position] || hintsTemplates.Forward;
  return {
    hint1: hints[index % hints.length],
    hint2: hints[(index + 1) % hints.length],
    hint3: hints[(index + 2) % hints.length]
  };
}

function getFactForPosition(position, index) {
  const facts = factsTemplates[position] || factsTemplates.Forward;
  return facts[index % facts.length];
}

function getDifficulty(index) {
  const difficulties = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard'];
  return difficulties[index % difficulties.length];
}

async function seedFromAPI() {
  try {
    console.log('🌱 Starting API-based seeding...');
    console.log(`📡 Fetching ${playerNames.length} players from API Football...`);

    const players = [];
    
    for (let i = 0; i < playerNames.length; i++) {
      const playerName = playerNames[i];
      console.log(`[${i + 1}/${playerNames.length}] Fetching ${playerName}...`);
      
      const playerData = await fetchPlayerData(playerName);
      
      if (playerData) {
        const position = playerData.position || 'Forward';
        const difficulty = getDifficulty(i);
        
        const player = {
          name: playerData.name,
          nationality: playerData.nationality,
          position: position,
          imageUrl: playerData.imageUrl,
          hints: getHintsForPosition(position, i),
          mcqOptions: [
            playerData.name,
            playerNames[(i + 1) % playerNames.length],
            playerNames[(i + 2) % playerNames.length],
            playerNames[(i + 3) % playerNames.length]
          ].sort(() => Math.random() - 0.5),
          funFact: getFactForPosition(position, i),
          difficulty: difficulty,
          competitions: ['Champions League', 'World Cup', 'Premier League', 'La Liga'].slice(0, 3 + (i % 2)),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        players.push(player);
        console.log(`✅ ${playerData.name} (${position}) - ${difficulty}`);
      } else {
        console.log(`⚠️ Failed to fetch ${playerName}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (players.length === 0) {
      console.error('❌ No players fetched from API');
      process.exit(1);
    }

    // Clear existing players
    console.log('\n🗑️ Clearing existing players...');
    const snapshot = await db.collection('players').get();
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
    }

    // Add new players
    console.log(`\n💾 Saving ${players.length} players to Firestore...`);
    for (const player of players) {
      await db.collection('players').add(player);
    }

    console.log(`\n✅ Successfully seeded ${players.length} players from API Football!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedFromAPI();
