import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function UserStats({ user, navigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const res = await axios.get(`/api/stats/user/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (!stats) return <div className="text-white text-center mt-20">No stats available</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">📊 Your Stats</h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg mb-6"
        >
          <p className="text-gray-200">Username</p>
          <p className="text-3xl font-bold">{stats.user.username}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 p-4 rounded"
          >
            <p className="text-gray-400">Total Score</p>
            <p className="text-3xl font-bold text-green-400">{stats.user.score}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 p-4 rounded"
          >
            <p className="text-gray-400">Best Score</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.user.bestScore}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-4 rounded"
          >
            <p className="text-gray-400">Accuracy</p>
            <p className="text-3xl font-bold text-blue-400">{stats.user.accuracy}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-4 rounded"
          >
            <p className="text-gray-400">Current Streak</p>
            <p className="text-3xl font-bold text-red-400">{stats.user.streak}</p>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Game Mode Stats</h2>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-900 p-4 rounded"
          >
            <h3 className="font-bold mb-2">💡 Hint Mode</h3>
            <p className="text-sm">Played: {stats.hintMode.played}</p>
            <p className="text-sm">Correct: {stats.hintMode.correct}</p>
            <p className="text-sm">Avg Points: {stats.hintMode.avgPoints}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-900 p-4 rounded"
          >
            <h3 className="font-bold mb-2">🖼️ Image Mode</h3>
            <p className="text-sm">Played: {stats.imageMode.played}</p>
            <p className="text-sm">Correct: {stats.imageMode.correct}</p>
            <p className="text-sm">Accuracy: {stats.imageMode.accuracy}%</p>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
          className="w-full mt-6 bg-purple-600 p-3 rounded font-bold hover:bg-purple-700"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
