import React, { useState, useEffect, useRef } from 'react';
import { parseResponse, formatForDisplay } from '../utils/formatResponse';
import '../styles/LegalResponse.css';

/**
 * BotResponse Component
 * Renders bot responses with typing animation and structured formatting
 * Supports titles, headings, bullet points, and legal references
 */
const BotResponse = ({ content, title = null, question = '', speed = 30, onComplete }) => {
  const [structured, setStructured] = useState(null);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [titleTyped, setTitleTyped] = useState(false);
  const [titleWords, setTitleWords] = useState([]);
  const [completedSections, setCompletedSections] = useState([]);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  // Parse content when it changes
  useEffect(() => {
    if (content) {
      try {
        console.log('[BotResponse] Parsing content:', content.substring(0, 200));
        const parsed = parseResponse(content, question);
        console.log('[BotResponse] Parsed structure:', parsed);
        
        // Validate parsed structure
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid parsed structure');
        }
        
        // Ensure sections array exists
        if (!Array.isArray(parsed.sections)) {
          parsed.sections = [];
        }
        
        console.log('[BotResponse] Sections before normalization:', parsed.sections);
        
        // CRITICAL: Normalize all section content to prevent .join() errors
        parsed.sections = parsed.sections.map((section, idx) => {
          console.log(`[BotResponse] Normalizing section ${idx}:`, section.type, typeof section.content);
          
          // Professional format sections have HTML string content
          if (['answer', 'analysis', 'legal-basis', 'conclusion'].includes(section.type)) {
            return {
              ...section,
              content: typeof section.content === 'string' ? section.content : String(section.content || '')
            };
          }
          
          // Other sections should have array content
          if (!Array.isArray(section.content)) {
            // Convert non-array to array
            console.log(`[BotResponse] Converting non-array to array for section ${idx}`);
            return {
              ...section,
              content: section.content ? [String(section.content)] : ['']
            };
          }
          
          return section;
        });
        
        console.log('[BotResponse] Sections after normalization:', parsed.sections);
        
        // Use LLM-generated title from backend (if provided)
        const finalTitle = title !== undefined ? title : parsed.title;
        
        const finalParsed = { ...parsed, title: finalTitle };
        
        setStructured(finalParsed);
        setDisplayedContent('');
        setCurrentSectionIndex(0);
        setCurrentWordIndex(0);
        setTitleTyped(false);
        setTitleWords([]);
        setCompletedSections([]);
        setIsTyping(false); // DISABLE TYPING ANIMATION temporarily to isolate error
        setError(null);
        startTimeRef.current = Date.now();
      } catch (err) {
        console.error('[BotResponse ERROR]', err);
        console.error('[BotResponse ERROR Stack]', err.stack);
        setError(err.message || 'Failed to parse response');
        // Set fallback structured content
        setStructured({
          title: null,
          sections: [{
            type: 'paragraph',
            content: [content || 'An error occurred while displaying the response.']
          }]
        });
        setIsTyping(false);
      }
    }
  }, [content, question, title]);

  // Typing animation effect
  useEffect(() => {
    if (!structured || !isTyping) return;

    const sections = structured.sections || [];
    
    // Handle case with only title
    if (sections.length === 0 && structured.title && !titleTyped) {
      const title = structured.title;
      const words = title.split(/\s+/);
      
      if (titleWords.length < words.length) {
        timeoutRef.current = setTimeout(() => {
          const nextWord = words[titleWords.length];
          setTitleWords(prev => [...prev, nextWord]);
        }, speed * 2);
        
        return () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
      } else {
        // Title complete
        setTitleTyped(true);
        setIsTyping(false);
        if (onComplete) onComplete();
        return;
      }
    }
    
    // Type title first if it exists and sections are present
    if (structured.title && !titleTyped && sections.length > 0) {
      const title = structured.title;
      const words = title.split(/\s+/);
      
      if (titleWords.length < words.length) {
        timeoutRef.current = setTimeout(() => {
          const nextWord = words[titleWords.length];
          setTitleWords(prev => [...prev, nextWord]);
        }, speed * 2);
        
        return () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
      } else {
        setTitleTyped(true);
      }
    }

    if (currentSectionIndex >= sections.length) {
      // All sections complete
      setIsTyping(false);
      if (onComplete) onComplete();
      return;
    }

    const section = sections[currentSectionIndex];
    
    // Get text for this section
    let sectionText = '';
    if (section.type === 'heading') {
      sectionText = section.content[0] || '';
    } else if (section.type === 'list') {
      sectionText = section.content.join('. ');
    } else if (section.type === 'reference') {
      sectionText = section.content[0] || '';
    } else {
      sectionText = section.content.join(' ');
    }

    if (sectionText.trim()) {
      const words = sectionText.split(/\s+/);
      
      if (currentWordIndex < words.length) {
        const currentWord = words[currentWordIndex] || '';
        
        // Calculate delay: pause after punctuation
        let delay = speed * 2;
        if (currentWord.endsWith(',') || currentWord.endsWith(';')) {
          delay = speed * 2.5;
        } else if (currentWord.endsWith('.') || currentWord.endsWith('!') || currentWord.endsWith('?')) {
          delay = speed * 3.5; // Pause after sentences
        } else if (section.type === 'list') {
          delay = speed * 2.2; // Slightly faster for bullets
        }

        timeoutRef.current = setTimeout(() => {
          setDisplayedContent(prev => {
            const newContent = prev + (prev ? ' ' : '') + currentWord;
            setCurrentWordIndex(prev => prev + 1);
            return newContent;
          });
        }, delay);
      } else {
        // Section complete, move to next
        setCompletedSections(prev => [...prev, section]);
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentWordIndex(0);
        setDisplayedContent(prev => prev + '\n\n');
      }
    } else {
      // Empty section, skip it
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentWordIndex(0);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // Don't include displayedContent in dependencies - it causes infinite loop!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structured, isTyping, currentSectionIndex, currentWordIndex, speed, titleTyped, titleWords.length]);

  /**
   * Format section text for typing
   */
  const formatSectionText = (section) => {
    // Handle professional legal format sections (content is HTML string)
    if (['answer', 'analysis', 'legal-basis', 'conclusion'].includes(section.type)) {
      // Content is already a string (HTML), return as-is
      return typeof section.content === 'string' ? section.content : '';
    }
    
    // Handle other section types (content is array)
    if (section.type === 'heading') {
      return Array.isArray(section.content) ? (section.content[0] || '') : section.content || '';
    } else if (section.type === 'list') {
      // Format bullet points
      if (!Array.isArray(section.content)) return String(section.content || '');
      return section.content.map((item, idx) => {
        return `${idx + 1}. ${item}`;
      }).join(' ');
    } else if (section.type === 'reference') {
      return Array.isArray(section.content) ? (section.content[0] || '') : section.content || '';
    } else {
      // Paragraph
      if (!Array.isArray(section.content)) return String(section.content || '');
      return section.content.join(' ');
    }
  };

  /**
   * Render formatted content
   */
  const renderContent = () => {
    if (!structured) return null;

    // Build display content from completed sections + current typing section
    const sections = structured.sections || [];
    const displayParts = [];

    // Add title if exists
    if (structured.title) {
      displayParts.push(
        <h3 key="title" className="legal-title mb-4">
          {structured.title}
        </h3>
      );
    }

    // If typing is disabled, render ALL sections immediately
    if (!isTyping) {
      sections.forEach((section, idx) => {
        displayParts.push(renderSection(section, `section-${idx}`, false));
      });
      return <div className="response-content">{displayParts}</div>;
    }

    // Original typing animation logic (for when we re-enable it)
    // Render completed sections
    completedSections.forEach((section, idx) => {
      displayParts.push(renderSection(section, `completed-${idx}`));
    });

    // Render current typing section
    if (currentSectionIndex < sections.length && isTyping) {
      const currentSection = sections[currentSectionIndex];
      const sectionText = formatSectionText(currentSection);
      const words = sectionText.split(/\s+/);
      const typedText = words.slice(0, currentWordIndex).join(' ');

      if (typedText) {
        displayParts.push(renderSection({
          ...currentSection,
          _partialText: typedText
        }, `typing-${currentSectionIndex}`, true));
      }
    }

    return <div className="bot-response-content">{displayParts}</div>;
  };

  /**
   * Format text content (handle bold markers, etc.)
   */
  const formatText = (text) => {
    if (!text) return null;
    
    // Handle **bold** markers
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, idx) => {
      // Odd indices are bold content
      if (idx % 2 === 1) {
        return <strong key={idx} className="font-bold text-gray-900 dark:text-gray-100">{part}</strong>;
      }
      return part;
    });
  };

  /**
   * Render a section
   */
  const renderSection = (section, key, isTyping = false) => {
    // Professional legal format sections (with emojis)
    if (['answer', 'analysis', 'legal-basis', 'conclusion'].includes(section.type)) {
      const bgColors = {
        'answer': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        'analysis': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        'legal-basis': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        'conclusion': 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
      };
      
      return (
        <div key={key} className={`legal-section mb-6 p-4 rounded-lg border-l-4 ${bgColors[section.type]}`}>
          <h4 className="legal-section-heading text-lg font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">{section.emoji}</span>
            <span>{section.heading}</span>
          </h4>
          <div 
            className="legal-section-content prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
          {isTyping && <span className="typing-cursor">|</span>}
        </div>
      );
    }
    
    if (section.type === 'heading') {
      const content = section._partialText || 
        (Array.isArray(section.content) ? section.content[0] : section.content) || '';
      return (
        <h4 key={key} className="legal-heading mt-6 mb-3">
          {formatText(content)}
          {isTyping && <span className="typing-cursor">|</span>}
        </h4>
      );
    } else if (section.type === 'list') {
      const items = section._partialText 
        ? section._partialText.split(/\d+\.\s+/).filter(Boolean)
        : section.content;

      return (
        <ul key={key} className="legal-bullet-list mt-3 mb-4">
          {items.map((item, idx) => (
            <li key={idx} className="legal-bullet mb-2">
              {formatText(item)}
              {isTyping && idx === items.length - 1 && <span className="typing-cursor">|</span>}
            </li>
          ))}
        </ul>
      );
    } else if (section.type === 'reference') {
      const content = section._partialText || 
        (Array.isArray(section.content) ? section.content[0] : section.content) || '';
      return (
        <div key={key} className="legal-reference mt-4 mb-3 p-3 rounded border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          {formatText(content)}
          {isTyping && <span className="typing-cursor">|</span>}
        </div>
      );
    } else {
      // Paragraph
      const content = section._partialText || 
        (Array.isArray(section.content) ? section.content.join(' ') : String(section.content || ''));
      return (
        <p key={key} className="legal-body mb-4">
          {formatText(content)}
          {isTyping && <span className="typing-cursor">|</span>}
        </p>
      );
    }
  };

  // Show error state if parsing failed
  if (error) {
    return (
      <div className="bot-response">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
            ⚠️ Display Error
          </p>
          <p className="text-red-700 dark:text-red-300 text-sm mb-3">
            {error}
          </p>
          <div className="bg-white dark:bg-gray-800 p-3 rounded text-sm">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Raw Response:</p>
            <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {content}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!structured && !content) {
    return null;
  }

  // Fallback: if parsing fails, show plain text with typing
  if (!structured || (structured.sections && structured.sections.length === 0 && !structured.title)) {
    return (
      <div className="bot-response">
        <p className="legal-body">
          <TypingPlainText text={content} speed={speed} onComplete={onComplete} />
        </p>
      </div>
    );
  }

  try {
    return (
      <div className="bot-response">
        {renderContent()}
      </div>
    );
  } catch (renderError) {
    console.error('[Render ERROR]', renderError);
    return (
      <div className="bot-response">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-800 dark:text-yellow-200">
            ⚠️ An error occurred while displaying the response.
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
            {content}
          </p>
        </div>
      </div>
    );
  }
};

/**
 * Simple typing animation for plain text
 */
const TypingPlainText = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    setDisplayedText('');
    setCurrentIndex(0);

    const typeNext = () => {
      if (currentIndex < text.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(prev => {
            const nextChar = text[currentIndex];
            const newText = prev + nextChar;
            setCurrentIndex(prev => prev + 1);
            return newText;
          });
        }, speed);
      } else {
        if (onComplete) onComplete();
      }
    };

    typeNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, currentIndex, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && <span className="typing-cursor">|</span>}
    </span>
  );
};

export default BotResponse;

