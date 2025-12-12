import React, { useMemo } from 'react';
import { Info, LayoutGrid, Clock, Settings } from 'lucide-react';
import { NavBar } from './TubelightNavbar';

/**
 * NavBar Demo Component
 * Integrates the tubelight navbar with LAW-GPT navigation items
 * Syncs with sidebar activeTab state
 */
export function NavBarDemo({ activeTab, onNavClick }) {
  const navItems = useMemo(() => [
    { 
      name: 'About', 
      url: '#about', 
      icon: Info,
      onClick: () => {
        if (onNavClick) onNavClick('About');
      }
    },
    { 
      name: 'Categories', 
      url: '#categories', 
      icon: LayoutGrid,
      onClick: () => {
        if (onNavClick) onNavClick('Categories');
      }
    },
    { 
      name: 'History', 
      url: '#history', 
      icon: Clock,
      onClick: () => {
        if (onNavClick) onNavClick('History');
      }
    },
    { 
      name: 'Settings', 
      url: '#settings', 
      icon: Settings,
      onClick: () => {
        if (onNavClick) onNavClick('Settings');
      }
    }
  ], [onNavClick]);

  return <NavBar items={navItems} defaultActive={activeTab || 'About'} />;
}

