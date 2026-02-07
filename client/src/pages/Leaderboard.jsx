import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Leaderboard({ navigate }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await axios.get('/api/leaderboard');
      setLeaderboard(res.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">🏆 Leaderboard</h1>

        <div className="space-y-2">
          {leaderboard.map((user, idx) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex justify-between items-center bg-gray-800 p-4 rounded"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-yellow-400">#{idx + 1}</span>
                <div>
                  <p className="font-bold">{user.username}</p>
                  <p className="text-sm text-gray-400">
                    {user.correctAnswers}/{user.totalAttempts} correct
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">{user.score}</p>
                <p className="text-sm text-gray-400">Streak: {user.streak}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
