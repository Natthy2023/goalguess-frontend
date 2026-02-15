import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';

export default function MultiplayerLobby({ user, navigate, darkMode }) {
  const [rooms, setRooms] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadRooms = async () => {
    try {
      const res = await axios.get('${API_BASE}/multiplayer/active-rooms', {
        timeout: 5000
      });
      setRooms(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading rooms:', error);
      setError('Failed to load rooms');
      setLoading(false);
    }
  };

  const createRoom = async () => {
    try {
      const res = await axios.post('${API_BASE}/multiplayer/create-room', 
        { difficulty, maxPlayers },
        { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 5000
        }
      );
      navigate(`/multiplayer/${res.data.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create room');
    }
  };

  const joinRoom = (roomId) => {
    navigate(`/multiplayer/${roomId}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          ⚽
        </motion.div>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${
      darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">🎮 Multiplayer Battles</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Create or join a room to battle with other players</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Create Room Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl backdrop-blur-xl border p-6 mb-8 ${
            darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/50 border-purple-200'
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Create New Room</h2>
            <motion.button
              whileHover={{ rotate: 180 }}
              onClick={() => setShowCreate(!showCreate)}
              className="text-2xl"
            >
              {showCreate ? '✕' : '+'}
            </motion.button>
          </div>

          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={`w-full p-3 rounded border transition-all ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                  }`}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Expert</option>
                </select>
              </div>

              <div>
                <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Max Players:</label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                  className={`w-full p-3 rounded border transition-all ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                  }`}
                >
                  <option value={2}>2 Players</option>
                  <option value={4}>4 Players</option>
                  <option value={8}>8 Players</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createRoom}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Create Room
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Available Rooms */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Rooms ({rooms.length})</h2>

          {rooms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-2xl backdrop-blur-xl border p-8 text-center ${
                darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/50 border-purple-200'
              }`}
            >
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No rooms available. Create one to get started!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room, idx) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => joinRoom(room.roomId)}
                  className={`rounded-2xl backdrop-blur-xl border p-6 cursor-pointer transition-all ${
                    darkMode
                      ? 'bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60'
                      : 'bg-white/50 border-purple-200 hover:border-purple-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Room {room.roomId}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {room.difficulty} • {room.players?.length || 0}/{room.maxPlayers} players
                      </p>
                    </div>
                    <span className="text-2xl">🎮</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {(room.players || []).slice(0, 3).map((player, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold"
                        >
                          {player.username?.[0] || '?'}
                        </div>
                      ))}
                      {(room.players?.length || 0) > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold">
                          +{(room.players?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-sm"
                    >
                      Join
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('home')}
          className={`mt-8 w-full py-3 rounded-lg font-bold border transition-all ${
            darkMode
              ? 'bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60'
              : 'bg-white/50 border-purple-200 hover:border-purple-400'
          }`}
        >
          Back to Home
        </motion.button>
      </div>
    </div>
  );
}
