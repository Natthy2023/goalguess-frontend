import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CAROUSEL_IMAGES = [
  // World Cup Champions
  {
    title: 'Argentina World Cup 2022 Champion',
    imageUrl: 'https://i.pinimg.com/736x/af/84/1c/af841c9cfa821a5e0b5c00b9ff23e725.jpg',
    color: 'from-blue-600 to-white'
  },
  {
    title: 'France World Cup 2018 Champion',
    imageUrl: 'https://i.pinimg.com/736x/4c/9b/1b/4c9b1b3b3bdcb79680584b3300f0e8c4.jpg',
    color: 'from-blue-600 to-white'
  },
  {
    title: 'Brazil World Cup 2002 Champion',
    imageUrl: 'https://i.pinimg.com/736x/69/e9/36/69e93656f3433b4d63d51a8bfb28e2db.jpg',
    color: 'from-yellow-600 to-green-600'
  },
  // Champions League Winners
  {
    title: 'Manchester United Champions League 2008',
    imageUrl: 'https://i.pinimg.com/736x/00/39/07/003907de0e5922e04d295e80ce76c59c.jpg',
    color: 'from-red-700 to-red-500'
  },
  {
    title: 'Liverpool Champions League 2019',
    imageUrl: 'https://i.pinimg.com/736x/f1/cf/9c/f1cf9c72c5ed91504636c104ed46696b.jpg',
    color: 'from-red-700 to-red-500'
  },
  {
    title: 'Chelsea Champions League 2021',
    imageUrl: 'https://i.pinimg.com/736x/61/d4/f4/61d4f41c27ae2a97044ee24c563426fa.jpg',
    color: 'from-blue-700 to-blue-500'
  },
  {
    title: 'Manchester City Champions League 2023',
    imageUrl: 'https://i.pinimg.com/736x/1a/34/36/1a34360f4bf28c48deea152a34d4d015.jpg',
    color: 'from-sky-400 to-sky-600'
  },
  {
    title: 'Real Madrid Champions League 2024',
    imageUrl: 'https://i.pinimg.com/736x/cc/0a/17/cc0a17a5f76f8de7c3460dc614c8458e.jpg',
    color: 'from-white to-gray-300'
  },
  // La Liga Champions
  {
    title: 'FC Barcelona La Liga Champion',
    imageUrl: 'https://i.pinimg.com/736x/3c/f1/30/3cf130d398a3f7d3bbc187fb36a8b91d.jpg',
    color: 'from-blue-700 to-red-600'
  },
  {
    title: 'Real Madrid La Liga',
    imageUrl: 'https://i.pinimg.com/736x/15/6b/7a/156b7ae5176888b2020885e5e4b779e8.jpg',
    color: 'from-white to-gray-300'
  },
  {
    title: 'Atletico Madrid La Liga Champion',
    imageUrl: 'https://i.pinimg.com/736x/ad/87/9c/ad879c05c231f46628da44bd876c0513.jpg',
    color: 'from-red-700 to-white'
  },
  // Serie A Champions
  {
    title: 'Inter Milan Serie A Champion',
    imageUrl: 'https://i.pinimg.com/736x/9c/41/06/9c4106a7811b50cae0f11e597d88461a.jpg',
    color: 'from-blue-600 to-black'
  },
  {
    title: 'AC Milan Serie A Champion',
    imageUrl: 'https://i.pinimg.com/736x/c0/64/3e/c0643ec51d53a1ba0582ea1e2fa39b88.jpg',
    color: 'from-red-600 to-black'
  },
  // Famous Players
  {
    title: 'Cristiano Ronaldo',
    imageUrl: 'https://i.pinimg.com/736x/23/af/0c/23af0cac805df109ba61544b15e1aa48.jpg',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Lionel Messi',
    imageUrl: 'https://i.pinimg.com/736x/21/59/7b/21597ba880328a6495b9cc5e903254cb.jpg',
    color: 'from-purple-600 to-pink-600'
  },
  {
    title: 'Wayne Rooney',
    imageUrl: 'https://i.pinimg.com/736x/42/d6/7a/42d67aa8769f803157d35b17462c8a24.jpg',
    color: 'from-red-700 to-red-500'
  },
  {
    title: 'Ronaldinho',
    imageUrl: 'https://i.pinimg.com/736x/fa/54/5b/fa545b1e9b9201e320e6ce685371a520.jpg',
    color: 'from-blue-700 to-red-600'
  },
  {
    title: 'Thierry Henry',
    imageUrl: 'https://i.pinimg.com/736x/30/98/47/309847c818ca7c20901346ad2292959f.jpg',
    color: 'from-red-600 to-white'
  },
  {
    title: 'Neymar Jr',
    imageUrl: 'https://i.pinimg.com/736x/95/fb/42/95fb42e7dd791ef1133f1eb2dd3153d6.jpg',
    color: 'from-yellow-500 to-blue-600'
  },
  {
    title: 'Mohamed Salah',
    imageUrl: 'https://i.pinimg.com/736x/56/c5/8f/56c58f3527d9ed30c73bc0b6502d7080.jpg',
    color: 'from-red-700 to-red-500'
  },
  {
    title: 'Bruno Fernandes',
    imageUrl: 'https://i.pinimg.com/736x/28/7a/b8/287ab8e0881f91cfa2f729dca391d490.jpg',
    color: 'from-purple-600 to-pink-600'
  },
  {
    title: 'Bukayo Saka',
    imageUrl: 'https://i.pinimg.com/736x/60/b1/55/60b1552858be4136d63452b43f3f2d92.jpg',
    color: 'from-red-600 to-white'
  }
];

export default function ImageCarousel({ darkMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex(prev => (prev + newDirection + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  };

  const current = CAROUSEL_IMAGES[currentIndex];
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-gray-900">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 }
            }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            {/* Background Image - Full Display with proper fit */}
            <img
              src={current.imageUrl}
              alt={current.title}
              className="absolute inset-0 w-full h-full object-scale-down bg-gradient-to-br from-gray-800 to-gray-900"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                setImageLoaded(true);
                e.target.style.display = 'none';
              }}
            />
            
            {/* Fallback Gradient if image fails */}
            {!imageLoaded && (
              <div className={`absolute inset-0 bg-gradient-to-br ${current.color}`}></div>
            )}
            
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Content - Title Only */}
            <div className="relative z-10 text-center px-4">
              <h3 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                {current.title}
              </h3>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-md transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-md transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {CAROUSEL_IMAGES.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
