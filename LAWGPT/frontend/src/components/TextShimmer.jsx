import React from 'react';

const TextShimmer = ({ children, className = '', duration = 2 }) => {
  return (
    <span
      className={`relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary-text via-primary-textSecondary to-primary-text dark:from-gray-100 dark:via-gray-400 dark:to-gray-100 bg-[length:200%_auto] ${className}`}
      style={{
        backgroundPosition: '200% center',
        animation: `shimmer ${duration}s linear infinite`,
      }}
    >
      {children}
    </span>
  );
};

export default TextShimmer;
