import React, { useState, useRef, useCallback } from 'react';
import { soundFx } from '../utils/soundEffects';

interface ProjectHoloTiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const ProjectHoloTiltCard: React.FC<ProjectHoloTiltCardProps> = ({
  children,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply dynamic 3D tilt calculations on pointer/mouse devices, never touch/mobile
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
      return;
    }
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (range approximately -8.5 to +8.5 degrees)
    const rotX = ((y - centerY) / centerY) * -8.5;
    const rotY = ((x - centerX) / centerX) * 8.5;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotX, rotY });
    setGlarePos({ x: glareX, y: glareY });
  }, []);

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
      return;
    }
    soundFx.playChirp(700);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotX: 0, rotY: 0 });
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <div
      className="relative [perspective:1200px] w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={`relative rounded-2xl border border-cyan-500/30 bg-[#070b16]/95 p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all overflow-hidden ${
          isHovered ? 'border-cyan-400/90 glow-cyan-lg' : 'hover:border-cyan-500/50'
        } ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `perspective(1200px) rotateX(${tilt.rotX.toFixed(2)}deg) rotateY(${tilt.rotY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025) translateY(-4px)`
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)',
          transition: isHovered
            ? 'transform 0.09s ease-out, border-color 0.2s ease, box-shadow 0.2s ease'
            : 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s ease, box-shadow 0.4s ease'
        }}
      >
        {/* Holographic Cursor-Following Radial Glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl z-30 transition-opacity duration-200"
          style={{
            opacity: isHovered ? 0.85 : 0,
            background: `radial-gradient(circle 360px at ${glarePos.x}% ${glarePos.y}%, rgba(6, 182, 212, 0.22), rgba(56, 189, 248, 0.12) 35%, transparent 70%)`,
            mixBlendMode: 'screen'
          }}
        />

        {/* Dynamic Holographic Iridescent Prism Sheen */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl z-20 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `linear-gradient(${(glarePos.x * 2.8 + glarePos.y).toFixed(0)}deg, rgba(6, 182, 212, 0.18) 0%, rgba(16, 185, 129, 0.15) 45%, rgba(56, 189, 248, 0.15) 100%)`,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Holographic Fine-Grid Texture floating layer */}
        <div 
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 z-10 crt-scanlines"
          style={{
            transform: isHovered ? 'translateZ(6px)' : 'translateZ(0px)',
            transition: 'transform 0.3s ease'
          }}
        />

        {/* Corner Tech Floating Accents (High Z-Index & Depth) */}
        <div 
          className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-40 transition-transform duration-200"
          style={{ transform: isHovered ? 'translateZ(26px)' : 'translateZ(0px)' }}
        />
        <div 
          className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-40 transition-transform duration-200"
          style={{ transform: isHovered ? 'translateZ(26px)' : 'translateZ(0px)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-40 transition-transform duration-200"
          style={{ transform: isHovered ? 'translateZ(26px)' : 'translateZ(0px)' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-40 transition-transform duration-200"
          style={{ transform: isHovered ? 'translateZ(26px)' : 'translateZ(0px)' }}
        />

        {/* Top Laser Scanline Bar */}
        <div 
          className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-40 transition-all duration-300"
          style={{ 
            opacity: isHovered ? 1 : 0.45,
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)'
          }}
        />

        {/* Card Content with 3D Layer Separation */}
        <div 
          className="relative z-20 flex flex-col justify-between h-full"
          style={{ 
            transform: isHovered ? 'translateZ(14px)' : 'translateZ(0px)',
            transition: 'transform 0.2s ease-out'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
