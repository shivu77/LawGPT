import React, { useState } from 'react';

const categories = [
  'All',
  'Property Law',
  'Criminal Law',
  'Family Law',
  'Corporate Law',
  'Corruption',
  'Murder',
  'Rape',
  'Fraud',
  'Terrorism',
];

const CategoryFilter = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category === 'All' ? null : category);
    }
  };

  return (
    <div className="space-y-2">
      {categories.map((category, index) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`w-full text-left px-4 py-3 border-2 rounded-card serif-font text-sm transition-all hover:scale-105 active:scale-95 animate-fade-in-up ${
            selectedCategory === category
              ? 'bg-primary-text dark:bg-gray-700 text-background dark:text-gray-100 border-primary-text dark:border-gray-700 animate-pulse-selected'
              : 'border-primary-border dark:border-gray-700 text-primary-text dark:text-gray-300 hover:bg-primary-text/5 dark:hover:bg-gray-800'
          }`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

