import React, { useState } from 'react';
import { LayoutGrid, Clock, Settings } from 'lucide-react';
import CategoryFilter from './CategoryFilter';

const TabbedPanel = ({ onCategoryChange }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: LayoutGrid },
    { id: 'history', label: 'HISTORY', icon: Clock },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <section className="py-12 px-6 bg-background dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-container mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-primary-border dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 code-tab transition-all flex items-center gap-2 ${
                  isActive
                    ? 'tab-active'
                    : 'tab-inactive'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="card p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="serif-font text-xl mb-6">
                Legal Categories
              </h3>
              <CategoryFilter onCategoryChange={onCategoryChange} />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="section-heading text-xl mb-4">
                Query History
              </h3>
              <p className="text-primary-textSecondary dark:text-gray-400">
                History feature coming soon...
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="section-heading text-xl mb-4">
                Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label mb-2 block">Language Preference</label>
                  <select className="w-full px-4 py-2 border-2 border-primary-border dark:border-gray-700 rounded-card focus:outline-none focus:ring-2 focus:ring-primary-text/20 dark:focus:ring-gray-300/20 bg-background dark:bg-gray-800 text-primary-text dark:text-gray-100 transition-colors duration-300">
                    <option>Auto-detect</option>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TabbedPanel;

