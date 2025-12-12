import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Tubelight Navbar Component
 * A beautiful animated navigation bar with tubelight effect
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of navigation items with { name, url, icon }
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.defaultActive - Default active tab name
 */
export function NavBar({ items = [], className, defaultActive }) {
  const [activeTab, setActiveTab] = useState(defaultActive || items[0]?.name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync activeTab when defaultActive prop changes
  useEffect(() => {
    if (defaultActive) {
      setActiveTab(defaultActive);
    }
  }, [defaultActive]);

  const handleNavClick = (item) => {
    setActiveTab(item.name);
    
    // Handle custom onClick handler first (takes priority)
    if (item.onClick) {
      item.onClick();
    }
    
    // Handle hash navigation with smooth scroll
    if (item.url && item.url.startsWith('#')) {
      const element = document.querySelector(item.url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-[2.25rem] left-1/2 -translate-x-1/2 z-50',
        'md:top-[2.5rem] lg:top-[2.25rem]',
        className
      )}
    >
      <div className="flex items-center gap-1.5 md:gap-3 bg-background/95 dark:bg-gray-900/95 border-2 border-primary-border dark:border-gray-700 backdrop-blur-lg py-1 px-1.5 md:px-1 rounded-full shadow-lg max-w-[98vw] md:max-w-none overflow-x-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          
          return (
            <a
              key={item.name}
              href={item.url || '#'}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item);
              }}
              className={cn(
                'relative cursor-pointer text-xs md:text-sm font-semibold px-2.5 md:px-5 py-1.5 rounded-full transition-colors flex items-center justify-center min-w-[44px] md:min-w-0',
                'text-primary-text dark:text-gray-300 hover:text-primary-text dark:hover:text-gray-100',
                'whitespace-nowrap',
                isActive && 'bg-primary-text/10 dark:bg-gray-700 text-primary-text dark:text-gray-100'
              )}
              data-testid={item.name === 'Developer' ? 'developer-modal-button' : undefined}
              aria-label={item.name === 'Developer' ? 'Open developer modal' : undefined}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden flex items-center justify-center">
                <Icon size={20} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary-text/5 dark:bg-gray-700/50 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-text dark:bg-gray-300 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary-text/20 dark:bg-gray-300/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary-text/20 dark:bg-gray-300/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary-text/20 dark:bg-gray-300/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
