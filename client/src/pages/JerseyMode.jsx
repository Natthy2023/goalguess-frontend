import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';

export default function JerseyMode({ user, darkMode }) {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
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
    loadNextTeam();
  };

 const loadNextTeam = async () => {
  setLoading(true);
  setFeedback('');

  try {
    const res = await axios.get(`${API_BASE}/teams/random-teams`, { timeout: 5000 });
    if (!res.data || !res.data.correctTeam || !res.data.options) {
      throw new Error('Invalid team data');
    }

    const shuffledOptions = res.data.options.sort(() => Math.random() - 0.5);
    setCurrentTeam({
      ...res.data,
      options: shuffledOptions
    });
  } catch (error) {
    console.error('Error loading team:', error);
    setFeedback('Failed to load team. Retrying...');
    // Optionally retry after 2 seconds
    setTimeout(loadNextTeam, 2000);
  } finally {
    setLoading(false);
  }
};


  const handleAnswer = async (selectedTeam) => {
    if (gameState !== 'playing' || loading) return;

    setSelectedAnswer(selectedTeam);
    const isCorrect = selectedTeam === currentTeam.correctTeam.name;
    setQuestionsAnswered(questionsAnswered + 1);

    if (isCorrect) {
      setScore(score + 2);
      setFeedback('✅ Correct!');
      setTimeout(() => loadNextTeam(), 1000);
    } else {
      setFeedback(`❌ Wrong! It was ${currentTeam.correctTeam.name}`);
      setTimeout(() => loadNextTeam(), 1500);
    }
  };

  const endGame = async () => {
    setGameState('finished');
    if (user) {
      try {
        await axios.post(`${API_BASE}/game/submit-answer`, {
          playerId: correctTeam.name, // or generate a unique ID if needed
          isCorrect,
          pointsEarned: isCorrect ? 2 : 0,
          hintLevel: 0
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
    setSelectedAnswer(null);
    setFeedback('');
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
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center">👕 Jersey Mode</h1>
          
          <p className={`mb-6 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Guess which club the jersey belongs to!
          </p>

          <div className="mb-6">
            <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Limit:</label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className={`w-full p-2 rounded border transition-all ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-slate-900'
              }`}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>120 seconds</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Start Game
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const accuracy = questionsAnswered > 0 ? Math.round((score / (questionsAnswered * 2)) * 100) : 0;
    
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
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Game Over!</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score</p>
              <p className="text-3xl font-bold text-green-400">{score}</p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</p>
              <p className="text-3xl font-bold text-blue-400">{accuracy}%</p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Questions</p>
              <p className="text-3xl font-bold text-purple-400">{questionsAnswered}</p>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time Used</p>
              <p className="text-3xl font-bold text-pink-400">{timeLimit - timeLeft}s</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Play Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (loading || !currentTeam) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          👕
        </motion.div>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading jersey...</p>
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
        className={`rounded-2xl backdrop-blur-xl border p-8 max-w-2xl w-full ${
          darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/50 border-purple-200'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">👕 Jersey Mode</h1>
          <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-green-400'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className={`p-3 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score</p>
            <p className="text-2xl font-bold text-green-400">{score}</p>
          </div>
          <div className={`p-3 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Answered</p>
            <p className="text-2xl font-bold text-blue-400">{questionsAnswered}</p>
          </div>
          <div className={`p-3 rounded text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>League</p>
            <p className="text-lg font-bold text-purple-400">{currentTeam.correctTeam.league}</p>
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Which club is this jersey from?</p>
          {currentTeam.correctTeam.jersey && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center overflow-hidden"
            >
              <img
                src={currentTeam.correctTeam.jersey}
                alt="Jersey"
                className="h-full w-full object-contain p-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Jersey';
                }}
              />
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {currentTeam.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`p-4 rounded-lg font-bold transition-all ${
                selectedAnswer === option
                  ? option === currentTeam.correctTeam.name
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : selectedAnswer && option === currentTeam.correctTeam.name
                  ? 'bg-green-500 text-white'
                  : darkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-white hover:bg-gray-100 text-slate-900'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-lg font-bold"
          >
            {feedback}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
