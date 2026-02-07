import express from 'express';
import axios from 'axios';

const router = express.Router();

const LEAGUES = {
  'Premier League': 'English Premier League',
  'Champions League': 'UEFA Champions League',
  'La Liga': 'Spanish La Liga',
  'Serie A': 'Italian Serie A',
  'Bundesliga': 'German Bundesliga',
  'Ligue 1': 'French Ligue 1',
  'World Cup': 'FIFA World Cup',
  'African Cup': 'African Cup of Nations'
};

// Cache for teams to avoid excessive API calls
const teamCache = {};

async function fetchTeamsFromAPI(leagueName) {
  if (teamCache[leagueName]) {
    return teamCache[leagueName];
  }

  try {
    // Try to fetch teams from TheSportsDB
    const teamsResponse = await axios.get(
      `https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=${encodeURIComponent(leagueName)}`,
      { timeout: 5000 }
    );

    if (teamsResponse.data && teamsResponse.data.teams) {
      const teams = teamsResponse.data.teams
        .filter(team => team.strEquipment && team.strTeam)
        .slice(0, 20);
      
      teamCache[leagueName] = teams;
      return teams;
    }
  } catch (error) {
    console.error(`Error fetching teams for ${leagueName}:`, error.message);
  }

  return [];
}

// Get random teams for jersey game
router.get('/random-teams', async (req, res) => {
  try {
    const leagues = Object.values(LEAGUES);
    const randomLeague = leagues[Math.floor(Math.random() * leagues.length)];
    
    const teams = await fetchTeamsFromAPI(randomLeague);
    
    if (teams.length < 4) {
      return res.status(404).json({ error: 'Not enough teams available' });
    }

    // Shuffle and get 4 random teams
    const shuffled = teams.sort(() => Math.random() - 0.5);
    const selectedTeams = shuffled.slice(0, 4);
    const correctTeam = selectedTeams[0];

    res.json({
      correctTeam: {
        name: correctTeam.strTeam,
        jersey: correctTeam.strEquipment,
        league: randomLeague
      },
      options: selectedTeams.map(team => team.strTeam)
    });
  } catch (error) {
    console.error('Error in random-teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

export default router;
