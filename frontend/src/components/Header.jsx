import React from 'react';
import { Scale } from 'lucide-react';
import CinematicThemeSwitcher from './CinematicThemeSwitcher';
import TypingText from './TypingText';
import AnimatedLogoutButton from './AnimatedLogoutButton';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="border-b-2 border-primary-border dark:border-gray-700 py-2 animate-fade-in bg-background dark:bg-gray-900 transition-colors duration-300 sticky top-0 z-40 w-full">
      <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-16 group">
          <Scale className="w-7 h-7 text-primary-text dark:text-gray-100 animate-float transition-transform group-hover:rotate-12" />
          <h1 className="pixel-font text-lg md:text-xl ml-8">
            <TypingText 
              text="LAW-GPT" 
              speed={120} 
              startDelay={300}
              showCursor={false}
            />
          </h1>
        </div>
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-primary-textSecondary dark:text-gray-400">
            {user && (
              <span className="text-primary-text dark:text-gray-100">
                {user.username}
              </span>
            )}
            <a href="#chat" className="pixel-font hover:text-primary-text dark:hover:text-gray-100 transition-all hover:scale-105">Chat</a>
          </div>
          <CinematicThemeSwitcher />
          <AnimatedLogoutButton onLogout={handleLogout} />
        </nav>
      </div>
    </header>
  );
};

export default Header;

