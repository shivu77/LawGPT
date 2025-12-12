import React, { useEffect, useState } from 'react';
import { TrendingUp, Database, Zap, Languages } from 'lucide-react';
import apiClient from '../api/client';

const StatsStrip = () => {
  const [stats, setStats] = useState({
    totalDocuments: '156K+',
    avgLatency: '0.0s',
    accuracy: '95.0%',
    languages: '3',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.getStats();
        if (data) {
          setStats({
            totalDocuments: data.total_documents ? `${(data.total_documents / 1000).toFixed(0)}K+` : '156K+',
            avgLatency: data.avg_latency ? `${data.avg_latency.toFixed(2)}s` : '0.0s',
            accuracy: data.accuracy ? `${(data.accuracy * 100).toFixed(1)}%` : '95.0%',
            languages: '3',
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      icon: Database,
      value: stats.totalDocuments,
      label: 'TOTAL DOCUMENTS',
      color: 'text-primary-text dark:text-gray-100',
    },
    {
      icon: Zap,
      value: stats.avgLatency,
      label: 'AVG LATENCY',
      color: 'text-gray-600 dark:text-gray-400',
    },
    {
      icon: TrendingUp,
      value: stats.accuracy,
      label: 'ACCURACY',
      color: 'text-gray-600 dark:text-gray-400',
    },
    {
      icon: Languages,
      value: stats.languages,
      label: 'LANGUAGES',
      color: 'text-primary-text dark:text-gray-100',
    },
  ];

  return (
    <section className="py-8 px-6 bg-background dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="metric text-3xl text-primary-text dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;

