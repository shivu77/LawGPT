import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

/**
 * Container Scroll Animation Component
 * Creates a scroll-based 3D animation effect
 * Based on Aceternity UI Container Scroll Animation with proper physics
 */
export const ContainerScroll = ({
  titleComponent,
  children,
  scrollContainerRef,
}) => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Calculate scroll progress based on container position within scroll container
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current;
    const container = containerRef.current;
    if (!scrollContainer || !container) return;

    const updateScrollProgress = () => {
      const scrollTop = scrollContainer.scrollTop;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const viewportHeight = scrollContainer.clientHeight;
      
      // Calculate container center and viewport center
      const containerCenter = containerTop + (containerHeight / 2);
      const viewportCenter = scrollTop + (viewportHeight / 2);
      
      // Calculate distance from container center to viewport center
      const distance = containerCenter - viewportCenter;
      
      // Animation range: viewport height + container height for smooth transition
      // This ensures animation starts before container enters and ends after it exits
      const animationRange = viewportHeight + containerHeight;
      
      // Progress calculation (physics-based):
      // When distance = 0 (centered): progress = 1 → rotate = 0deg (straight)
      // When distance = ±animationRange (far): progress = 0 → rotate = 20deg (bent)
      // Progress linearly interpolates between 0 and 1 based on distance
      const normalizedDistance = Math.abs(distance) / animationRange;
      
      // Clamp and invert: distance of 0 → progress 1, distance of animationRange → progress 0
      const progress = Math.max(0, Math.min(1, 1 - normalizedDistance));
      
      // Set the motion value (Framer Motion's useTransform will handle smooth interpolation)
      scrollYProgress.set(progress);
    };

    // Use requestAnimationFrame for smooth updates
    let rafId = null;
    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateScrollProgress();
          rafId = null;
        });
      }
    };

    // Initial calculation
    updateScrollProgress();

    // Listen to scroll events
    scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    
    // Also listen to resize to recalculate
    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateScrollProgress();
      }, 100);
    };
    window.addEventListener('resize', onResize);

    return () => {
      scrollContainer.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimeout);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [scrollContainerRef, scrollYProgress]);

  // Use Framer Motion's useTransform for smooth, physics-based animations
  // Maps scroll progress (0-1) to rotation (20deg to 0deg)
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  
  // Scale: desktop [1.05, 1], mobile [0.7, 0.9]
  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  
  // Translate: [0, -100]
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[40rem] md:h-[50rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children,
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        translateY: translate,
        transformStyle: 'preserve-3d',
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-primary-border dark:border-gray-700 p-2 md:p-6 bg-white dark:bg-gray-900 rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
