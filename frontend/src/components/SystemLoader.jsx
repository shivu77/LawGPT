import React, { useEffect } from 'react';
import { Scale } from 'lucide-react';
import GooeyText from './GooeyText';

const SystemLoader = ({ onReady }) => {
  useEffect(() => {
    // Longer delay to show morphing text animation
    const timer = setTimeout(() => {
      onReady();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onReady]);

  const loadingTexts = [
    'Loading',
    'Initializing',
    'Preparing',
    'Almost Ready',
    'Your Lawyer is Ready'
  ];

  return (
    <div className="fixed inset-0 bg-background dark:bg-gray-900 flex items-center justify-center z-50 transition-colors duration-300">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary-text/20 dark:border-gray-100/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-text dark:border-gray-100 border-t-transparent animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Scale className="w-8 h-8 text-primary-text dark:text-gray-100" />
            </div>
          </div>
        </div>

        {/* Gooey Morphing Text */}
        <div className="h-40 md:h-48 flex items-center justify-center mb-6">
          <GooeyText
            texts={loadingTexts}
            morphTime={1}
            cooldownTime={0.25}
            className="font-bold"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl display-title mb-2 animate-fade-in">
          LAW-GPT
        </h1>

        {/* Subtitle */}
        <p className="text-primary-textSecondary dark:text-gray-400 text-sm animate-pulse-text">
          Your AI legal counsel
        </p>
      </div>
    </div>
  );
};

export default SystemLoader;
