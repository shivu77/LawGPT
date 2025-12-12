import React from 'react';

const StaggeredContainer = ({ children, className = '', staggerDelay = 0.1 }) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className} style={{ pointerEvents: 'auto' }}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="animate-fade-in-up"
          style={{
            animationDelay: `${index * staggerDelay}s`,
            animationFillMode: 'both',
            pointerEvents: 'auto',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default StaggeredContainer;

