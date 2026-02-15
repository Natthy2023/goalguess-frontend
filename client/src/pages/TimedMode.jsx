import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';

export default function TimedMode({ user, navigate, darkMode }) {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [timeLimit, setTimeLimit] = useState(60);
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [player, setPlayer] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  const startGame = async () => {
    setGameState('playing');
    setTimeLeft(timeLimit);
    setScore(0);
    setQuestionsAnswered(0);
    loadNextPlayer();
  };

  const loadNextPlayer = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/players/random?difficulty=${difficulty}`, {
        timeout: 5000
      });
      setPlayer(res.data);
      setGuess('');
      setFeedback('');
    } catch (error) {
      console.error('Error loading player:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = async () => {
    if (!guess.trim() || !player || gameState !== 'playing') return;

    const isCorrect = guess.toLowerCase().trim() === player.name.toLowerCase().trim();
    setQuestionsAnswered(questionsAnswered + 1);

    if (isCorrect) {
      setScore(score + 2);
      setFeedback('✅ Correct!');
      setTimeout(() => loadNextPlayer(), 500);
    } else {
      setFeedback(`❌ Wrong! ${player.name}`);
      setTimeout(() => loadNextPlayer(), 800);
    }

    setGuess('');
  };

  const endGame = async () => {
    setGameState('finished');
    if (user) {
      try {
        await axios.post(`${API_BASE}/game/submit-answer`, {
          userId: user.id,
          isCorrect: true,
          pointsEarned: score
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setScore(0);
    setQuestionsAnswered(0);
    setTimeLeft(timeLimit);
  };

  if (gameState === 'setup') {
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
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">⏱️ Timed Mode</h1>

          <div className="mb-6">
            <label className={`block mb-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Time Limit: {timeLimit}s
            </label>
            <input
              type="range"
              min="30"
              max="300"
              step="30"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>30s</span>
              <span>300s</span>
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all mb-4"
          >
            Start Game
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('home')}
            className={`w-full py-3 rounded-lg font-bold border transition-all ${
              darkMode
                ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
          >
            Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900'
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-2xl backdrop-blur-xl border p-8 max-w-md w-full ${
            darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/50 border-purple-200'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score</p>
              <p className="text-3xl font-bold text-green-400">{score}</p>
            </div>
            <motion.div
              animate={{ scale: timeLeft < 10 ? 1.2 : 1 }}
              className={`text-center ${timeLeft < 10 ? 'text-red-500' : 'text-yellow-400'}`}
            >
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</p>
              <p className="text-3xl font-bold">{timeLeft}s</p>
            </motion.div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Questions</p>
              <p className="text-3xl font-bold text-blue-400">{questionsAnswered}</p>
            </div>
          </div>

          {player && !loading ? (
            <>
              <motion.div
                key={player.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-lg mb-4 text-center"
              >
                <p className="text-sm text-white/80">Guess the player:</p>
                <p className="text-lg font-bold text-white">{player.hints?.hint1}</p>
              </motion.div>

              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
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
                Submit
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
            </>
          ) : (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-2"
              >
                ⚽
              </motion.div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading...</p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const accuracy = questionsAnswered > 0 ? ((score / (questionsAnswered * 2)) * 100).toFixed(0) : 0;

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
          <h1 className="text-4xl font-bold mb-6">🎉 Game Over!</h1>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-lg mb-6">
            <p className={`text-sm ${darkMode ? 'text-white/80' : 'text-white/80'}`}>Final Score</p>
            <p className="text-5xl font-bold text-white">{score}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Questions</p>
              <p className="text-2xl font-bold">{questionsAnswered}</p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</p>
              <p className="text-2xl font-bold text-green-400">{accuracy}%</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all mb-2"
          >
            Play Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('home')}
            className={`w-full py-3 rounded-lg font-bold border transition-all ${
              darkMode
                ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }
}
