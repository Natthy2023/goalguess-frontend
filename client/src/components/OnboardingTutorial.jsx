import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingTutorial({ onComplete, darkMode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [targetRect, setTargetRect] = useState(null);
  const tooltipRef = useRef(null);

  const steps = [
    {
      title: '🎮 Welcome to GoalGuess Arena!',
      description: 'Test your football knowledge by guessing legendary players and clubs. Let\'s get you started!',
      target: null,
      position: 'center'
    },
    {
      title: '🌙 Dark Mode Toggle',
      description: 'Switch between dark and light themes for a comfortable viewing experience.',
      target: 'dark-mode-toggle',
      position: 'bottom'
    },
    {
      title: '👤 Your Profile',
      description: 'Access your profile, view your stats, and manage your account settings.',
      target: 'profile-menu',
      position: 'bottom'
    },
    {
      title: '🎯 Ready to Play!',
      description: 'You\'re all set! Choose a game mode from the home page and start playing. Have fun!',
      target: null,
      position: 'center'
    }
  ];

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (currentStepData.target) {
      const element = document.getElementById(currentStepData.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, currentStepData.target]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding_completed', 'true');
    onComplete();
  };

  if (!isVisible) return null;

  // Calculate tooltip position based on target element
  const getTooltipPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const padding = 20;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    let top, left, transform;

    if (currentStepData.position === 'bottom') {
      top = targetRect.bottom + padding;
      left = targetRect.left + targetRect.width / 2;
      transform = 'translateX(-50%)';
    } else if (currentStepData.position === 'top') {
      top = targetRect.top - tooltipHeight - padding;
      left = targetRect.left + targetRect.width / 2;
      transform = 'translateX(-50%)';
    } else {
      top = '50%';
      left = '50%';
      transform = 'translate(-50%, -50%)';
    }

    return { top: `${top}px`, left: `${left}px`, transform };
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Highlight Box (if target exists) */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute border-2 border-purple-400 rounded-lg pointer-events-none"
              style={{
                top: `${targetRect.top - 8}px`,
                left: `${targetRect.left - 8}px`,
                width: `${targetRect.width + 16}px`,
                height: `${targetRect.height + 16}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
              }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed rounded-2xl backdrop-blur-xl border p-6 max-w-sm w-full mx-4 ${
              darkMode
                ? 'bg-slate-800/95 border-purple-500/50'
                : 'bg-white/95 border-purple-300'
            }`}
            style={tooltipPosition}
          >
            {/* Step Indicator */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {steps.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentStep
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8'
                        : idx < currentStep
                        ? 'bg-purple-500 w-2'
                        : darkMode
                        ? 'bg-slate-600 w-2'
                        : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentStep + 1}/{steps.length}
              </span>
            </div>

            {/* Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {currentStepData.title}
              </h2>
              <p className={`text-sm mb-4 leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentStepData.description}
              </p>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSkip}
                className={`flex-1 px-3 py-2 text-sm rounded-lg font-semibold transition-all ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Skip
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
