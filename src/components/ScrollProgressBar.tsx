import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-cyan-950/40 pointer-events-none" 
      role="progressbar" 
      aria-valuenow={Math.round(scrollProgress)} 
      aria-valuemin={0} 
      aria-valuemax={100}
      aria-label="Page reading progress"
    >
      <div 
        className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-[width] duration-75 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8),0_0_20px_rgba(56,189,248,0.5)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
