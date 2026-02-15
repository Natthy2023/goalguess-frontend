import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from '../config/api';

const AVATAR_OPTIONS = [
  '👨‍🦱', '👨‍🦲', '👨‍🦳', '👩‍🦱', '👩‍🦲', '👩‍🦳',
  '🧔', '👨‍💼', '👩‍💼', '🧑‍🎨', '🧑‍💻', '🧑‍⚕️'
];

export default function Profile({ user, navigate, darkMode }) {
  const [profile, setProfile] = useState(user || {});
  const [editing, setEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '👨‍🦱');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const updatedProfile = {
        ...profile,
        avatar: selectedAvatar
      };

      await axios.put(`${API_BASE}/auth/profile`, updatedProfile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      localStorage.setItem('user', JSON.stringify(updatedProfile));
      setSuccess('Profile updated successfully!');
      setEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 ${
      darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900'
    }`}>
      <div className="max-w-2xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl backdrop-blur-xl border p-8 ${
            darkMode ? 'bg-slate-800/50 border-purple-500/30' : 'bg-white/50 border-purple-200'
          }`}
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            👤 My Profile
          </h1>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-red-400"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6 text-green-400"
            >
              {success}
            </motion.div>
          )}

          {/* Avatar Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Select Avatar</h2>
            <div className="grid grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map((avatar) => (
                <motion.button
                  key={avatar}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-4xl p-3 rounded-lg transition-all ${
                    selectedAvatar === avatar
                      ? darkMode
                        ? 'bg-purple-600 border-2 border-purple-400'
                        : 'bg-purple-300 border-2 border-purple-600'
                      : darkMode
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  {avatar}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4 mb-8">
            <div>
              <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profile.username || ''}
                onChange={handleInputChange}
                disabled={!editing}
                className={`w-full p-3 rounded border transition-all ${
                  editing
                    ? darkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                    : darkMode
                    ? 'bg-slate-700/50 border-slate-600 text-gray-400'
                    : 'bg-white/50 border-gray-300 text-gray-600'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleInputChange}
                disabled={!editing}
                className={`w-full p-3 rounded border transition-all ${
                  editing
                    ? darkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                    : darkMode
                    ? 'bg-slate-700/50 border-slate-600 text-gray-400'
                    : 'bg-white/50 border-gray-300 text-gray-600'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio || ''}
                onChange={handleInputChange}
                disabled={!editing}
                placeholder="Tell us about yourself..."
                rows="4"
                className={`w-full p-3 rounded border transition-all ${
                  editing
                    ? darkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                    : darkMode
                    ? 'bg-slate-700/50 border-slate-600 text-gray-400'
                    : 'bg-white/50 border-gray-300 text-gray-600'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Favorite Team
              </label>
              <input
                type="text"
                name="favoriteTeam"
                value={profile.favoriteTeam || ''}
                onChange={handleInputChange}
                disabled={!editing}
                placeholder="e.g., Manchester United, Real Madrid..."
                className={`w-full p-3 rounded border transition-all ${
                  editing
                    ? darkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                    : darkMode
                    ? 'bg-slate-700/50 border-slate-600 text-gray-400'
                    : 'bg-white/50 border-gray-300 text-gray-600'
                }`}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Score</p>
              <p className="text-2xl font-bold text-green-400">{profile.totalScore || 0}</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Games Played</p>
              <p className="text-2xl font-bold text-blue-400">{profile.gamesPlayed || 0}</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-white/50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rank</p>
              <p className="text-2xl font-bold text-purple-400">#{profile.rank || 'N/A'}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {!editing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg"
              >
                Edit Profile
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditing(false);
                    setProfile(user);
                    setSelectedAvatar(user?.avatar || '👨‍🦱');
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg"
                >
                  Cancel
                </motion.button>
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('home')}
            className={`w-full mt-4 py-3 rounded-lg font-bold border transition-all ${
              darkMode
                ? 'bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60'
                : 'bg-white/50 border-purple-200 hover:border-purple-400'
            }`}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
