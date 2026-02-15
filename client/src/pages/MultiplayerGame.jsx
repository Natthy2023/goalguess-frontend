import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { SOCKET_URL } from '../config/api';
import { API_BASE } from '../config/api';

export default function MultiplayerGame({ roomId, user, navigate, darkMode }) {
  const [room, setRoom] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [player, setPlayer] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions] = useState(5);

  useEffect(() => {
    loadRoom();
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    newSocket.on('player-joined', () => {
      loadRoom();
    });

    newSocket.on('game-started', () => {
      setGameStarted(true);
      loadNextPlayer();
    });

    newSocket.on('answer-submitted', () => {
      loadRoom();
    });

    newSocket.on('game-finished', () => {
      setGameFinished(true);
    });

    return () => newSocket.close();
  }, [roomId]);

  useEffect(() => {
    if (room && room.players.length === room.maxPlayers && !gameStarted && room.status === 'waiting') {
      startGameAuto();
    }
  }, [room?.players.length]);

  const loadRoom = async () => {
    try {
      const res = await axios.get(`${API_BASE}/multiplayer/room/${roomId}`, {
        timeout: 5000
      });
      setRoom(res.data);
      setLoading(false);

      // Auto-start game if max players reached
      if (res.data.players.length === res.data.maxPlayers && res.data.status === 'waiting') {
        startGame();
      }
    } catch (error) {
      console.error('Error loading room:', error);
      setError('Failed to load room');
      setLoading(false);
    }
  };

  const loadNextPlayer = async () => {
    try {
      const res = await axios.get(`${API_BASE}/players/random?difficulty=${room.difficulty}`, {
        timeout: 5000
      });
      setPlayer(res.data);
      setGuess('');
      setFeedback('');
    } catch (error) {
      console.error('Error loading player:', error);
    }
  };

  const startGame = async () => {
    try {
      if (socket) {
        socket.emit('start-game', roomId);
      }
      setGameStarted(true);
      loadNextPlayer();
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const startGameAuto = async () => {
    try {
      if (socket) {
        socket.emit('start-game', roomId);
      }
      setGameStarted(true);
      setCurrentQuestion(0);
      loadNextPlayer();
    } catch (error) {
      console.error('Error auto-starting game:', error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!guess.trim() || !player) return;

    const isCorrect = guess.toLowerCase().trim() === player.name.toLowerCase().trim();
    const pointsEarned = isCorrect ? 2 : 0;

    try {
      await axios.post(`${API_BASE}/multiplayer/submit-answer/${roomId}`, {
        isCorrect,
        pointsEarned
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (isCorrect) {
        setFeedback('✅ Correct!');
      } else {
        setFeedback(`❌ Wrong! It was ${player.name}`);
      }

      setCurrentQuestion(currentQuestion + 1);

      setTimeout(() => {
        if (currentQuestion + 1 >= totalQuestions) {
          finishGame();
        } else {
          loadRoom();
          loadNextPlayer();
        }
      }, 1500);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }

    setGuess('');
  };

  const leaveRoom = async () => {
    try {
      await axios.post(`${API_BASE}/multiplayer/leave-room/${roomId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('multiplayer-lobby');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const deleteRoom = async () => {
    try {
      await axios.post(`${API_BASE}/multiplayer/delete-room/${roomId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('multiplayer-lobby');
    } catch (error) {
      console.error('Error deleting room:', error);
      setError('Only room host can delete');
    }
  };

  const finishGame = async () => {
    try {
      await axios.post(`${API_BASE}/multiplayer/finish-game/${roomId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setGameFinished(true);
    } catch (error) {
      console.error('Error finishing game:', error);
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
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading room...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900'
      }`}>
        <p className="text-lg mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('multiplayer-lobby')}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold"
        >
          Back to Lobby
        </motion.button>
      </div>
    );
  }

  if (room.status === 'finished' || gameFinished) {
    const sortedPlayers = [...(room?.players || [])].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];
    const userRank = sortedPlayers.findIndex(p => p.userId === user.id) + 1;

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
          <p className="text-2xl font-bold mb-2">🏆 Winner: {winner?.username}</p>
          <p className="text-xl mb-6 text-green-400">Final Score: {winner?.score} pts</p>

          <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
            <p className="text-sm opacity-75">Your Rank</p>
            <p className="text-3xl font-bold text-purple-400">#{userRank}</p>
          </div>

          <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
            {sortedPlayers.map((p, idx) => (
              <motion.div
                key={p.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-3 rounded flex justify-between items-center ${
                  p.userId === user.id
                    ? darkMode ? 'bg-purple-600/50 border border-purple-400' : 'bg-purple-200/50 border border-purple-400'
                    : darkMode ? 'bg-slate-700' : 'bg-white/50'
                }`}
              >
                <span className="font-semibold">#{idx + 1} {p.username}</span>
                <span className="text-lg font-bold text-green-400">{p.score} pts</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('home')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg"
          >
            Back to Home
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
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
          🎮 Room {room.roomId}
        </h1>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Players: {room.players.length}/{room.maxPlayers}
            </p>
            {room.host === user.id && !gameStarted && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={deleteRoom}
                className="text-red-500 hover:text-red-600 text-xl"
                title="Delete room"
              >
                🗑️
              </motion.button>
            )}
          </div>
          <div className="space-y-2 mt-2">
            {room.players.map((p) => (
              <div key={p.userId} className={`p-2 rounded flex justify-between items-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
                <p className="font-semibold">{p.username}</p>
                <p className="text-sm">Score: {p.score}</p>
              </div>
            ))}
          </div>
        </div>

        {gameStarted && (
          <div className={`p-3 rounded mb-4 text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
            <p className="text-sm opacity-75">Question {currentQuestion + 1}/{totalQuestions}</p>
          </div>
        )}

        {!gameStarted ? (
          <div className="text-center">
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Waiting for players... {room.players.length}/{room.maxPlayers}
            </p>
            {room.host === user.id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={startGame}
                disabled={room.players.length < 2}
                className="w-full bg-green-600 text-white font-bold py-2 rounded-lg disabled:opacity-50 mb-2"
              >
                Start Game
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={leaveRoom}
              className="w-full bg-red-600 text-white font-bold py-2 rounded-lg"
            >
              Leave Room
            </motion.button>
          </div>
        ) : player ? (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-lg mb-4 text-center">
              <p className="text-sm text-white/80">Guess the player:</p>
              <p className="text-lg font-bold text-white">{player.hints?.hint1}</p>
            </div>

            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
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
              onClick={handleSubmitAnswer}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg mb-2"
            >
              Submit Answer
            </motion.button>

            {feedback && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-lg font-bold mb-2"
              >
                {feedback}
              </motion.p>
            )}
          </>
        ) : (
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading question...</p>
        )}
      </motion.div>
    </div>
  );
}
