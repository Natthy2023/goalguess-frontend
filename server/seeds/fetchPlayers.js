import axios from 'axios';

const API_KEY = 'bf72c08198ac349abb10d2664c114612b4d8b462ea961f6dc0dc2ab99c40d6c2';
const API_BASE = 'https://apiv3.apifootball.com/';

// List of 150 famous football players to fetch
const playerNames = [
  'Lionel Messi', 'Cristiano Ronaldo', 'Kylian Mbappé', 'Erling Haaland', 'Mohamed Salah',
  'Vinícius Júnior', 'Jude Bellingham', 'Harry Kane', 'Rodri', 'Lamine Yamal',
  'Cole Palmer', 'Victor Osimhen', 'Lautaro Martínez', 'Florian Wirtz', 'Ademola Lookman',
  'Raphinha', 'Antoine Semenyo', 'Christian Pulisic', 'Nico Paz', 'Michael Olise',
  'Brahim Díaz', 'Viktor Gyökeres', 'Neymar Jr', 'Robert Lewandowski', 'Luis Suárez',
  'Sergio Ramos', 'Toni Kroos', 'Luka Modrić', 'Andrés Iniesta', 'Xavi Hernández',
  'Gianluigi Buffon', 'Petr Čech', 'Iker Casillas', 'Edwin van der Sar', 'Zinedine Zidane',
  'Ronaldinho', 'Ronaldo', 'Pelé', 'Diego Maradona', 'Johan Cruyff',
  'Sergio Busquets', 'Gerard Piqué', 'Carles Puyol', 'Víctor Valdés', 'Thierry Henry',
  'Patrick Vieira', 'Dennis Bergkamp', 'Ian Wright', 'Tony Adams', 'David Seaman',
  'Arjen Robben', 'Franck Ribéry', 'Bastian Schweinsteiger', 'Mario Gomez', 'Thomas Müller',
  'Philipp Lahm', 'Manuel Neuer', 'Jerome Boateng', 'David Alaba', 'Jérôme Kimpembe',
  'Marquinhos', 'Thiago Silva', 'Dani Alves', 'Juan Mata', 'David de Gea',
  'Ángel Di María', 'Gonzalo Higuaín', 'Carlos Tévez', 'Javier Mascherano', 'Juan Román Riquelme',
  'Sergio Agüero', 'Claudio Bravo', 'Alexis Sánchez', 'Arturo Vidal', 'Gary Medel',
  'Radamel Falcao', 'James Rodríguez', 'Carlos Bacca', 'Fredy Guarín', 'Édison Cavani',
  'Diego Godín', 'Fernando Muslera', 'Álvaro Pereira', 'Giancarlo González', 'Keylor Navas',
  'Bryan Ruiz', 'Rafa Márquez', 'Guillermo Ochoa', 'Carlos Vela', 'Hirving Lozano',
  'Héctor Moreno', 'Raúl Jiménez', 'Edson Álvarez', 'Sadio Mané', 'Riyad Mahrez',
  'Mohamed Aboutrika', 'Ahmed Hassan', 'Essam El-Hadary', 'George Weah', 'Samuel Eto\'o',
  'Roger Milla', 'Didier Drogba', 'Yaya Touré', 'Kolo Touré', 'Didier Zokora',
  'Gervinho', 'Wilfried Bony', 'Seydou Keita', 'Frederic Kanoute', 'El Hadji Diouf',
  'Papiss Cissé', 'Demba Ba', 'Kalidou Koulibaly', 'Cheikh Ndoye', 'Ismaïla Sarr',
  'Mane Garrincha', 'Vavá', 'Gerson', 'Didi', 'Nilton Santos',
  'Castilho', 'Zagallo', 'Tostão', 'Jairzinho', 'Carlos Alberto',
  'Clodoaldo', 'Rivelino', 'Félix', 'Socrates', 'Zé Maria',
  'Eder', 'Careca', 'Dunga', 'Bebeto', 'Romário',
  'Branco', 'Cafu', 'Roberto Carlos', 'Rivaldo', 'Kaká',
  'Robinho', 'Adriano', 'Fred', 'Gilberto Silva', 'Maicon',
  'Lucio', 'Juan', 'Julio Cesar', 'Benzema', 'Gareth Bale',
  'Mesut Özil', 'Sami Khedira', 'Bastian Schweinsteiger', 'Arjen Robben', 'Franck Ribéry',
  'Philipp Lahm', 'Holger Badstuber', 'Jérôme Boateng', 'David Alaba', 'Neuer',
  'Buffon', 'Casillas', 'Cech', 'Van der Sar', 'Schmeichel'
];

