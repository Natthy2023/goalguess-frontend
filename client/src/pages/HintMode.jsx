import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';

export default function HintMode({ user, darkMode }) {
  const [player, setPlayer] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    loadPlayer();
  }, [difficulty]);

  const loadPlayer = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/players/random?difficulty=${difficulty}`, {
        timeout: 5000
      });
      
      if (!res.data) throw new Error('No player data');

      setPlayer(res.data);
      setHintLevel(0);
      setGuess('');
      setFeedback('');
    } catch (error) {
      console.error('Error loading player:', error);
      setError('Failed to load player');
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = async () => {
    if (!guess.trim() || !player || gameOver) return;

    const isCorrect = guess.toLowerCase().trim() === player.name.toLowerCase().trim();

    if (isCorrect) {
      const points = hintLevel === 0 ? 3 : hintLevel === 1 ? 2 : 1;
      setScore(score + points);
      setFeedback(`✅ Correct! +${points} points`);
      setQuestionsAnswered(questionsAnswered + 1);
      // DO NOT reset wrong answers - they accumulate across questions

      if (user) {
        try {
          await axios.post('/api/game/submit-answer', {
            userId: user.id,
            playerId: player.id,
            isCorrect: true,
            pointsEarned: points,
            hintLevel
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (err) {
          console.error('Error saving score:', err);
        }
      }

      // Keep image visible for 2 seconds, then load next player
      setTimeout(() => {
        loadPlayer();
      }, 2000);
    } else {
      const newWrongAnswers = wrongAnswers + 1;
      setWrongAnswers(newWrongAnswers);

      // Check if 3 wrong answers reached - GAME OVER
      if (newWrongAnswers >= 3) {
        setFeedback(`❌ Game Over! 3 wrong answers. It was ${player.name}`);
        setGameOver(true);
        setQuestionsAnswered(questionsAnswered + 1);
        // Don't auto-load next player - show results screen
      } else {
        const maxHints = getMaxHints();
        if (hintLevel < maxHints - 1) {
          setHintLevel(hintLevel + 1);
          setFeedback(`❌ Wrong! (${newWrongAnswers}/3) Next hint coming...`);
        } else {
          setFeedback(`❌ Wrong! (${newWrongAnswers}/3) It was ${player.name}`);
          setQuestionsAnswered(questionsAnswered + 1);
          setTimeout(() => {
            loadPlayer();
          }, 2000);
        }
      }
    }
    setGuess('');
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
          <p className="text-lg mb-4">{error}</p>
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

  const getMaxHints = () => {
    if (difficulty === 'Expert') return 4;
    return 3;
  };

  const hints = [player.hints?.hint1, player.hints?.hint2, player.hints?.hint3, player.hints?.hint4];

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
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">💡 Game Over!</h1>

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
              setHintLevel(0);
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
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">💡 Hint Mode</h1>
        
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className={`p-3 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score</p>
            <p className="text-2xl font-bold text-green-400">{score}</p>
          </div>
          <div className={`p-3 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hint</p>
            <p className="text-2xl font-bold text-blue-400">{hintLevel + 1}/{getMaxHints()}</p>
          </div>
          <div className={`p-3 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wrong</p>
            <p className={`text-2xl font-bold ${wrongAnswers >= 3 ? 'text-red-500' : wrongAnswers >= 2 ? 'text-orange-400' : 'text-purple-400'}`}>{wrongAnswers}/3</p>
          </div>
        </div>

        <div className="mb-6">
          <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={`w-full p-2 rounded border transition-all ${
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

        <motion.div
          key={hintLevel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-lg mb-4 text-center"
        >
          <p className="text-sm text-white/80 mb-1">Hint {hintLevel + 1}</p>
          <p className="text-lg font-bold text-white">{hints[hintLevel]}</p>
        </motion.div>

        {player.imageUrl && !player.imageUrl.includes('placeholder') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded-lg overflow-hidden h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center"
          >
            <img
              src={player.imageUrl}
              alt={player.name}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className="w-full h-full object-scale-down"
            />
          </motion.div>
        )}

        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
          placeholder="Enter player name..."
          className={`w-full p-3 mb-4 rounded border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode
              ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
              : 'bg-white border-gray-300 text-slate-900 placeholder-gray-400'
          }`}
          autoFocus
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGuess}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
        >
          Submit Guess
        </motion.button>

        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-lg font-bold"
          >
            {feedback}
          </motion.p>
        )}

        {hintLevel === getMaxHints() - 1 && (
          <p className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            💡 Fun Fact: {player.funFact}
          </p>
        )}
      </motion.div>
    </div>
  );
}
