import React from 'react';
import { X, Scale, Database, Users, Brain, Shield, Globe, BookOpen, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * About Modal Component
 * Shows information about LAW-GPT with glass morphism effect
 * Matches LAW-GPT UI theme
 */
const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const stats = [
    { icon: Database, label: 'Legal Records', value: '156K+', description: 'Comprehensive database of Indian legal documents' },
    { icon: Brain, label: 'AI Training', value: 'Massive', description: 'Trained on extensive legal corpus' },
    { icon: Users, label: 'Lawyer-like', value: 'Expert', description: 'Responds like real legal professionals' },
    { icon: Globe, label: 'Languages', value: '3', description: 'English, Hindi, Tamil support' },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Kanoon.com Quality',
      description: 'Our AI model is trained on data similar to Kanoon.com, ensuring responses match the quality and expertise of real lawyers.'
    },
    {
      icon: Brain,
      title: 'Real Lawyer Response',
      description: 'The AI is fine-tuned to understand legal nuances and provide responses that mirror how experienced lawyers would advise clients.'
    },
    {
      icon: Database,
      title: 'Massive Training Data',
      description: 'Trained on 156,000+ legal records including case laws, statutes, and legal precedents from Indian legal system.'
    },
    {
      icon: Shield,
      title: 'Accurate & Reliable',
      description: 'Built with lawyer-level expertise, ensuring accurate legal information and reliable guidance for your queries.'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Get immediate legal assistance without waiting for appointments. Available 24/7 with instant responses.'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Speak your language - English, Hindi, or Tamil. Our AI understands and responds in your preferred language.'
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/20 dark:border-gray-700/50 relative"
              style={{
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b-2 border-white/20 dark:border-gray-700/50 px-8 py-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-text/10 dark:bg-gray-100/10 flex items-center justify-center border-2 border-primary-border dark:border-gray-700">
                    <Scale className="w-7 h-7 text-primary-text dark:text-gray-100" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary-text dark:text-gray-100 serif-font">About LAW-GPT</h2>
                    <p className="text-sm text-primary-textSecondary dark:text-gray-400 mt-1">Your AI Legal Assistant</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border-2 border-primary-border dark:border-gray-700 hover:bg-primary-text/5 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-primary-text dark:text-gray-300" />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-8 bg-transparent">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                  <h3 className="text-4xl font-bold text-primary-text dark:text-gray-100 serif-font">
                    Powered by Advanced AI
                  </h3>
                  <p className="text-lg text-primary-textSecondary dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    LAW-GPT is an intelligent legal assistant trained on massive datasets to provide lawyer-quality responses 
                    similar to platforms like Kanoon.com. Our AI understands legal nuances and responds like real legal professionals.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border-2 border-white/30 dark:border-gray-700/50 text-center hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all card"
                            style={{
                              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                            }}
                          >
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-text/10 dark:bg-gray-100/10 flex items-center justify-center border-2 border-primary-border dark:border-gray-700">
                          <Icon className="w-6 h-6 text-primary-text dark:text-gray-100" />
                        </div>
                        <div className="text-2xl font-bold text-primary-text dark:text-gray-100 mb-1">{stat.value}</div>
                        <div className="text-sm font-semibold text-primary-text dark:text-gray-200 mb-1">{stat.label}</div>
                        <div className="text-xs text-primary-textSecondary dark:text-gray-400">{stat.description}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Features Grid */}
                <div className="space-y-6">
                  <h4 className="text-2xl font-bold text-primary-text dark:text-gray-100 text-center serif-font">Key Features</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border-2 border-white/30 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all card"
                              style={{
                                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                              }}
                            >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary-text/10 dark:bg-gray-100/10 flex items-center justify-center flex-shrink-0 border-2 border-primary-border dark:border-gray-700">
                              <Icon className="w-6 h-6 text-primary-text dark:text-gray-100" />
                            </div>
                            <div>
                              <h5 className="text-lg font-bold text-primary-text dark:text-gray-100 mb-2">{feature.title}</h5>
                              <p className="text-sm text-primary-textSecondary dark:text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                    {/* Training Data Info */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border-2 border-white/30 dark:border-gray-700/50"
                      style={{
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                      }}
                    >
                  <div className="flex items-start gap-4">
                    <Database className="w-8 h-8 text-primary-text dark:text-gray-100 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-primary-text dark:text-gray-100 mb-3 serif-font">Training Data & Expertise</h4>
                      <p className="text-primary-textSecondary dark:text-gray-400 leading-relaxed mb-4">
                        LAW-GPT is trained on <strong className="text-primary-text dark:text-gray-100">156,000+ legal records</strong> including:
                      </p>
                      <ul className="space-y-2 text-primary-textSecondary dark:text-gray-400">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary-text dark:bg-gray-300"></span>
                          Case laws and legal precedents from Indian courts
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary-text dark:bg-gray-300"></span>
                          Statutes and acts from Indian legal system
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary-text dark:bg-gray-300"></span>
                          Legal documents similar to Kanoon.com database
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary-text dark:bg-gray-300"></span>
                          Expert legal opinions and interpretations
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                    {/* Kanoon.com Comparison */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border-2 border-white/30 dark:border-gray-700/50"
                      style={{
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                      }}
                    >
                  <div className="flex items-start gap-4">
                    <Users className="w-8 h-8 text-primary-text dark:text-gray-100 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-primary-text dark:text-gray-100 mb-3 serif-font">Kanoon.com Quality Response</h4>
                      <p className="text-primary-textSecondary dark:text-gray-400 leading-relaxed">
                        Our AI model is fine-tuned to provide responses that match the quality and expertise of lawyers on Kanoon.com. 
                        The system understands legal context, interprets statutes correctly, and provides guidance similar to how real 
                        legal professionals would advise their clients. Every response is crafted to be accurate, comprehensive, and 
                        lawyer-like in its approach.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t-2 border-primary-border dark:border-gray-700">
                  <p className="text-sm text-primary-textSecondary dark:text-gray-400">
                    LAW-GPT - Your trusted AI legal assistant powered by advanced machine learning
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;

