import axios from 'axios';
import { API_BASE } from '../config/api'; // import the backend URL

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const api = {
  // Auth
  register: (username, email, password) =>
    axios.post(`${API_BASE}/auth/register`, { username, email, password }),
  login: (email, password) =>
    axios.post(`${API_BASE}/auth/login`, { email, password }),

  // Players
  getPlayers: (difficulty, competition) =>
    axios.get(`${API_BASE}/players`, { params: { difficulty, competition } }),
  getRandomPlayer: (difficulty, competition) =>
    axios.get(`${API_BASE}/players/random`, { params: { difficulty, competition } }),

  // Game
  submitAnswer: (userId, playerId, isCorrect, pointsEarned, hintLevel) =>
    axios.post(`${API_BASE}/game/submit-answer`, 
      { userId, playerId, isCorrect, pointsEarned, hintLevel },
      { headers: getAuthHeader() }
    ),

  // Leaderboard
  getLeaderboard: () =>
    axios.get(`${API_BASE}/leaderboard`),
  getUserRank: (userId) =>
    axios.get(`${API_BASE}/leaderboard/${userId}`),

  // Stats
  getUserStats: (userId) =>
    axios.get(`${API_BASE}/stats/user/${userId}`, { headers: getAuthHeader() }),

  // Multiplayer
  createRoom: (difficulty, maxPlayers) =>
    axios.post(`${API_BASE}/multiplayer/create-room`, 
      { difficulty, maxPlayers },
      { headers: getAuthHeader() }
    ),
  getRoom: (roomId) =>
    axios.get(`${API_BASE}/multiplayer/room/${roomId}`),
  getActiveRooms: () =>
    axios.get(`${API_BASE}/multiplayer/active-rooms`)
};
