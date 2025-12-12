import React from 'react';

const Footer = () => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <footer className="border-t-2 border-primary-border dark:border-gray-700 py-6 px-6 bg-background dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-textSecondary dark:text-gray-400">
          <p>© 2025 LAW-GPT | Indian Legal Assistant</p>
          <p>Last updated: {currentTime}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

