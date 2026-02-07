import { playersList } from './playersList.js';

// Hint templates for different player types
const hintTemplates = {
  Forward: [
    'Known for incredible goal-scoring ability and finishing.',
    'Has won multiple Golden Boot awards.',
    'Famous for their pace, dribbling, and attacking prowess.'
  ],
  Midfielder: [
    'Master of midfield control and passing accuracy.',
    'Known for their vision and ability to create chances.',
    'Dominates the center of the pitch with technical excellence.'
  ],
  Defender: [
    'One of the most reliable defenders in football history.',
    'Known for their defensive prowess and leadership.',
    'Famous for their strength, positioning, and tackling ability.'
  ],
  Goalkeeper: [
    'Legendary shot-stopper with incredible reflexes.',
    'Known for their distribution and command of the penalty area.',
    'One of the greatest goalkeepers of all time.'
  ]
};

const funFactTemplates = {
  Forward: [
    'Has scored over 50 goals in international football.',
    'Won multiple Ballon d\'Or awards during their career.',
    'Known for their celebration style and charisma.'
  ],
  Midfielder: [
    'Won multiple UEFA Champions League titles.',
    'Known for their leadership and midfield control.',
    'Has represented their country in multiple World Cups.'
  ],
  Defender: [
    'Won multiple UEFA Champions League titles as a defender.',
    'Known for their consistency and reliability.',
    'Captained their national team to major tournaments.'
  ],
  Goalkeeper: [
    'Won multiple UEFA Champions League titles.',
    'Known for their longevity and consistency.',
    'Holds records for clean sheets in major competitions.'
  ]
};

const mcqTemplates = {
  Forward: ['Striker', 'Winger', 'Attacking Midfielder', 'Center Forward'],
  Midfielder: ['Playmaker', 'Box-to-Box', 'Defensive Midfielder', 'Attacking Midfielder'],
  Defender: ['Center Back', 'Full Back', 'Wing Back', 'Sweeper'],
  Goalkeeper: ['Shot-Stopper', 'Sweeper Keeper', 'Distribution Specialist', 'Reflexes Master']
};

export function generatePlayers() {
  return playersList.map((player, index) => {
    const position = player.position;
    const hints = hintTemplates[position] || hintTemplates.Forward;
    const facts = funFactTemplates[position] || funFactTemplates.Forward;
    const mcqOptions = mcqTemplates[position] || mcqTemplates.Forward;

    return {
      name: player.name,
      nationality: player.nationality,
      position: player.position,
      imageUrl: `https://apiv3.apifootball.com/img/players/${player.id}_${player.slug}.jpg`,
      hints: {
        hint1: hints[index % hints.length],
        hint2: hints[(index + 1) % hints.length],
        hint3: hints[(index + 2) % hints.length]
      },
      mcqOptions: [
        player.name,
        mcqOptions[index % mcqOptions.length],
        mcqOptions[(index + 1) % mcqOptions.length],
        mcqOptions[(index + 2) % mcqOptions.length]
      ].sort(() => Math.random() - 0.5),
      funFact: facts[index % facts.length],
      difficulty: player.difficulty,
      competitions: ['Champions League', 'World Cup', 'Premier League', 'La Liga', 'Serie A'].slice(0, 3 + (index % 2))
    };
  });
}

// Export for use in seed.js
export const playersData = generatePlayers();
