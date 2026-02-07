import { motion } from 'framer-motion';
import ImageCarousel from '../components/ImageCarousel';

export default function Home({ user, navigate, darkMode }) {
  const gameCards = [
    {
      icon: '💡',
      title: 'Hint Mode',
      description: 'Guess players from progressive hints. Earn 3, 2, or 1 point based on difficulty.',
      color: 'from-blue-500 to-cyan-500',
      action: 'hint-mode'
    },
    {
      icon: '🖼️',
      title: 'Image Mode',
      description: 'Identify players from their photos. Choose from 4 options and earn 2 points.',
      color: 'from-green-500 to-emerald-500',
      action: 'image-mode'
    },
    {
      icon: '🎯',
      title: 'Daily Challenge',
      description: 'One unique challenge per day. Compete on the daily leaderboard.',
      color: 'from-yellow-500 to-orange-500',
      action: 'daily-challenge'
    },
    {
      icon: '👕',
      title: 'Jersey Mode',
      description: 'Guess which club the jersey belongs to. Race against time with 4 options.',
      color: 'from-indigo-500 to-blue-500',
      action: 'jersey-mode'
    },
    {
      icon: '🎮',
      title: 'Multiplayer',
      description: 'Battle with other players in real-time. Create or join rooms.',
      color: 'from-pink-500 to-rose-500',
      action: 'multiplayer-lobby'
    },
    {
      icon: '🏆',
      title: 'Leaderboard',
      description: 'Check global rankings and see how you compare with other players.',
      color: 'from-purple-500 to-indigo-500',
      action: 'leaderboard'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-4 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-7xl mb-6 inline-block"
          >
            ⚽
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
          >
            GoalGuess Arena
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl md:text-2xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Test Your Football Knowledge. Guess Legends. Prove Your Mastery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`inline-block p-6 rounded-2xl backdrop-blur-xl border ${
              darkMode
                ? 'bg-slate-800/50 border-purple-500/30'
                : 'bg-white/50 border-purple-200'
            }`}
          >
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              🎮 Play multiple game modes • 🏆 Compete globally • 🎯 Unlock achievements
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Carousel Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Football Legends & Competitions
          </motion.h2>
          <ImageCarousel darkMode={darkMode} />
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Choose Your Game Mode
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {gameCards.map((card, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => navigate(card.action)}
                className={`group cursor-pointer rounded-2xl backdrop-blur-xl border p-8 transition-all duration-300 ${
                  darkMode
                    ? 'bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-900/50'
                    : 'bg-white/50 border-purple-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-200/50'
                }`}
              >
                <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.description}
                </p>
                <motion.button
                  whileHover={{ x: 5 }}
                  className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-gradient-to-r ${card.color} text-white hover:shadow-lg transition-all`}
                >
                  Play Now →
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { number: '150+', label: 'Football Players' },
              { number: '5', label: 'Game Modes' },
              { number: '∞', label: 'Fun & Challenges' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className={`text-center p-8 rounded-2xl backdrop-blur-xl border ${
                  darkMode
                    ? 'bg-slate-800/50 border-purple-500/30'
                    : 'bg-white/50 border-purple-200'
                }`}
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('stats')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              📊 View My Stats
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('profile')}
              className={`px-8 py-4 font-bold rounded-lg border transition-all ${
                darkMode
                  ? 'bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60'
                  : 'bg-white/50 border-purple-200 hover:border-purple-400'
              }`}
            >
              👤 My Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('leaderboard')}
              className={`px-8 py-4 font-bold rounded-lg border transition-all ${
                darkMode
                  ? 'bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60'
                  : 'bg-white/50 border-purple-200 hover:border-purple-400'
              }`}
            >
              🏆 Global Leaderboard
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`rounded-2xl backdrop-blur-xl border p-8 text-center ${
              darkMode
                ? 'bg-slate-800/50 border-purple-500/30'
                : 'bg-white/50 border-purple-200'
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="text-6xl">👨‍💻</div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Meet the Creator
            </h2>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Natnael (NADX)</h3>
              <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Passionate Junior Game Developer & Software Engineer
              </p>
              <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                I created GoalGuess Arena as a fun side project with passion for game development. 
                This platform combines interactive gameplay with engaging user experiences to bring football fans together.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t ${
        darkMode ? 'border-purple-500/20 bg-slate-900/50' : 'border-purple-200 bg-white/30'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h4 className="font-bold mb-2">Game Modes</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                5 unique ways to test your football knowledge
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-bold mb-2">Community</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Compete with players worldwide
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-bold mb-2">Features</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Real-time multiplayer & leaderboards
              </p>
            </div>
          </div>
          <div className={`border-t pt-6 text-center ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2026 GoalGuess Arena. All rights reserved. | Created with ❤️ by Natnael (NADX)
            </p>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Test your football knowledge and become a legend! ⚽
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
