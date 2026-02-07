import { db } from '../config/firebase.js';

const allPlayers = [
  // FORWARDS - WORLD CLASS
  { name: 'Cristiano Ronaldo', nationality: 'Portugal', position: 'Forward', difficulty: 'Easy', competitions: ['Champions League', 'World Cup', 'Euro'] },
  { name: 'Lionel Messi', nationality: 'Argentina', position: 'Forward', difficulty: 'Easy', competitions: ['World Cup', 'Copa América', 'Champions League'] },
  { name: 'Kylian Mbappé', nationality: 'France', position: 'Forward', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Erling Haaland', nationality: 'Norway', position: 'Forward', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'Bundesliga'] },
  { name: 'Vinícius Júnior', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Harry Kane', nationality: 'England', position: 'Forward', difficulty: 'Easy', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Robert Lewandowski', nationality: 'Poland', position: 'Forward', difficulty: 'Easy', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Mohamed Salah', nationality: 'Egypt', position: 'Forward', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'Africa Cup'] },
  { name: 'Neymar Jr', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy', competitions: ['Champions League', 'World Cup', 'Copa América'] },
  { name: 'Lautaro Martínez', nationality: 'Argentina', position: 'Forward', difficulty: 'Medium', competitions: ['Italy Serie A', 'Champions League', 'World Cup'] },
  
  // FORWARDS - ELITE
  { name: 'Raphinha', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Jude Bellingham', nationality: 'England', position: 'Midfielder', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Florian Wirtz', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Cole Palmer', nationality: 'England', position: 'Midfielder', difficulty: 'Easy', competitions: ['Premier League', 'World Cup'] },
  { name: 'Antoine Semenyo', nationality: 'Ghana', position: 'Forward', difficulty: 'Medium', competitions: ['Premier League', 'Africa Cup', 'Champions League'] },
  { name: 'Christian Pulisic', nationality: 'USA', position: 'Forward', difficulty: 'Easy', competitions: ['Italy Serie A', 'Champions League', 'World Cup'] },
  { name: 'Nico Paz', nationality: 'Argentina', position: 'Midfielder', difficulty: 'Hard', competitions: ['Italy Serie A', 'World Cup'] },
  { name: 'Michael Olise', nationality: 'France', position: 'Forward', difficulty: 'Medium', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Brahim Díaz', nationality: 'Morocco', position: 'Midfielder', difficulty: 'Medium', competitions: ['La Liga', 'Africa Cup', 'Champions League'] },
  { name: 'Viktor Gyökeres', nationality: 'Sweden', position: 'Forward', difficulty: 'Medium', competitions: ['Champions League', 'World Cup'] },
  
  // MIDFIELDERS - ELITE
  { name: 'Rodri', nationality: 'Spain', position: 'Midfielder', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Lamine Yamal', nationality: 'Spain', position: 'Forward', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Vinicius Jr', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Declan Rice', nationality: 'England', position: 'Midfielder', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Jamal Musiala', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Phil Foden', nationality: 'England', position: 'Midfielder', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Bukayo Saka', nationality: 'England', position: 'Forward', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Pedri', nationality: 'Spain', position: 'Midfielder', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Gavi', nationality: 'Spain', position: 'Midfielder', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Aurélien Tchouaméni', nationality: 'France', position: 'Midfielder', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  
  // DEFENDERS - ELITE
  { name: 'Rúben Dias', nationality: 'Portugal', position: 'Defender', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'Euro'] },
  { name: 'Virgil van Dijk', nationality: 'Netherlands', position: 'Defender', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Sergio Ramos', nationality: 'Spain', position: 'Defender', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Achraf Hakimi', nationality: 'Morocco', position: 'Defender', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'Africa Cup'] },
  { name: 'Alphonso Davies', nationality: 'Canada', position: 'Defender', difficulty: 'Medium', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Trent Alexander-Arnold', nationality: 'England', position: 'Defender', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Kyle Walker', nationality: 'England', position: 'Defender', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Lisandro Martínez', nationality: 'Argentina', position: 'Defender', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Eder Militão', nationality: 'Brazil', position: 'Defender', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Antonio Rüdiger', nationality: 'Germany', position: 'Defender', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  
  // GOALKEEPERS
  { name: 'Manuel Neuer', nationality: 'Germany', position: 'Goalkeeper', difficulty: 'Easy', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Gianluigi Donnarumma', nationality: 'Italy', position: 'Goalkeeper', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'Euro'] },
  { name: 'Ederson', nationality: 'Brazil', position: 'Goalkeeper', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Alisson', nationality: 'Brazil', position: 'Goalkeeper', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Jan Oblak', nationality: 'Slovenia', position: 'Goalkeeper', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  
  // LEGENDARY PLAYERS
  { name: 'Pelé', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy', competitions: ['World Cup'] },
  { name: 'Diego Maradona', nationality: 'Argentina', position: 'Midfielder', difficulty: 'Easy', competitions: ['World Cup', 'Copa América'] },
  { name: 'Johan Cruyff', nationality: 'Netherlands', position: 'Forward', difficulty: 'Hard', competitions: ['Champions League', 'World Cup'] },
  { name: 'Franz Beckenbauer', nationality: 'Germany', position: 'Defender', difficulty: 'Hard', competitions: ['Bundesliga', 'World Cup'] },
  { name: 'Zinedine Zidane', nationality: 'France', position: 'Midfielder', difficulty: 'Easy', competitions: ['Champions League', 'World Cup'] },
  
  // RECENT STARS
  { name: 'Vinicius Jr', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Rodrygo', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Jorginho', nationality: 'Italy', position: 'Midfielder', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'Euro'] },
  { name: 'Casemiro', nationality: 'Brazil', position: 'Midfielder', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Bruno Fernandes', nationality: 'Portugal', position: 'Midfielder', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'Euro'] },
  
  // PREMIER LEAGUE STARS
  { name: 'Sadio Mané', nationality: 'Senegal', position: 'Forward', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'Africa Cup'] },
  { name: 'Riyad Mahrez', nationality: 'Algeria', position: 'Forward', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'Africa Cup'] },
  { name: 'Son Heung-min', nationality: 'South Korea', position: 'Forward', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Richarlison', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Antony', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  
  // LA LIGA STARS
  { name: 'Karim Benzema', nationality: 'France', position: 'Forward', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Sergio Busquets', nationality: 'Spain', position: 'Midfielder', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Gerard Piqué', nationality: 'Spain', position: 'Defender', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Xavi Hernández', nationality: 'Spain', position: 'Midfielder', difficulty: 'Hard', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Andrés Iniesta', nationality: 'Spain', position: 'Midfielder', difficulty: 'Hard', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  
  // SERIE A STARS
  { name: 'Dušan Vlahović', nationality: 'Serbia', position: 'Forward', difficulty: 'Medium', competitions: ['Italy Serie A', 'Champions League', 'World Cup'] },
  { name: 'Nicolò Barella', nationality: 'Italy', position: 'Midfielder', difficulty: 'Medium', competitions: ['Italy Serie A', 'Champions League', 'Euro'] },
  { name: 'Alessandro Bastoni', nationality: 'Italy', position: 'Defender', difficulty: 'Medium', competitions: ['Italy Serie A', 'Champions League', 'Euro'] },
  { name: 'Lautaro Martínez', nationality: 'Argentina', position: 'Forward', difficulty: 'Medium', competitions: ['Italy Serie A', 'Champions League', 'World Cup'] },
  { name: 'Romelu Lukaku', nationality: 'Belgium', position: 'Forward', difficulty: 'Easy', competitions: ['Italy Serie A', 'Champions League', 'World Cup'] },
  
  // BUNDESLIGA STARS
  { name: 'Thomas Müller', nationality: 'Germany', position: 'Forward', difficulty: 'Easy', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Serge Gnabry', nationality: 'Germany', position: 'Forward', difficulty: 'Medium', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Kingsley Coman', nationality: 'France', position: 'Forward', difficulty: 'Medium', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Leroy Sané', nationality: 'Germany', position: 'Forward', difficulty: 'Medium', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Joshua Kimmich', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  
  // AFRICAN STARS
  { name: 'Victor Osimhen', nationality: 'Nigeria', position: 'Forward', difficulty: 'Medium', competitions: ['Italy Serie A', 'Africa Cup', 'Champions League'] },
  { name: 'Ademola Lookman', nationality: 'Nigeria', position: 'Forward', difficulty: 'Medium', competitions: ['La Liga', 'Serie A', 'Africa Cup'] },
  { name: 'Hakim Ziyech', nationality: 'Morocco', position: 'Midfielder', difficulty: 'Medium', competitions: ['Premier League', 'Champions League', 'Africa Cup'] },
  { name: 'Sadio Mané', nationality: 'Senegal', position: 'Forward', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'Africa Cup'] },
  { name: 'Mohamed Salah', nationality: 'Egypt', position: 'Forward', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'Africa Cup'] },
  
  // SOUTH AMERICAN STARS
  { name: 'Neymar Jr', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy', competitions: ['Champions League', 'World Cup', 'Copa América'] },
  { name: 'Vinícius Júnior', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Rodrygo', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Ángel Di María', nationality: 'Argentina', position: 'Forward', difficulty: 'Easy', competitions: ['Champions League', 'World Cup', 'Copa América'] },
  { name: 'Paulo Dybala', nationality: 'Argentina', position: 'Forward', difficulty: 'Medium', competitions: ['Italy Serie A', 'Champions League', 'World Cup'] },
  
  // ASIAN STARS
  { name: 'Son Heung-min', nationality: 'South Korea', position: 'Forward', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Hirving Lozano', nationality: 'Mexico', position: 'Forward', difficulty: 'Medium', competitions: ['Italy Serie A', 'Champions League', 'World Cup'] },
  { name: 'Takumi Minamino', nationality: 'Japan', position: 'Forward', difficulty: 'Hard', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  
  // EUROPEAN STARS
  { name: 'Arjen Robben', nationality: 'Netherlands', position: 'Forward', difficulty: 'Easy', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Franck Ribéry', nationality: 'France', position: 'Forward', difficulty: 'Easy', competitions: ['Bundesliga', 'Champions League', 'World Cup'] },
  { name: 'Mesut Özil', nationality: 'Germany', position: 'Midfielder', difficulty: 'Easy', competitions: ['Premier League', 'Champions League', 'World Cup'] },
  { name: 'Gareth Bale', nationality: 'Wales', position: 'Forward', difficulty: 'Easy', competitions: ['La Liga', 'Champions League', 'World Cup'] },
  { name: 'Cristiano Ronaldo', nationality: 'Portugal', position: 'Forward', difficulty: 'Easy', competitions: ['Champions League', 'World Cup', 'Euro'] }
];

async function seedAllPlayers() {
  try {
    console.log('🌱 Starting comprehensive player seeding...');
    console.log(`📡 Seeding ${allPlayers.length} players...`);

    // Clear existing players
    const snapshot = await db.collection('players').get();
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
    }
    console.log('🗑️ Cleared existing players');

    // Add all players
    for (let i = 0; i < allPlayers.length; i++) {
      const playerData = allPlayers[i];
      
      const player = {
        name: playerData.name,
        nationality: playerData.nationality,
        position: playerData.position,
        imageUrl: `https://via.placeholder.com/300x400?text=${playerData.name}`,
        hints: {
          hint1: `${playerData.position} from ${playerData.nationality}`,
          hint2: `Played in ${playerData.competitions[0]}`,
          hint3: `Known for exceptional skills in ${playerData.position.toLowerCase()}`
        },
        mcqOptions: [
          playerData.name,
          allPlayers[(i + 1) % allPlayers.length].name,
          allPlayers[(i + 2) % allPlayers.length].name,
          allPlayers[(i + 3) % allPlayers.length].name
        ].sort(() => Math.random() - 0.5),
        funFact: `${playerData.name} is a legendary ${playerData.position.toLowerCase()} from ${playerData.nationality}`,
        difficulty: playerData.difficulty,
        competitions: playerData.competitions,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('players').add(player);
      console.log(`✅ [${i + 1}/${allPlayers.length}] ${playerData.name}`);
    }

    console.log(`\n✅ Successfully seeded ${allPlayers.length} players!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedAllPlayers();
