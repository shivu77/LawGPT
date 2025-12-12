import React, { useRef, useEffect, useState } from 'react';

const FadeInOnScroll = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
      x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    },
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? variants.visible.opacity : variants.hidden.opacity,
        transform: isVisible
          ? `translate(${variants.visible.x}px, ${variants.visible.y}px) scale(${variants.visible.scale})`
          : `translate(${variants.hidden.x}px, ${variants.hidden.y}px) scale(${variants.hidden.scale})`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeInOnScroll;

