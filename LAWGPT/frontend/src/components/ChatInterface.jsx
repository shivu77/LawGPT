import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, LayoutGrid, Clock, Settings, Scale, BookOpen, Languages, Square, X, Menu, ChevronRight, ChevronLeft, Copy, Check, Globe } from 'lucide-react';
import apiClient from '../api/client';
import CategoryFilter from './CategoryFilter';
import QueryHistory from './QueryHistory';
import TypingLoader from './TypingLoader';
import TypingText from './TypingText';
import BotResponse from './BotResponse';
import TextShimmer from './TextShimmer';
import RippleButton from './RippleButton';
import FadeInOnScroll from './FadeInOnScroll';
import FloatingCard from './FloatingCard';
import StaggeredContainer from './StaggeredContainer';
import { Dock, DockIcon, DockItem, DockLabel } from './ui/Dock';

const ChatInterface = ({ selectedCategory, onCategoryChange, activeTab, onTabChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile
  const [copiedMessageId, setCopiedMessageId] = useState(null); // Track which message was copied
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop
  const [sessionId, setSessionId] = useState(null); // Session ID for conversation memory
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [webSearchActive, setWebSearchActive] = useState(false); // Web search toggle

  // Generate session ID on mount for conversation memory
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSessionId);
    console.log('[SESSION] Generated session ID:', newSessionId);
  }, []);

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (input === '' && inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = '40px'; // Reset to initial min-height
    }
  }, [input]);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    if (sidebarOpen) {
      const handleClickOutside = (e) => {
        const sidebar = document.querySelector('[data-sidebar]');
        const toggleBtn = document.querySelector('[data-sidebar-toggle]');
        if (sidebar && !sidebar.contains(e.target) && !toggleBtn?.contains(e.target)) {
          setSidebarOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [sidebarOpen]);

  const exampleQueries = [
    'What is IPC Section 302?',
    'Property ownership rights in India',
    'How to file a consumer complaint?',
    'Divorce procedure under Hindu law',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);

      // Add cancellation message
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.loading) {
          // Remove loading message
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
  };

  const handleNewChat = () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset all chat state
    setMessages([]);
    setInput('');
    setLoading(false);
    setDetectedLanguage(null);

    // Generate new session ID for new conversation
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSessionId);
    console.log('[SESSION] New chat - generated new session ID:', newSessionId);

    // Optional: Clear selected category (uncomment if desired)
    // if (onCategoryChange) {
    //   onCategoryChange(null);
    // }

    // Focus on input after reset
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const trimmedInput = input.trim();
    if (!trimmedInput || loading) {
      console.log('handleSubmit blocked:', { trimmed: trimmedInput.length, loading });
      return;
    }

    console.log('handleSubmit executing with:', trimmedInput);

    const userMessage = trimmedInput;
    setInput('');
    setLoading(true);

    // Create AbortController for this request
    abortControllerRef.current = new AbortController();

    // Add user message with unique ID
    const newMessages = [...messages, { id: Date.now() + Math.random(), role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await apiClient.query(
        userMessage,
        selectedCategory || 'general',
        null,
        abortControllerRef.current.signal,
        sessionId,
        webSearchActive // Pass web search mode
      );

      if (response && response.response) {
        const botMessage = {
          id: Date.now() + Math.random(), // Unique ID for React key
          role: 'assistant',
          content: response.response.answer || response.response || 'No response received.',
          title: response.response.title || null, // Dynamic title from backend
          question: userMessage, // Store original question for BotResponse
          metadata: {
            latency: response.response.latency,
            language: response.response.system_info?.detected_language || detectedLanguage,
            sources: response.response.sources || [],
          },
        };

        setDetectedLanguage(botMessage.metadata.language);
        const finalMessages = [...newMessages, botMessage];
        setMessages(finalMessages);

        // Save to history
        saveToHistory(userMessage, botMessage.content, selectedCategory || 'general', botMessage.metadata.language);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      // Don't show error if it was cancelled
      if (error.message !== 'Request cancelled') {
        console.error('Error in handleSubmit:', error);
        const errorMessage = {
          id: Date.now() + Math.random(), // Unique ID for React key
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error.message || 'Please check if the backend is running and try again.'}`,
          error: true,
        };
        setMessages([...newMessages, errorMessage]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const saveToHistory = (question, answer, category, language) => {
    try {
      const historyItem = {
        id: Date.now(),
        question,
        answer,
        category,
        language: language || 'auto',
        timestamp: new Date().toISOString(),
      };

      const existing = localStorage.getItem('law-gpt-history');
      const history = existing ? JSON.parse(existing) : [];
      const updated = [historyItem, ...history].slice(0, 100); // Keep last 100 items
      localStorage.setItem('law-gpt-history', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const handleRestoreQuery = (historyItem) => {
    setInput(historyItem.question);
    if (historyItem.category && onCategoryChange) {
      onCategoryChange(historyItem.category === 'general' ? null : historyItem.category);
    }
    // Scroll to input
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]');
      if (inputElement) {
        inputElement.focus();
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleExampleClick = async (example) => {
    const trimmedExample = example.trim();
    console.log('=== HANDLE EXAMPLE CLICK START ===');
    console.log('Example clicked:', trimmedExample);
    console.log('Current loading state:', loading);
    console.log('Example length:', trimmedExample.length);

    if (loading) {
      console.log('❌ BLOCKED: Already loading');
      return;
    }

    if (!trimmedExample) {
      console.log('❌ BLOCKED: Empty example');
      return;
    }

    // Auto-submit the query directly without setting input first
    console.log('✅ Proceeding to submit:', trimmedExample);
    try {
      await handleExampleSubmit(trimmedExample);
      console.log('✅ Successfully submitted:', trimmedExample);
    } catch (error) {
      console.error('❌ Error in handleExampleClick:', error);
    }
    console.log('=== HANDLE EXAMPLE CLICK END ===');
  };

  const handleExampleSubmit = async (queryText) => {
    console.log('handleExampleSubmit called:', { queryText: queryText.trim(), loading });

    if (!queryText.trim()) {
      console.log('Empty query text, returning');
      return;
    }

    if (loading) {
      console.log('Already loading, ignoring request');
      return;
    }

    setInput('');
    setLoading(true);

    console.log('Starting API request for:', queryText);

    // Create AbortController for this request
    abortControllerRef.current = new AbortController();

    // Add user message with unique ID
    const newMessages = [{ id: Date.now() + Math.random(), role: 'user', content: queryText }];
    setMessages(newMessages);

    try {
      const response = await apiClient.query(
        queryText,
        selectedCategory || 'general',
        null,
        abortControllerRef.current.signal,
        sessionId,
        webSearchActive // Pass web search mode
      );

      if (response && response.response) {
        const botMessage = {
          id: Date.now() + Math.random(), // Unique ID for React key
          role: 'assistant',
          content: response.response.answer || response.response || 'No response received.',
          title: response.response.title || null, // Dynamic title from backend
          question: queryText, // Store original question for BotResponse
          metadata: {
            latency: response.response.latency,
            language: response.response.system_info?.detected_language || detectedLanguage,
            sources: response.response.sources || [],
          },
        };

        setDetectedLanguage(botMessage.metadata.language);
        const finalMessages = [...newMessages, botMessage];
        setMessages(finalMessages);

        // Save to history
        saveToHistory(queryText, botMessage.content, selectedCategory || 'general', botMessage.metadata.language);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      // Don't show error if it was cancelled
      if (error.message !== 'Request cancelled') {
        console.error('Error submitting query:', error);
        const errorMessage = {
          id: Date.now() + Math.random(), // Unique ID for React key
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please check if the backend is running and try again.',
          error: true,
        };
        setMessages([...newMessages, errorMessage]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: LayoutGrid },
    { id: 'history', label: 'HISTORY', icon: Clock },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <section id="chat" className="flex-1 flex flex-col overflow-hidden h-full w-full box-border">
      <div className="flex-1 flex overflow-hidden h-full">
        {/* Main Chat Area - 75% */}
        <div className="flex-1 flex flex-col min-w-0" style={{ width: sidebarCollapsed ? '100%' : 'calc(100% - 20rem)' }}>
          <div className="flex-1 flex flex-col bg-background dark:bg-gray-900 transition-colors duration-300 border-2 border-primary-border dark:border-gray-700 rounded-lg m-0 overflow-hidden">
            {/* Chat Header */}
            <div className="border-b-2 border-primary-border dark:border-gray-700 px-3 md:px-6 py-3 md:py-4 bg-background dark:bg-gray-900 flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                {/* Sidebar Toggle Button - Mobile */}
                <button
                  data-sidebar-toggle
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 border-primary-border dark:border-gray-700 hover:bg-primary-text/5 dark:hover:bg-gray-800 flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? (
                    <X className="w-4 h-4 md:w-5 md:h-5 text-primary-text dark:text-gray-300" />
                  ) : (
                    <Menu className="w-4 h-4 md:w-5 md:h-5 text-primary-text dark:text-gray-300" />
                  )}
                </button>

                {/* Law Icon - Changes when conversation starts */}
                <img
                  src={messages.length > 0 ? "/ELEMENTS/DEVLOPER/icons8-law-100-conversation.png" : "/ELEMENTS/DEVLOPER/icons8-law-100.png"}
                  alt="Law"
                  className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 object-contain filter dark:invert transition-opacity duration-300"
                  draggable={false}
                />

                <h2 className="serif-font text-base md:text-xl lg:text-2xl truncate">
                  <TypingText
                    text="Legal Assistant"
                    speed={80}
                    startDelay={600}
                    showCursor={false}
                  />
                </h2>
              </div>

              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                {/* Category Display */}
                {selectedCategory && (
                  <div className="hidden md:flex items-center gap-2">
                    <span className="serif-font text-sm text-primary-textSecondary dark:text-gray-400">Category:</span>
                    <span className="serif-font text-xl md:text-2xl font-bold text-primary-text dark:text-gray-100">
                      {selectedCategory}
                    </span>
                  </div>
                )}

                {/* New Chat Button - Show when there are messages */}
                {messages.length > 0 && (
                  <button
                    onClick={handleNewChat}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 border-primary-border dark:border-gray-700 hover:bg-primary-text/10 dark:hover:bg-gray-800 hover:border-primary-text dark:hover:border-gray-600 flex items-center justify-center transition-all flex-shrink-0 group overflow-hidden"
                    aria-label="Start new chat"
                    title="New Chat"
                  >
                    <img
                      src="/ELEMENTS/DEVLOPER/new-message.png"
                      alt="New Chat"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain group-hover:scale-110 transition-transform filter dark:invert"
                      draggable={false}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Messages Area - Full Height with padding for fixed input on mobile */}
            <div
              className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-8 pb-20 md:pb-8"
              style={{ pointerEvents: 'auto', WebkitOverflowScrolling: 'touch' }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-0 px-2 md:px-4 py-2 md:py-4">
                  {/* Welcome Content */}
                  <div className="text-center max-w-3xl w-full">
                    {/* Bot Icon */}
                    <div className="mb-2 md:mb-6 animate-fade-in-up">
                      <div className="w-12 h-12 md:w-20 md:h-20 mx-auto rounded-full bg-primary-text/10 dark:bg-gray-100/10 flex items-center justify-center mb-2 md:mb-4 animate-float">
                        <Bot className="w-6 h-6 md:w-12 md:h-12 text-primary-text dark:text-gray-100" />
                      </div>
                    </div>

                    {/* Welcome Title */}
                    <h2 className="mb-2 md:mb-4" style={{ animationDelay: '0.1s' }}>
                      <span className="retro-logo inline-block text-2xl md:text-4xl lg:text-5xl">
                        <TypingText
                          text="LAW-GPT"
                          speed={150}
                          startDelay={500}
                          showCursor={false}
                          loop={false}
                        />
                      </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm md:text-lg text-primary-textSecondary dark:text-gray-400 mb-4 md:mb-8 max-w-2xl mx-auto leading-relaxed md:leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      Your AI legal counsel. Instant access to{' '}
                      <span className="font-semibold text-primary-text dark:text-gray-100">156K+ legal records</span> with{' '}
                      <span className="font-semibold text-primary-text dark:text-gray-100">lawyer-level expertise</span>.{' '}
                      Available in{' '}
                      <span className="font-semibold text-primary-text dark:text-gray-100">English, Hindi, and Tamil</span>.
                    </p>

                    {/* Feature Cards - Compact on Mobile */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-10">
                      <FloatingCard>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Feature card clicked: Multi-Domain Coverage');
                            handleExampleClick('Property, Criminal, Family, Corporate law').catch(err => console.error('Error:', err));
                          }}
                          disabled={loading}
                          className="card p-3 md:p-5 flex flex-col items-center text-center hover:shadow-cardHover transition-all w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                        >
                          <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2 md:mb-3 animate-pulse-icon">
                            <Scale className="w-4 h-4 md:w-7 md:h-7 text-gray-700 dark:text-gray-300" />
                          </div>
                          <h3 className="section-heading text-xs md:text-base mb-1 md:mb-2 leading-tight font-semibold">
                            Multi-Domain
                          </h3>
                          <p className="text-[10px] md:text-sm text-primary-textSecondary dark:text-gray-400 leading-tight hidden md:block">
                            Property, Criminal, Family, Corporate & more
                          </p>
                        </button>
                      </FloatingCard>

                      <FloatingCard>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Feature card clicked: 156K+ Legal Records');
                            handleExampleClick('156K+ Legal Records - Comprehensive database of Indian legal documents').catch(err => console.error('Error:', err));
                          }}
                          disabled={loading}
                          className="card p-3 md:p-5 flex flex-col items-center text-center hover:shadow-cardHover transition-all w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                        >
                          <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2 md:mb-3 animate-pulse-icon" style={{ animationDelay: '0.2s' }}>
                            <BookOpen className="w-4 h-4 md:w-7 md:h-7 text-gray-700 dark:text-gray-300" />
                          </div>
                          <h3 className="section-heading text-xs md:text-base mb-1 md:mb-2 leading-tight font-semibold">
                            156K+ Records
                          </h3>
                          <p className="text-[10px] md:text-sm text-primary-textSecondary dark:text-gray-400 leading-tight hidden md:block">
                            Comprehensive database of Indian legal documents
                          </p>
                        </button>
                      </FloatingCard>

                      <FloatingCard>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Feature card clicked: Multi-Language Support');
                            handleExampleClick('Multi-Language Support - English, Hindi, Tamil with auto-detection').catch(err => console.error('Error:', err));
                          }}
                          disabled={loading}
                          className="card p-3 md:p-5 flex flex-col items-center text-center hover:shadow-cardHover transition-all w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                        >
                          <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2 md:mb-3 animate-pulse-icon" style={{ animationDelay: '0.4s' }}>
                            <Languages className="w-4 h-4 md:w-7 md:h-7 text-gray-700 dark:text-gray-300" />
                          </div>
                          <h3 className="section-heading text-xs md:text-base mb-1 md:mb-2 leading-tight font-semibold">
                            Multi-Language
                          </h3>
                          <p className="text-[10px] md:text-sm text-primary-textSecondary dark:text-gray-400 leading-tight hidden md:block">
                            English, Hindi, Tamil with auto-detection
                          </p>
                        </button>
                      </FloatingCard>
                    </div>

                    {/* Example Queries - Compact on Mobile */}
                    <div className="mb-4 md:mb-6" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 50 }}>
                      <h3 className="text-sm md:text-sm font-medium text-primary-textSecondary dark:text-gray-400 mb-3 md:mb-4 uppercase tracking-label animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        Try asking about:
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-w-2xl mx-auto" style={{ pointerEvents: 'auto' }}>
                        {exampleQueries.map((example, index) => {
                          const trimmedExample = example.trim();

                          return (
                            <button
                              key={`example-${index}-${trimmedExample}`}
                              type="button"
                              onClick={(e) => {
                                console.log('🚀 BUTTON CLICKED:', trimmedExample, { loading });
                                e.preventDefault();
                                e.stopPropagation();

                                if (loading) {
                                  console.log('⛔ Loading, blocked');
                                  return false;
                                }

                                console.log('✅ Calling handleExampleClick');
                                handleExampleClick(trimmedExample).catch(err => {
                                  console.error('❌ Error:', err);
                                });
                                return false;
                              }}
                              onMouseDown={(e) => {
                                console.log('🖱️ MouseDown:', trimmedExample);
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onPointerDown={(e) => {
                                console.log('👆 PointerDown:', trimmedExample);
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              disabled={loading}
                              className="card p-3 md:p-4 text-left hover:shadow-cardHover transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full border-2 border-primary-border dark:border-gray-700 bg-background dark:bg-gray-800 active:scale-95"
                              style={{
                                pointerEvents: 'auto !important',
                                position: 'relative',
                                zIndex: 9999,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                                outline: 'none',
                                isolation: 'isolate',
                              }}
                              data-example={trimmedExample}
                            >
                              <span className="text-sm md:text-base text-primary-text dark:text-gray-100 font-medium pointer-events-none leading-relaxed">
                                {trimmedExample}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CTA Text */}
                    <p className="text-xs md:text-xl font-semibold text-primary-text dark:text-gray-100 mt-2 md:mt-8 animate-fade-in-up animate-pulse-text" style={{ animationDelay: '0.7s' }}>
                      Ask me anything about Indian law...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    // Use stable ID if available, fallback to index
                    const messageKey = msg.id || `msg-${index}`;
                    const prevMsg = index > 0 ? messages[index - 1] : null;
                    const isRoleChange = prevMsg && prevMsg.role !== msg.role;
                    // Extra spacing when role changes (user -> bot or bot -> user)
                    const spacingClass = index === 0
                      ? 'mb-0'
                      : isRoleChange
                        ? 'mt-16 mb-6'
                        : 'mt-8 mb-6';

                    return (
                      <FadeInOnScroll key={messageKey} delay={index * 0.1} direction="up">
                        <div
                          className={`flex gap-4 max-w-4xl mx-auto ${spacingClass} ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-transparent flex items-center justify-center border-0 animate-float-avatar overflow-hidden">
                              <img
                                src="/ELEMENTS/DEVLOPER/icons8-bot-64.png"
                                alt="Bot"
                                className="w-10 h-10 object-contain filter dark:invert"
                                draggable={false}
                              />
                            </div>
                          )}
                          <div
                            className={`max-w-[85%] card p-5 animate-slide-in-message relative group ${msg.role === 'user'
                              ? 'bg-primary-text dark:bg-gray-700 text-background dark:text-gray-100 border-primary-text dark:border-gray-700'
                              : msg.error
                                ? 'border-red-500 dark:border-red-400 border-2 bg-white dark:bg-gray-800'
                                : 'border-2 border-primary-border dark:border-gray-700 bg-white dark:bg-gray-800'
                              }`}
                            style={{ position: 'relative', overflow: 'visible' }}
                          >
                            {msg.role === 'user' ? (
                              <p className="text-base whitespace-pre-wrap leading-relaxed text-background dark:text-gray-100">
                                {msg.content}
                              </p>
                            ) : msg.error ? (
                              <p className="text-base whitespace-pre-wrap leading-relaxed text-red-700 dark:text-red-300">
                                {msg.content}
                              </p>
                            ) : (
                              <div>
                                <BotResponse
                                  content={msg.content}
                                  title={msg.title}
                                  question={msg.question || ''}
                                  speed={30}
                                />
                              </div>
                            )}

                            {/* Copy Button - Below content, black and white */}
                            {msg.role !== 'user' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const textToCopy = msg.content || '';
                                  if (!textToCopy) return;

                                  navigator.clipboard.writeText(textToCopy).then(() => {
                                    setCopiedMessageId(index);
                                    setTimeout(() => {
                                      setCopiedMessageId(null);
                                    }, 2000);
                                  }).catch(err => {
                                    console.error('Failed to copy:', err);
                                    // Fallback for older browsers
                                    const textArea = document.createElement('textarea');
                                    textArea.value = textToCopy;
                                    textArea.style.position = 'fixed';
                                    textArea.style.opacity = '0';
                                    document.body.appendChild(textArea);
                                    textArea.select();
                                    try {
                                      document.execCommand('copy');
                                      setCopiedMessageId(index);
                                      setTimeout(() => {
                                        setCopiedMessageId(null);
                                      }, 2000);
                                    } catch (err2) {
                                      console.error('Fallback copy failed:', err2);
                                    }
                                    document.body.removeChild(textArea);
                                  });
                                }}
                                className="mt-3 px-3 py-1.5 rounded-md opacity-60 hover:opacity-100 transition-all bg-gray-800 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2 w-fit"
                                style={{ pointerEvents: 'auto' }}
                                title={copiedMessageId === index ? "✓ Copied!" : "Copy response"}
                                aria-label="Copy message"
                              >
                                {copiedMessageId === index ? (
                                  <>
                                    <Check className="w-4 h-4" strokeWidth={2.5} />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" strokeWidth={2} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            )}
                            {msg.metadata && (
                              <div className="mt-4 pt-4 border-t border-primary-border/30 dark:border-gray-700/30 flex gap-4 text-xs text-primary-textSecondary dark:text-gray-400">
                                {msg.metadata.latency && (
                                  <span className="flex items-center gap-1">
                                    <span>⏱</span>
                                    <span>{msg.metadata.latency.toFixed(2)}s</span>
                                  </span>
                                )}
                                {msg.metadata.language && (
                                  <span className="flex items-center gap-1">
                                    <span>🌐</span>
                                    <span>{msg.metadata.language.toUpperCase()}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {msg.role === 'user' && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-transparent flex items-center justify-center border-0 animate-float-avatar overflow-hidden">
                              <img
                                src="/ELEMENTS/DEVLOPER/icons8-user-100.png"
                                alt="User"
                                className="w-10 h-10 object-contain filter dark:invert"
                                draggable={false}
                              />
                            </div>
                          )}
                        </div>
                      </FadeInOnScroll>
                    );
                  })}
                  {loading && (
                    <div className="flex gap-4 justify-start max-w-4xl mx-auto animate-fade-in mt-12">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-transparent flex items-center justify-center border-0 animate-pulse-avatar overflow-hidden">
                        <img
                          src="/ELEMENTS/DEVLOPER/icons8-bot-64.png"
                          alt="Bot"
                          className="w-10 h-10 object-contain filter dark:invert"
                          draggable={false}
                        />
                      </div>
                      <div className="card p-5 border-2 border-primary-border dark:border-gray-700 animate-shimmer-border bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                          <TypingLoader />
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              LAW-GPT is typing
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form - Fixed at Bottom */}
            <div className="
              border-t-2 border-primary-border dark:border-gray-700 
              px-3 md:px-6 py-3 md:py-4 
              bg-background dark:bg-gray-900 
              transition-colors duration-300
              sticky bottom-0 z-40
              md:static
            ">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto w-full"
                noValidate
              >
                <div className="chat-input-container">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      // Auto-expand textarea
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onKeyDown={(e) => {
                      // Send on Enter, new line on Shift+Enter
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim() && !loading && formRef.current) {
                          formRef.current.requestSubmit();
                          // Height will reset automatically via useEffect when input is cleared
                        }
                      }
                    }}
                    placeholder={loading ? "Processing..." : "Ask your legal question... (Shift+Enter for new line)"}
                    className="chat-input-textarea"
                    disabled={loading}
                    rows={1}
                  />
                  <div className="flex gap-2 items-center">
                    {/* Web Search Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setWebSearchActive(!webSearchActive);
                        console.log('[WEB SEARCH] Toggle:', !webSearchActive);
                      }}
                      className={`px-4 md:px-6 py-3 md:py-4 rounded-lg font-medium transition-all flex items-center gap-1 md:gap-2 border-2 hover:scale-105 active:scale-95 relative overflow-hidden cursor-pointer flex-shrink-0 ${webSearchActive
                        ? 'bg-blue-600 border-blue-600 dark:bg-blue-700 dark:border-blue-700 text-white shadow-lg hover:opacity-90'
                        : 'border-primary-border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      title={webSearchActive ? "Deep Web Search: ON" : "Deep Web Search: OFF"}
                      aria-label="Toggle web search"
                      style={{ pointerEvents: 'auto', zIndex: 100, position: 'relative' }}
                    >
                      <img
                        src="/src/components/ui/world-wide-web.png"
                        alt="Web Search"
                        className={`w-4 h-4 object-contain pointer-events-none ${webSearchActive ? 'filter brightness-0 invert' : 'filter dark:invert'
                          }`}
                        draggable={false}
                      />
                      <span className="text-xs md:text-sm pointer-events-none hidden sm:inline">
                        {webSearchActive ? 'Web: ON' : 'Web'}
                      </span>
                    </button>
                    {/* Send or Stop Button */}
                    {loading ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Stop button clicked');
                          handleStop();
                        }}
                        className="px-4 md:px-6 py-3 md:py-4 bg-red-600 dark:bg-red-700 text-white rounded-lg font-medium hover:opacity-90 dark:hover:bg-red-600 transition-all flex items-center gap-1 md:gap-2 border-2 border-red-600 dark:border-red-700 hover:scale-105 active:scale-95 relative overflow-hidden cursor-pointer flex-shrink-0"
                        aria-label="Stop generation"
                        style={{ pointerEvents: 'auto', zIndex: 100, position: 'relative' }}
                      >
                        <Square className="w-4 h-4 pointer-events-none fill-current" />
                        <span className="text-xs md:text-sm pointer-events-none hidden sm:inline">Stop</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        disabled={loading || !input.trim()}
                        className="chat-send-button"
                        aria-label="Send message"
                        title="Send message (Enter)"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Collapsible */}
        <>
          {/* Mobile Backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            data-sidebar
            className={`
              fixed md:relative
              top-0 right-0 h-full
              border-l-2 border-primary-border dark:border-gray-700
              flex flex-col bg-background dark:bg-gray-900
              transition-all duration-300 ease-in-out z-50
              ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
              ${sidebarCollapsed ? 'md:w-0 md:border-l-0 md:overflow-visible' : 'md:w-[20rem]'}
            `}
            style={{
              width: sidebarOpen || !sidebarCollapsed ? '85vw' : '0',
              maxWidth: sidebarCollapsed ? '0' : '20rem'
            }}
          >
            {/* Sidebar Header - Always visible on desktop when collapsed */}
            <div className={`
              border-b-2 border-primary-border dark:border-gray-700 
              p-5 flex items-center justify-between
              transition-opacity duration-300
              ${sidebarCollapsed ? 'md:opacity-0 md:pointer-events-none md:w-0 md:p-0 md:border-0' : ''}
            `}>
              <h3 className="section-heading text-lg">
                Options
              </h3>
              <div className="flex items-center gap-2">
                {/* Desktop Collapse Toggle */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden md:flex w-8 h-8 rounded-lg border-2 border-primary-border dark:border-gray-700 hover:bg-primary-text/5 dark:hover:bg-gray-800 items-center justify-center transition-colors"
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {sidebarCollapsed ? (
                    <ChevronLeft className="w-4 h-4 text-primary-text dark:text-gray-300" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-primary-text dark:text-gray-300" />
                  )}
                </button>
                {/* Mobile Close Button */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden w-8 h-8 rounded-lg border-2 border-primary-border dark:border-gray-700 hover:bg-primary-text/5 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4 text-primary-text dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Expand Button - Visible only when collapsed on desktop */}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 w-10 h-16 rounded-l-lg border-2 border-l-0 border-primary-border dark:border-gray-700 bg-background dark:bg-gray-900 hover:bg-primary-text/5 dark:hover:bg-gray-800 items-center justify-center transition-colors z-50 shadow-lg"
                aria-label="Expand sidebar"
              >
                <ChevronLeft className="w-5 h-5 text-primary-text dark:text-gray-300" />
              </button>
            )}

            {/* Collapsible Content */}
            <div className={`
              flex-1 overflow-y-auto transition-opacity duration-300
              ${sidebarCollapsed ? 'md:opacity-0 md:pointer-events-none' : 'opacity-100'}
            `}>
              {/* Tabs - Dock Style */}
              <div className="border-b-2 border-primary-border dark:border-gray-700 py-3 bg-background dark:bg-gray-900">
                <Dock className="items-center justify-center" magnification={56} panelHeight={56} distance={100}>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <DockItem
                        key={tab.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (onTabChange) {
                            onTabChange(tab.id);
                          }
                          // Close sidebar on mobile after selection
                          if (window.innerWidth < 768) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={`aspect-square rounded-full transition-all min-w-[48px] ${isActive
                          ? 'bg-primary-text dark:bg-gray-700 shadow-lg'
                          : 'bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700'
                          }`}
                      >
                        <DockLabel>{tab.label}</DockLabel>
                        <DockIcon>
                          <Icon
                            className={`h-6 w-6 transition-transform ${isActive
                              ? 'text-background dark:text-gray-100'
                              : 'text-primary-text dark:text-gray-300'
                              }`}
                            style={{
                              animation: isActive ? 'spin-slow 3s linear infinite' : 'none'
                            }}
                          />
                        </DockIcon>
                      </DockItem>
                    );
                  })}
                </Dock>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'overview' && (
                  <div>
                    <h4 className="serif-font text-base mb-5">
                      Legal Categories
                    </h4>
                    <CategoryFilter onCategoryChange={onCategoryChange} />
                  </div>
                )}

                {activeTab === 'history' && (
                  <div>
                    <h4 className="serif-font text-base mb-4">
                      Query History
                    </h4>
                    <QueryHistory onRestoreQuery={handleRestoreQuery} />
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h4 className="serif-font text-base mb-5">
                      Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="label mb-2 block">Language Preference</label>
                        <select className="w-full px-4 py-3 border-2 border-primary-border dark:border-gray-700 rounded-card focus:outline-none focus:ring-2 focus:ring-primary-text/20 dark:focus:ring-gray-300/20 text-sm bg-background dark:bg-gray-800 text-primary-text dark:text-gray-100 transition-colors duration-300">
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
          </div>
        </>
      </div>
    </section>
  );
};

export default ChatInterface;
