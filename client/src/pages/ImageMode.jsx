import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';

export default function ImageMode({ user, darkMode }) {
  const [player, setPlayer] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    loadPlayer();
  }, []);

  const loadPlayer = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/players/image-mode/random`, {
        timeout: 5000
      });
      
      if (!res.data) {
        throw new Error('No player data received');
      }

      console.log('Player data:', res.data);
      console.log('Image URL:', res.data.imageUrl);

      setPlayer(res.data);
      
      // Shuffle options
      const shuffled = [...(res.data.mcqOptions || [])].sort(() => Math.random() - 0.5);
      setOptions(shuffled);
      setSelected(null);
      setFeedback('');
    } catch (error) {
      console.error('Error loading player:', error);
      setError('Failed to load player. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (option) => {
    if (gameOver) return;
    
    setSelected(option);
    const isCorrect = option === player.name;

    if (isCorrect) {
      setFeedback('✅ Correct! +2 points');
      setScore(score + 2);
      // DO NOT reset wrong answers - they accumulate

      if (user) {
        try {
          await axios.post(`${API_BASE}/game/submit-answer`, {
            userId: user.id,
            playerId: player.id,
            isCorrect: true,
            pointsEarned: 2
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (err) {
          console.error('Error saving score:', err);
        }
      }

      setTimeout(() => loadPlayer(), 2000);
    } else {
      const newWrongAnswers = wrongAnswers + 1;
      setWrongAnswers(newWrongAnswers);

      // Check if 3 wrong answers reached - GAME OVER
      if (newWrongAnswers >= 3) {
        setFeedback(`❌ Game Over! 3 wrong answers. It was ${player.name}`);
        setGameOver(true);
        // Don't auto-load next player - show results screen
      } else {
        setFeedback(`❌ Wrong! (${newWrongAnswers}/3) It was ${player.name}`);
        setTimeout(() => loadPlayer(), 2000);
      }
    }
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
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading player...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900'
      }`}>
        <div className={`p-8 rounded-lg backdrop-blur-xl border ${
          darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/50 border-purple-200'
        }`}>
          <p className="text-lg mb-4">{error || 'Failed to load player'}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={loadPlayer}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameOver) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl backdrop-blur-xl border p-8 max-w-md w-full text-center ${
            darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/50 border-purple-200'
          }`}
        >
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">🖼️ Game Over!</h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Final Score</p>
              <p className="text-3xl font-bold text-green-400">{score}</p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Questions</p>
              <p className="text-3xl font-bold text-blue-400">{questionsAnswered}</p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wrong Answers</p>
              <p className="text-3xl font-bold text-red-400">{wrongAnswers}/3</p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</p>
              <p className="text-3xl font-bold text-purple-400">
                {questionsAnswered > 0 ? Math.round(((questionsAnswered - wrongAnswers) / questionsAnswered) * 100) : 0}%
              </p>
            </div>
          </div>

          <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            You reached 3 wrong answers. Better luck next time! 🎯
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setGameOver(false);
              setWrongAnswers(0);
              setScore(0);
              setQuestionsAnswered(0);
              setSelected(null);
              setFeedback('');
              loadPlayer();
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Play Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
      darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl backdrop-blur-xl border p-8 max-w-md w-full ${
          darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/50 border-purple-200'
        }`}
      >
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">🖼️ Image Mode</h1>
        <div className="flex justify-between items-center mb-6">
          <p className="text-lg font-semibold">Score: {score}</p>
          <p className={`text-lg font-semibold ${wrongAnswers >= 3 ? 'text-red-500' : wrongAnswers >= 2 ? 'text-orange-400' : 'text-purple-400'}`}>
            Wrong: {wrongAnswers}/3
          </p>
        </div>

        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={player.imageUrl || 'https://via.placeholder.com/300x400?text=Player+Image'}
          alt="Player"
          className="w-full h-64 object-contain rounded-lg mb-6 bg-gradient-to-br from-slate-700 to-slate-800 p-4"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Player+Image';
          }}
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          {options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={`p-3 rounded-lg font-bold transition-all ${
                selected === option
                  ? option === player.name
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
              } disabled:opacity-50`}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-lg font-bold mb-2"
          >
            {feedback}
          </motion.p>
        )}

        {selected && (
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            💡 Fun Fact: {player.funFact}
          </p>
        )}
      </motion.div>
    </div>
  );
}
