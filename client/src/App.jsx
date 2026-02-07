import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import HintMode from './pages/HintMode';
import ImageMode from './pages/ImageMode';
import Leaderboard from './pages/Leaderboard';
import Auth from './pages/Auth';
import MultiplayerLobby from './pages/MultiplayerLobby';
import MultiplayerGame from './pages/MultiplayerGame';
import UserStats from './pages/UserStats';
import DailyChallenge from './pages/DailyChallenge';
import Profile from './pages/Profile';
import JerseyMode from './pages/JerseyMode';
import OnboardingTutorial from './components/OnboardingTutorial';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [roomId, setRoomId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(JSON.parse(localStorage.getItem('user')));
      // Show onboarding if not completed
      if (!localStorage.getItem('onboarding_completed')) {
        setShowOnboarding(true);
      }
    }
    setLoading(false);
  }, []);

  const navigate = (path) => {
    if (path.startsWith('/multiplayer/')) {
      setRoomId(path.split('/')[2]);
      setPage('multiplayer-game');
    } else {
      setPage(path.replace('/', ''));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('home');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          ⚽
        </motion.div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900'
      }`}>
        {/* Navigation Bar */}
        {user && (
          <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md ${
            darkMode ? 'bg-slate-900/80 border-b border-purple-500/20' : 'bg-white/80 border-b border-purple-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <motion.div 
                onClick={() => navigate('home')}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className="text-2xl">⚽</span>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GoalGuess Arena
                </h1>
              </motion.div>
              <div className="flex items-center gap-8">
                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    id="profile-menu"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      darkMode
                        ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-purple-500/30'
                        : 'bg-white/50 hover:bg-white/70 border border-purple-200'
                    }`}
                  >
                    <span className="text-lg">{user.avatar || '👤'}</span>
                    <span className="text-sm font-semibold">{user.username}</span>
                  </motion.button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${
                        darkMode
                          ? 'bg-slate-800 border-purple-500/30'
                          : 'bg-white border-purple-200'
                      }`}
                    >
                      <button
                        onClick={() => {
                          navigate('profile');
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors flex items-center gap-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate('stats');
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors flex items-center gap-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        My Stats
                      </button>
                      <hr className={darkMode ? 'border-slate-700' : 'border-gray-200'} />
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-red-400`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Dark Mode Toggle */}
                <motion.button
                  id="dark-mode-toggle"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-all duration-300 backdrop-blur-md border ${
                    darkMode
                      ? 'bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60'
                      : 'bg-white/50 border-purple-200 hover:border-purple-400'
                  }`}
                >
                  {darkMode ? (
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 7a3 3 0 100 6 3 3 0 000-6zm-4.22-1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L5.78 5.22a1 1 0 010-1.414zM7 11a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0zm-9 4a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.829a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 18a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <div className={user ? 'pt-20' : ''}>
          {!user && page === 'home' && <Auth setUser={setUser} navigate={navigate} darkMode={darkMode} />}
          {user && page === 'home' && <Home user={user} navigate={navigate} darkMode={darkMode} />}
          {page === 'auth' && <Auth setUser={setUser} navigate={navigate} darkMode={darkMode} />}
          {page === 'hint-mode' && <HintMode user={user} navigate={navigate} darkMode={darkMode} />}
          {page === 'image-mode' && <ImageMode user={user} navigate={navigate} darkMode={darkMode} />}
          {page === 'leaderboard' && <Leaderboard navigate={navigate} darkMode={darkMode} />}
          {page === 'multiplayer-lobby' && <MultiplayerLobby user={user} navigate={navigate} darkMode={darkMode} />}
          {page === 'multiplayer-game' && <MultiplayerGame roomId={roomId} user={user} navigate={navigate} darkMode={darkMode} />}
          {page === 'stats' && <UserStats user={user} navigate={navigate} darkMode={darkMode} />}
          {page === 'daily-challenge' && <DailyChallenge user={user} navigate={navigate} darkMode={darkMode} />}
          {page === 'profile' && <Profile user={user} navigate={navigate} darkMode={darkMode} />}
          {page === 'jersey-mode' && <JerseyMode user={user} navigate={navigate} darkMode={darkMode} />}
        </div>

        {/* Onboarding Tutorial */}
        {showOnboarding && (
          <OnboardingTutorial 
            onComplete={() => setShowOnboarding(false)} 
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}
