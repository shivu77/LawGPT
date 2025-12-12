import React, { useState, useEffect, useRef } from 'react';

/**
 * Typing Text Animation Component
 * Creates a typing effect that reveals text character by character or word by word
 * Supports formatted content with pauses
 */
const TypingText = ({ 
  text, 
  speed = 100, 
  className = '',
  onComplete,
  showCursor = true,
  startDelay = 0,
  loop = true,
  loopDelay = 2000,
  wordByWord = false // New: type word by word instead of character by character
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const loopTimeoutRef = useRef(null);
  
  // For word-by-word typing
  const words = wordByWord && text ? text.split(/\s+/) : [];
  const currentWordIndex = wordByWord ? Math.floor(currentIndex / 2) : currentIndex; // Divide by 2 for word-by-word spacing

  useEffect(() => {
    if (text && text.length > 0) {
      const delay = setTimeout(() => {
        setIsTyping(true);
        setIsDeleting(false);
        setDisplayedText('');
        setCurrentIndex(0);
      }, startDelay);

      return () => clearTimeout(delay);
    }
  }, [text, startDelay]);

  useEffect(() => {
    if (!isTyping) return;

    if (wordByWord && words.length > 0) {
      // Word-by-word typing
      if (currentWordIndex < words.length && !isDeleting) {
        const currentWord = words[currentWordIndex];
        // Calculate delay: pause after punctuation
        let delay = speed * 2; // Slower for word-by-word
        if (currentWord.endsWith(',') || currentWord.endsWith(';')) {
          delay = speed * 3;
        } else if (currentWord.endsWith('.') || currentWord.endsWith('!') || currentWord.endsWith('?')) {
          delay = speed * 4; // Longer pause after sentences
        }
        
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + (prev ? ' ' : '') + currentWord);
          setCurrentIndex(prev => prev + 2); // Increment by 2 for word-by-word
        }, delay);

        return () => clearTimeout(timeout);
      } else if (currentWordIndex >= words.length && !isDeleting) {
        // Finished typing all words
        if (loop) {
          const waitTimeout = setTimeout(() => {
            setIsDeleting(true);
          }, loopDelay);

          return () => clearTimeout(waitTimeout);
        } else {
          setIsTyping(false);
          if (onComplete) {
            onComplete();
          }
        }
      }
    } else {
      // Character-by-character typing (original behavior)
      if (isTyping && !isDeleting && currentIndex < text.length) {
        // Typing forward
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timeout);
      } else if (isTyping && !isDeleting && currentIndex >= text.length) {
        // Finished typing, wait then start deleting if loop is enabled
        if (loop) {
          const waitTimeout = setTimeout(() => {
            setIsDeleting(true);
          }, loopDelay);

          return () => clearTimeout(waitTimeout);
        } else {
          setIsTyping(false);
          if (onComplete) {
            onComplete();
          }
        }
      }
    }

    // Handle deletion (for both word-by-word and character-by-character)
    if (isTyping && isDeleting && displayedText.length > 0) {
      // Deleting backward
      const timeout = setTimeout(() => {
        if (wordByWord) {
          // Remove last word
          const textParts = displayedText.split(/\s+/);
          textParts.pop();
          setDisplayedText(textParts.join(' '));
          setCurrentIndex(prev => Math.max(0, prev - 2));
        } else {
          setDisplayedText(prev => prev.slice(0, -1));
          setCurrentIndex(prev => Math.max(0, prev - 1));
        }
      }, wordByWord ? speed : speed / 2); // Delete faster for character-by-character

      return () => clearTimeout(timeout);
    } else if (isTyping && isDeleting && displayedText.length === 0) {
      // Finished deleting, restart typing
      setIsDeleting(false);
      setCurrentIndex(0);
    }
  }, [isTyping, isDeleting, currentIndex, text, speed, onComplete, loop, loopDelay, displayedText]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span 
          className="inline-block w-[2px] h-[1em] bg-current ml-1 animate-pulse"
          style={{ animation: 'blink 1s infinite' }}
        >
          |
        </span>
      )}
    </span>
  );
};

export default TypingText;

