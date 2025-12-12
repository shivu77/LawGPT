import React, { useState, useEffect } from 'react';
import { Clock, X, Search } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * QueryHistory Component
 * Displays and manages saved chat queries from localStorage
 */
const QueryHistory = ({ onRestoreQuery }) => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('law-gpt-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('law-gpt-history');
      setHistory([]);
    }
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('law-gpt-history', JSON.stringify(updated));
  };

  const filteredHistory = history.filter(item => 
    item.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return (
      <div className="card p-6 border-2 border-primary-border dark:border-gray-700 text-center">
        <Clock className="w-12 h-12 mx-auto mb-4 text-primary-textSecondary dark:text-gray-400 opacity-50" />
        <p className="text-sm text-primary-textSecondary dark:text-gray-400 mb-2">
          No query history yet
        </p>
        <p className="text-xs text-primary-textSecondary dark:text-gray-500">
          Your previous queries will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Clear */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-textSecondary dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border-2 border-primary-border dark:border-gray-700 rounded-card bg-background dark:bg-gray-800 text-primary-text dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-text/20 dark:focus:ring-gray-300/20"
          />
        </div>
        <button
          onClick={clearHistory}
          className="px-3 py-2 text-xs border-2 border-primary-border dark:border-gray-700 rounded-card hover:bg-primary-text/5 dark:hover:bg-gray-800 text-primary-textSecondary dark:text-gray-400 hover:text-primary-text dark:hover:text-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* History List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="card p-4 border-2 border-primary-border dark:border-gray-700 text-center">
            <p className="text-sm text-primary-textSecondary dark:text-gray-400">
              No results found
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="card p-4 border-2 border-primary-border dark:border-gray-700 hover:shadow-cardHover transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-text dark:text-gray-100 mb-1 line-clamp-2">
                    {item.question}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-primary-textSecondary dark:text-gray-400">
                    <span>{formatDate(item.timestamp)}</span>
                    {item.category && (
                      <>
                        <span>•</span>
                        <span className="uppercase">{item.category}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteHistoryItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary-text/10 dark:hover:bg-gray-700 rounded"
                  title="Delete"
                >
                  <X className="w-4 h-4 text-primary-textSecondary dark:text-gray-400" />
                </button>
              </div>
              {item.answer && (
                <button
                  onClick={() => onRestoreQuery && onRestoreQuery(item)}
                  className="w-full mt-2 px-3 py-2 text-xs border-2 border-primary-border dark:border-gray-700 rounded-card hover:bg-primary-text/10 dark:hover:bg-gray-800 text-primary-text dark:text-gray-300 transition-colors"
                >
                  Restore Query
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueryHistory;

