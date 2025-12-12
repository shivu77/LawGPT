import React, { useState, useRef } from 'react';

const FloatingCard = ({ children, className = '' }) => {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    // Don't interfere with button clicks - only transform on non-interactive areas
    const target = e.target;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setTransform({
      rotateX: rotateX * 0.5,
      rotateY: rotateY * 0.5,
      scale: 1.05,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
};

export default FloatingCard;