const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const competitions = ['Champions League', 'World Cup', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'];

const hints = {
  Forward: [
    'Known for incredible goal-scoring ability and finishing.',
    'Has won multiple Golden Boot awards.',
    'Famous for their pace, dribbling, and attacking prowess.',
    'One of the most prolific strikers in football history.',
    'Known for their clinical finishing in the box.'
  ],
  Midfielder: [
    'Master of midfield control and passing accuracy.',
    'Known for their vision and ability to create chances.',
    'Dominates the center of the pitch with technical excellence.',
    'Famous for their work rate and defensive contributions.',
    'Known for their ability to control the tempo of the game.'
  ],
  Defender: [
    'One of the most reliable defenders in football history.',
    'Known for their defensive prowess and leadership.',
    'Famous for their strength, positioning, and tackling ability.',
    'Known for their consistency and reliability.',
    'Captained their team with defensive excellence.'
  ],
  Goalkeeper: [
    'Legendary shot-stopper with incredible reflexes.',
    'Known for their distribution and command of the penalty area.',
    'One of the greatest goalkeepers of all time.',
    'Famous for their consistency and shot-stopping ability.',
    'Known for their leadership and communication.'
  ]
};

const facts = {
  Forward: [
    'Has scored over 50 goals in international football.',
    'Won multiple Ballon d\'Or awards during their career.',
    'Known for their celebration style and charisma.',
    'Holds records for goals in major competitions.',
    'One of the most feared strikers in world football.'
  ],
  Midfielder: [
    'Won multiple UEFA Champions League titles.',
    'Known for their leadership and midfield control.',
    'Has represented their country in multiple World Cups.',
    'Famous for their passing accuracy and vision.',
    'Known for their ability to dictate the game.'
  ],
  Defender: [
    'Won multiple UEFA Champions League titles as a defender.',
    'Known for their consistency and reliability.',
    'Captained their national team to major tournaments.',
    'Famous for their defensive records and clean sheets.',
    'One of the most decorated defenders in football.'
  ],
  Goalkeeper: [
    'Won multiple UEFA Champions League titles.',
    'Known for their longevity and consistency.',
    'Holds records for clean sheets in major competitions.',
    'Famous for their shot-stopping ability.',
    'One of the greatest goalkeepers of their generation.'
  ]
};

export async function fetchPlayerData(playerName) {
  try {
    const response = await axios.get(API_BASE, {
      params: {
        action: 'get_players',
        player_name: playerName,
        APIkey: API_KEY
      }
    });

    if (response.data && response.data.length > 0) {
      const player = response.data[0];
      return {
        name: player.player_name || playerName,
        nationality: player.nationality || 'Unknown',
        position: player.position || 'Forward',
        imageUrl: player.player_image || `https://apiv3.apifootball.com/img/players/default.jpg`,
        playerId: player.player_id
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${playerName}:`, error.message);
    return null;
  }
}

export async function generatePlayersFromAPI() {
  console.log('🔄 Fetching player data from API Football...');
  const players = [];
  
  for (let i = 0; i < playerNames.length; i++) {
    const playerName = playerNames[i];
    const playerData = await fetchPlayerData(playerName);
    
    if (playerData) {
      const position = playerData.position || positions[i % positions.length];
      const difficulty = difficulties[i % difficulties.length];
      const playerHints = hints[position] || hints.Forward;
      const playerFacts = facts[position] || facts.Forward;
      
      players.push({
        name: playerData.name,
        nationality: playerData.nationality,
        position: position,
        imageUrl: playerData.imageUrl,
        hints: {
          hint1: playerHints[i % playerHints.length],
          hint2: playerHints[(i + 1) % playerHints.length],
          hint3: playerHints[(i + 2) % playerHints.length]
        },
        mcqOptions: [
          playerData.name,
          playerNames[(i + 1) % playerNames.length],
          playerNames[(i + 2) % playerNames.length],
          playerNames[(i + 3) % playerNames.length]
        ].sort(() => Math.random() - 0.5),
        funFact: playerFacts[i % playerFacts.length],
        difficulty: difficulty,
        competitions: competitions.slice(0, 3 + (i % 3))
      });
      
      console.log(`✅ ${i + 1}/150 - ${playerData.name}`);
    } else {
      console.log(`⚠️ ${i + 1}/150 - Failed to fetch ${playerName}`);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return players;
}
