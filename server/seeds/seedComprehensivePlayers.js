import { db } from '../config/firebase.js';

// Generate unique hints based on player data
function generateHints(playerData) {
  const positionDescriptions = {
    'Forward': ['striker', 'goal scorer', 'attacker', 'finisher'],
    'Midfielder': ['playmaker', 'ball distributor', 'engine', 'controller'],
    'Defender': ['defender', 'protector', 'backline', 'shield'],
    'Goalkeeper': ['keeper', 'shot-stopper', 'guardian', 'last line']
  };

  const positionDesc = positionDescriptions[playerData.position] || [playerData.position];
  
  const hints = {
    hint1: `This ${positionDesc[0]} is from ${playerData.nationality}`,
    hint2: `Known for playing as a ${positionDesc[1]} in the ${playerData.position} role`,
    hint3: `A ${playerData.nationality} international who plays in the ${positionDesc[2]} position`,
    hint4: `This elite ${positionDesc[3]} from ${playerData.nationality} is a world-class talent`
  };
  return hints;
}

const comprehensivePlayers = [
  // WORLD CLASS FORWARDS
  { name: 'Cristiano Ronaldo', nationality: 'Portugal', position: 'Forward', difficulty: 'Easy' },
  { name: 'Lionel Messi', nationality: 'Argentina', position: 'Forward', difficulty: 'Easy' },
  { name: 'Kylian Mbappé', nationality: 'France', position: 'Forward', difficulty: 'Easy' },
  { name: 'Erling Haaland', nationality: 'Norway', position: 'Forward', difficulty: 'Easy' },
  { name: 'Vinícius Júnior', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy' },
  { name: 'Harry Kane', nationality: 'England', position: 'Forward', difficulty: 'Easy' },
  { name: 'Robert Lewandowski', nationality: 'Poland', position: 'Forward', difficulty: 'Easy' },
  { name: 'Mohamed Salah', nationality: 'Egypt', position: 'Forward', difficulty: 'Easy' },
  { name: 'Neymar Jr', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy' },
  { name: 'Lautaro Martínez', nationality: 'Argentina', position: 'Forward', difficulty: 'Medium' },
  
  // ELITE FORWARDS
  { name: 'Raphinha', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium' },
  { name: 'Antoine Semenyo', nationality: 'Ghana', position: 'Forward', difficulty: 'Medium' },
  { name: 'Christian Pulisic', nationality: 'USA', position: 'Forward', difficulty: 'Easy' },
  { name: 'Michael Olise', nationality: 'France', position: 'Forward', difficulty: 'Medium' },
  { name: 'Viktor Gyökeres', nationality: 'Sweden', position: 'Forward', difficulty: 'Medium' },
  { name: 'Lamine Yamal', nationality: 'Spain', position: 'Forward', difficulty: 'Easy' },
  { name: 'Rodrygo', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium' },
  { name: 'Richarlison', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium' },
  { name: 'Antony', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium' },
  { name: 'Bukayo Saka', nationality: 'England', position: 'Forward', difficulty: 'Easy' },
  
  // MIDFIELDERS - ELITE
  { name: 'Rodri', nationality: 'Spain', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Jude Bellingham', nationality: 'England', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Florian Wirtz', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Cole Palmer', nationality: 'England', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Phil Foden', nationality: 'England', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Declan Rice', nationality: 'England', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Jamal Musiala', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Pedri', nationality: 'Spain', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Gavi', nationality: 'Spain', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Aurélien Tchouaméni', nationality: 'France', position: 'Midfielder', difficulty: 'Medium' },
  
  // MIDFIELDERS - EXPERIENCED
  { name: 'Bruno Fernandes', nationality: 'Portugal', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Sergio Busquets', nationality: 'Spain', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Casemiro', nationality: 'Brazil', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Jorginho', nationality: 'Italy', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Mesut Özil', nationality: 'Germany', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Isco', nationality: 'Spain', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Riyad Mahrez', nationality: 'Algeria', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Leroy Sané', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Joshua Kimmich', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Nicolò Barella', nationality: 'Italy', position: 'Midfielder', difficulty: 'Medium' },
  
  // DEFENDERS - ELITE
  { name: 'Rúben Dias', nationality: 'Portugal', position: 'Defender', difficulty: 'Medium' },
  { name: 'Virgil van Dijk', nationality: 'Netherlands', position: 'Defender', difficulty: 'Easy' },
  { name: 'Sergio Ramos', nationality: 'Spain', position: 'Defender', difficulty: 'Easy' },
  { name: 'Achraf Hakimi', nationality: 'Morocco', position: 'Defender', difficulty: 'Medium' },
  { name: 'Alphonso Davies', nationality: 'Canada', position: 'Defender', difficulty: 'Medium' },
  { name: 'Trent Alexander-Arnold', nationality: 'England', position: 'Defender', difficulty: 'Easy' },
  { name: 'Kyle Walker', nationality: 'England', position: 'Defender', difficulty: 'Easy' },
  { name: 'Lisandro Martínez', nationality: 'Argentina', position: 'Defender', difficulty: 'Medium' },
  { name: 'Eder Militão', nationality: 'Brazil', position: 'Defender', difficulty: 'Medium' },
  { name: 'Antonio Rüdiger', nationality: 'Germany', position: 'Defender', difficulty: 'Medium' },
  
  // DEFENDERS - EXPERIENCED
  { name: 'Gerard Piqué', nationality: 'Spain', position: 'Defender', difficulty: 'Easy' },
  { name: 'Jordi Alba', nationality: 'Spain', position: 'Defender', difficulty: 'Medium' },
  { name: 'Nacho Fernández', nationality: 'Spain', position: 'Defender', difficulty: 'Medium' },
  { name: 'Pepe', nationality: 'Portugal', position: 'Defender', difficulty: 'Medium' },
  { name: 'Thiago Silva', nationality: 'Brazil', position: 'Defender', difficulty: 'Easy' },
  { name: 'David Alaba', nationality: 'Austria', position: 'Defender', difficulty: 'Medium' },
  { name: 'Dayot Upamecano', nationality: 'France', position: 'Defender', difficulty: 'Medium' },
  { name: 'Alessandro Bastoni', nationality: 'Italy', position: 'Defender', difficulty: 'Medium' },
  { name: 'Juan Cuadrado', nationality: 'Colombia', position: 'Defender', difficulty: 'Medium' },
  { name: 'Reece James', nationality: 'England', position: 'Defender', difficulty: 'Medium' },
  
  // GOALKEEPERS
  { name: 'Manuel Neuer', nationality: 'Germany', position: 'Goalkeeper', difficulty: 'Easy' },
  { name: 'Gianluigi Donnarumma', nationality: 'Italy', position: 'Goalkeeper', difficulty: 'Medium' },
  { name: 'Ederson', nationality: 'Brazil', position: 'Goalkeeper', difficulty: 'Medium' },
  { name: 'Alisson', nationality: 'Brazil', position: 'Goalkeeper', difficulty: 'Easy' },
  { name: 'Jan Oblak', nationality: 'Slovenia', position: 'Goalkeeper', difficulty: 'Medium' },
  { name: 'Thibaut Courtois', nationality: 'Belgium', position: 'Goalkeeper', difficulty: 'Medium' },
  { name: 'Mike Maignan', nationality: 'France', position: 'Goalkeeper', difficulty: 'Medium' },
  { name: 'André Onana', nationality: 'Cameroon', position: 'Goalkeeper', difficulty: 'Medium' },
  
  // LEGENDARY PLAYERS
  { name: 'Pelé', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy' },
  { name: 'Diego Maradona', nationality: 'Argentina', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Johan Cruyff', nationality: 'Netherlands', position: 'Forward', difficulty: 'Hard' },
  { name: 'Franz Beckenbauer', nationality: 'Germany', position: 'Defender', difficulty: 'Hard' },
  { name: 'Zinedine Zidane', nationality: 'France', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Ronaldo Nazário', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy' },
  { name: 'Ronaldinho', nationality: 'Brazil', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Pele', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy' },
  { name: 'Gerd Müller', nationality: 'Germany', position: 'Forward', difficulty: 'Hard' },
  { name: 'Bobby Charlton', nationality: 'England', position: 'Midfielder', difficulty: 'Hard' },
  
  // RECENT LEGENDS
  { name: 'Wayne Rooney', nationality: 'England', position: 'Forward', difficulty: 'Easy' },
  { name: 'Thierry Henry', nationality: 'France', position: 'Forward', difficulty: 'Easy' },
  { name: 'Ángel Di María', nationality: 'Argentina', position: 'Forward', difficulty: 'Easy' },
  { name: 'Arjen Robben', nationality: 'Netherlands', position: 'Forward', difficulty: 'Easy' },
  { name: 'Franck Ribéry', nationality: 'France', position: 'Forward', difficulty: 'Easy' },
  { name: 'Karim Benzema', nationality: 'France', position: 'Forward', difficulty: 'Easy' },
  { name: 'Xavi Hernández', nationality: 'Spain', position: 'Midfielder', difficulty: 'Hard' },
  { name: 'Andrés Iniesta', nationality: 'Spain', position: 'Midfielder', difficulty: 'Hard' },
  { name: 'Iker Casillas', nationality: 'Spain', position: 'Goalkeeper', difficulty: 'Easy' },
  { name: 'Gianluigi Buffon', nationality: 'Italy', position: 'Goalkeeper', difficulty: 'Easy' },
  
  // PREMIER LEAGUE STARS
  { name: 'Son Heung-min', nationality: 'South Korea', position: 'Forward', difficulty: 'Easy' },
  { name: 'Sadio Mané', nationality: 'Senegal', position: 'Forward', difficulty: 'Easy' },
  { name: 'Romelu Lukaku', nationality: 'Belgium', position: 'Forward', difficulty: 'Easy' },
  { name: 'Sergio Agüero', nationality: 'Argentina', position: 'Forward', difficulty: 'Easy' },
  { name: 'Eden Hazard', nationality: 'Belgium', position: 'Forward', difficulty: 'Easy' },
  { name: 'Raheem Sterling', nationality: 'England', position: 'Forward', difficulty: 'Medium' },
  { name: 'Sadio Mané', nationality: 'Senegal', position: 'Forward', difficulty: 'Easy' },
  { name: 'Wilfried Zaha', nationality: 'Ivory Coast', position: 'Forward', difficulty: 'Medium' },
  { name: 'Conor Gallagher', nationality: 'England', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Maddison', nationality: 'England', position: 'Midfielder', difficulty: 'Medium' },
  
  // LA LIGA STARS
  { name: 'Luis Suárez', nationality: 'Uruguay', position: 'Forward', difficulty: 'Easy' },
  { name: 'Gareth Bale', nationality: 'Wales', position: 'Forward', difficulty: 'Easy' },
  { name: 'Cristiano Ronaldo', nationality: 'Portugal', position: 'Forward', difficulty: 'Easy' },
  { name: 'Ángel Di María', nationality: 'Argentina', position: 'Forward', difficulty: 'Easy' },
  { name: 'Ferran Torres', nationality: 'Spain', position: 'Forward', difficulty: 'Medium' },
  { name: 'Ousmane Dembélé', nationality: 'France', position: 'Forward', difficulty: 'Medium' },
  { name: 'Ansu Fati', nationality: 'Spain', position: 'Forward', difficulty: 'Medium' },
  { name: 'Vinícius Júnior', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy' },
  { name: 'Jude Bellingham', nationality: 'England', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Aurélien Tchouaméni', nationality: 'France', position: 'Midfielder', difficulty: 'Medium' },
  
  // SERIE A STARS
  { name: 'Dušan Vlahović', nationality: 'Serbia', position: 'Forward', difficulty: 'Medium' },
  { name: 'Paulo Dybala', nationality: 'Argentina', position: 'Forward', difficulty: 'Medium' },
  { name: 'Ciro Immobile', nationality: 'Italy', position: 'Forward', difficulty: 'Medium' },
  { name: 'Lautaro Martínez', nationality: 'Argentina', position: 'Forward', difficulty: 'Medium' },
  { name: 'Romelu Lukaku', nationality: 'Belgium', position: 'Forward', difficulty: 'Easy' },
  { name: 'Nicolò Barella', nationality: 'Italy', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Sergej Milinković-Savić', nationality: 'Serbia', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Atalanta', nationality: 'Italy', position: 'Forward', difficulty: 'Medium' },
  { name: 'Matteo Politano', nationality: 'Italy', position: 'Forward', difficulty: 'Medium' },
  { name: 'Hirving Lozano', nationality: 'Mexico', position: 'Forward', difficulty: 'Medium' },
  
  // BUNDESLIGA STARS
  { name: 'Thomas Müller', nationality: 'Germany', position: 'Forward', difficulty: 'Easy' },
  { name: 'Serge Gnabry', nationality: 'Germany', position: 'Forward', difficulty: 'Medium' },
  { name: 'Kingsley Coman', nationality: 'France', position: 'Forward', difficulty: 'Medium' },
  { name: 'Jamal Musiala', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Florian Wirtz', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Kai Havertz', nationality: 'Germany', position: 'Forward', difficulty: 'Medium' },
  { name: 'Leroy Sané', nationality: 'Germany', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Dayot Upamecano', nationality: 'France', position: 'Defender', difficulty: 'Medium' },
  { name: 'Alphonso Davies', nationality: 'Canada', position: 'Defender', difficulty: 'Medium' },
  { name: 'Serge Gnabry', nationality: 'Germany', position: 'Forward', difficulty: 'Medium' },
  
  // AFRICAN STARS
  { name: 'Victor Osimhen', nationality: 'Nigeria', position: 'Forward', difficulty: 'Medium' },
  { name: 'Ademola Lookman', nationality: 'Nigeria', position: 'Forward', difficulty: 'Medium' },
  { name: 'Hakim Ziyech', nationality: 'Morocco', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Achraf Hakimi', nationality: 'Morocco', position: 'Defender', difficulty: 'Medium' },
  { name: 'Riyad Mahrez', nationality: 'Algeria', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Mohamed Salah', nationality: 'Egypt', position: 'Forward', difficulty: 'Easy' },
  { name: 'Sadio Mané', nationality: 'Senegal', position: 'Forward', difficulty: 'Easy' },
  { name: 'Wilfried Zaha', nationality: 'Ivory Coast', position: 'Forward', difficulty: 'Medium' },
  { name: 'Idrissa Gueye', nationality: 'Senegal', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Edouard Mendy', nationality: 'Senegal', position: 'Goalkeeper', difficulty: 'Medium' },
  
  // SOUTH AMERICAN STARS
  { name: 'Neymar Jr', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy' },
  { name: 'Vinícius Júnior', nationality: 'Brazil', position: 'Forward', difficulty: 'Easy' },
  { name: 'Rodrygo', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium' },
  { name: 'Richarlison', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium' },
  { name: 'Antony', nationality: 'Brazil', position: 'Forward', difficulty: 'Medium' },
  { name: 'Ángel Di María', nationality: 'Argentina', position: 'Forward', difficulty: 'Easy' },
  { name: 'Paulo Dybala', nationality: 'Argentina', position: 'Forward', difficulty: 'Medium' },
  { name: 'Lautaro Martínez', nationality: 'Argentina', position: 'Forward', difficulty: 'Medium' },
  { name: 'Alexis Sánchez', nationality: 'Chile', position: 'Forward', difficulty: 'Medium' },
  { name: 'Luis Suárez', nationality: 'Uruguay', position: 'Forward', difficulty: 'Easy' },
  
  // ASIAN STARS
  { name: 'Son Heung-min', nationality: 'South Korea', position: 'Forward', difficulty: 'Easy' },
  { name: 'Hirving Lozano', nationality: 'Mexico', position: 'Forward', difficulty: 'Medium' },
  { name: 'Takumi Minamino', nationality: 'Japan', position: 'Forward', difficulty: 'Hard' },
  { name: 'Romain Saïss', nationality: 'Morocco', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Nacho Fernández', nationality: 'Spain', position: 'Defender', difficulty: 'Medium' },
  
  // ADDITIONAL STARS
  { name: 'Sadio Mané', nationality: 'Senegal', position: 'Forward', difficulty: 'Easy' },
  { name: 'Riyad Mahrez', nationality: 'Algeria', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Hakim Ziyech', nationality: 'Morocco', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Achraf Hakimi', nationality: 'Morocco', position: 'Defender', difficulty: 'Medium' },
  { name: 'Wilfried Zaha', nationality: 'Ivory Coast', position: 'Forward', difficulty: 'Medium' },
  { name: 'Idrissa Gueye', nationality: 'Senegal', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Edouard Mendy', nationality: 'Senegal', position: 'Goalkeeper', difficulty: 'Medium' },
  { name: 'Sadio Mané', nationality: 'Senegal', position: 'Forward', difficulty: 'Easy' },
  { name: 'Riyad Mahrez', nationality: 'Algeria', position: 'Midfielder', difficulty: 'Medium' },
  { name: 'Hakim Ziyech', nationality: 'Morocco', position: 'Midfielder', difficulty: 'Medium' },
  
  // EUROPEAN STARS
  { name: 'Arjen Robben', nationality: 'Netherlands', position: 'Forward', difficulty: 'Easy' },
  { name: 'Franck Ribéry', nationality: 'France', position: 'Forward', difficulty: 'Easy' },
  { name: 'Mesut Özil', nationality: 'Germany', position: 'Midfielder', difficulty: 'Easy' },
  { name: 'Gareth Bale', nationality: 'Wales', position: 'Forward', difficulty: 'Easy' },
  { name: 'Cristiano Ronaldo', nationality: 'Portugal', position: 'Forward', difficulty: 'Easy' },
  { name: 'Sergio Ramos', nationality: 'Spain', position: 'Defender', difficulty: 'Easy' },
  { name: 'Virgil van Dijk', nationality: 'Netherlands', position: 'Defender', difficulty: 'Easy' },
  { name: 'Rúben Dias', nationality: 'Portugal', position: 'Defender', difficulty: 'Medium' },
  { name: 'Alphonso Davies', nationality: 'Canada', position: 'Defender', difficulty: 'Medium' },
  { name: 'Trent Alexander-Arnold', nationality: 'England', position: 'Defender', difficulty: 'Easy' }
];

async function seedComprehensivePlayers() {
  try {
    console.log('🌱 Starting comprehensive player seeding...');
    console.log(`📡 Seeding ${comprehensivePlayers.length} players...`);

    // Clear existing players
    const snapshot = await db.collection('players').get();
    console.log(`🗑️ Clearing ${snapshot.docs.length} existing players...`);
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
    }

    // Add all players
    let successCount = 0;
    for (let i = 0; i < comprehensivePlayers.length; i++) {
      const playerData = comprehensivePlayers[i];
      
      const player = {
        name: playerData.name,
        nationality: playerData.nationality,
        position: playerData.position,
        imageUrl: `https://via.placeholder.com/300x400?text=${playerData.name}`,
        hints: generateHints(playerData),
        mcqOptions: [
          playerData.name,
          comprehensivePlayers[(i + 1) % comprehensivePlayers.length].name,
          comprehensivePlayers[(i + 2) % comprehensivePlayers.length].name,
          comprehensivePlayers[(i + 3) % comprehensivePlayers.length].name
        ].sort(() => Math.random() - 0.5),
        funFact: `${playerData.name} is a legendary ${playerData.position.toLowerCase()} from ${playerData.nationality}`,
        difficulty: playerData.difficulty,
        competitions: ['Champions League', 'World Cup', 'Premier League'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('players').add(player);
      successCount++;
      
      if ((i + 1) % 20 === 0) {
        console.log(`✅ [${i + 1}/${comprehensivePlayers.length}] Players seeded...`);
      }
    }

    console.log(`\n✅ Successfully seeded ${successCount} players to Firestore!`);
    console.log(`📊 Total players in database: ${successCount}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedComprehensivePlayers();
