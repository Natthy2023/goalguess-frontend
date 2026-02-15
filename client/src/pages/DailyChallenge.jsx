import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';

export default function DailyChallenge({ user, darkMode }) {
  const [challenge, setChallenge] = useState(null);
  const [gameState, setGameState] = useState('loading'); // loading, completed, info, playing, finished
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeUntilNext, setTimeUntilNext] = useState(null);

  useEffect(() => {
    checkChallengeStatus();
  }, []);

  useEffect(() => {
    if (gameState === 'completed' && timeUntilNext) {
      const interval = setInterval(() => {
        setTimeUntilNext(prev => {
          if (prev <= 1000) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, timeUntilNext]);

  const checkChallengeStatus = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        setError('User not found');
        setLoading(false);
        return;
      }

      // Check if user already completed today's challenge
      const statusRes = await axios.get(`${API_BASE}/challenges/daily/status?userId=${user.id}`);
      
      if (statusRes.data.isCompleted) {
        setGameState('completed');
        setTimeUntilNext(statusRes.data.timeUntilNextDay);
        setScore(statusRes.data.completionData?.score || 0);
      } else {
        // Load the challenge
        const challengeRes = await axios.get('/api/players/image-mode/random');
        setChallenge(challengeRes.data);
        setGameState('info');
      }
      setError('');
    } catch (err) {
      console.error('Error checking challenge status:', err);
      setError('Failed to load daily challenge');
      setGameState('error');
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = () => {
    setGameState('playing');
    setScore(0);
    setHintLevel(0);
    setGuess('');
    setFeedback('');
  };

  const handleGuess = async () => {
    if (!guess.trim() || !challenge) return;

    const isCorrect = guess.toLowerCase().trim() === challenge.name.toLowerCase().trim();

    if (isCorrect) {
      const points = hintLevel === 0 ? 5 : hintLevel === 1 ? 3 : hintLevel === 2 ? 2 : 1;
      const finalScore = score + points;
      setScore(finalScore);
      setFeedback(`✅ Correct! +${points} points`);

      // Save completion
      if (user?.id) {
        try {
          await axios.post('/api/challenges/daily/complete', {
            userId: user.id,
            score: finalScore
          });
        } catch (err) {
          console.error('Error saving completion:', err);
        }
      }

      setTimeout(() => {
        setGameState('finished');
        setTimeUntilNext(24 * 60 * 60 * 1000); // 24 hours
      }, 2000);
    } else {
      if (hintLevel < 3) {
        setHintLevel(hintLevel + 1);
        setFeedback('❌ Wrong! Next hint coming...');
      } else {
        setFeedback(`❌ Game Over! It was ${challenge.name}`);
        // Save incomplete attempt
        if (user?.id) {
          try {
            await axios.post('/api/challenges/daily/complete', {
              userId: user.id,
              score: score
            });
          } catch (err) {
            console.error('Error saving completion:', err);
          }
        }
        setTimeout(() => {
          setGameState('finished');
          setTimeUntilNext(24 * 60 * 60 * 1000);
        }, 2000);
      }
    }
    setGuess('');
  };

  const formatTimeRemaining = (ms) => {
    if (!ms || ms <= 0) return 'Available now!';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
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
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading daily challenge...</p>
      </div>
    );
  }

  if (gameState === 'completed') {
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
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">✅ Challenge Completed!</h1>

          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-lg mb-6">
            <p className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-100'}`}>Your Score</p>
            <p className="text-5xl font-bold">{score}</p>
          </div>

          <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-slate-700/50' : 'bg-white/50'}`}>
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next Challenge Available In:</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {formatTimeRemaining(timeUntilNext)}
            </p>
          </div>

          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Come back tomorrow for a new challenge! 🎯
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (error) {
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
            onClick={checkChallengeStatus}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  if (!challenge) return null;

  if (gameState === 'info') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl backdrop-blur-xl border p-8 max-w-md w-full ${
            darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/50 border-purple-200'
          }`}
        >
          <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">🎯 Daily Challenge</h1>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-lg mb-6">
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-100'}`}>Today's Challenge</p>
            <p className="text-2xl font-bold">Guess the Player</p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}>One unique challenge per day</p>
          </div>

          <div className={`p-4 rounded mb-6 ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
            <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Challenge Info:</p>
            <ul className={`text-sm space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>✅ Guess the featured player</li>
              <li>✅ Use hints strategically</li>
              <li>✅ Earn bonus points for quick guesses</li>
              <li>✅ One challenge per day</li>
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startChallenge}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg font-bold hover:shadow-lg transition-all mb-2"
          >
            Start Challenge
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className={`w-full p-3 rounded-lg font-bold transition-all ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-slate-900'
            }`}
          >
            Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const hints = challenge.mcqOptions ? [
      `Guess from these options: ${challenge.mcqOptions.slice(0, 2).join(', ')}...`,
      `The player's name starts with: ${challenge.name.charAt(0)}`,
      `This is a popular footballer from major leagues`
    ] : ['Hint 1', 'Hint 2', 'Hint 3'];

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
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">🎯 Daily Challenge</h1>
          <p className="mb-4 text-lg font-semibold">Score: {score}</p>

          {challenge.imageUrl && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={challenge.imageUrl}
              alt="Player"
              className="w-full h-48 object-contain rounded-lg mb-4 bg-gradient-to-br from-slate-700 to-slate-800 p-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Player';
              }}
            />
          )}

          <motion.div
            key={hintLevel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-lg mb-4 text-center"
          >
            <p className="text-sm text-white/80 mb-1">Hint {hintLevel + 1}/4</p>
            <p className="text-lg font-bold text-white">{hints[hintLevel]}</p>
          </motion.div>

          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            placeholder="Enter player name..."
            className={`w-full p-3 mb-4 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
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
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg font-bold hover:shadow-lg transition-all"
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
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished') {
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
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">🎉 Challenge Complete!</h1>

          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-lg mb-6">
            <p className={`mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-100'}`}>Your Score</p>
            <p className="text-5xl font-bold">{score}</p>
          </div>

          <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-slate-700/50' : 'bg-white/50'}`}>
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next Challenge Available In:</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {formatTimeRemaining(timeUntilNext)}
            </p>
          </div>

          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Come back tomorrow for a new challenge! 🎯
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }
}
