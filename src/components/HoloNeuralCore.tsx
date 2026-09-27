import React, { useEffect, useRef, useState } from 'react';
import { Crosshair } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface HoloNeuralCoreProps {
  onInteract?: () => void;
}

export const HoloNeuralCore: React.FC<HoloNeuralCoreProps> = ({ onInteract }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect mobile device
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    let animId: number;
    let angleX = 0;
    let angleY = 0;

    // 3D Icosahedron / Neural Node Vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawNodes = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    // Scale nodes
    const nodeScale = isMobile ? 26 : 30;
    const nodes = rawNodes.map(([x, y, z]) => [x * nodeScale, y * nodeScale, z * nodeScale]);

    // Edges connecting nodes
    const maxDist = isMobile ? 65 : 72;
    const edges: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDist) {
          edges.push([i, j]);
        }
      }
    }

    // Set canvas dimensions once (no per-frame reallocations)
    const size = isMobile ? 100 : 120;
    canvas.width = size;
    canvas.height = size;
    const w = size;
    const h = size;
    const cx = w / 2;
    const cy = h / 2;

    // Pause animation when offscreen via IntersectionObserver
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      observer = new IntersectionObserver((entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true;
      }, { threshold: 0.1 });
      observer.observe(containerRef.current);
    }

    let lastTime = performance.now();
    const frameInterval = isMobile ? 1000 / 40 : 1000 / 60; // 40fps on mobile for battery & CPU cooling

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      // Skip render if tab hidden or scrolled out of view
      if (document.hidden || !isVisibleRef.current) {
        return;
      }

      // Throttle frame rate on mobile
      const elapsed = now - lastTime;
      if (isMobile && elapsed < frameInterval) {
        return;
      }
      lastTime = now - (elapsed % frameInterval);

      ctx.clearRect(0, 0, w, h);

      // Rotate nodes in 3D
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected = nodes.map(([x, y, z]) => {
        // Rotate around Y
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotate around X
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Perspective projection
        const fov = 150;
        const scale = fov / (fov + z2 + 75);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          pz: z2,
          scale
        };
      });

      // Draw wireframe connecting edges
      ctx.lineWidth = isMobile ? 1.0 : 1.2;
      for (let e = 0; e < edges.length; e++) {
        const [i, j] = edges[e];
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.pz + p2.pz) / 2;
        const alpha = Math.max(0.18, Math.min(0.85, (avgZ + 45) / 90));

        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      // Draw glowing vertices (nodes) WITHOUT expensive shadowBlur
      for (let p = 0; p < projected.length; p++) {
        const pt = projected[p];
        const radius = Math.max(1.2, 2.8 * pt.scale);

        // Soft glow halo (hardware accelerated 2D circles, 0 blur GPU overhead)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, radius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Solid crisp center
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center glowing neural singularity (pre-calculated radial gradient)
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, isMobile ? 16 : 20);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
      grad.addColorStop(0.6, 'rgba(6, 182, 212, 0.2)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, isMobile ? 16 : 20, 0, Math.PI * 2);
      ctx.fill();

      angleX += 0.010;
      angleY += 0.014;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      if (observer) observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    soundFx.playLaserSweep();
    if (onInteract) onInteract();
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center select-none cursor-pointer group"
      onClick={handleClick}
      onMouseEnter={() => {
        soundFx.playChirp(920);
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      title="Interactive 3D Neural Core [Tap to open terminal]"
    >
      {/* Outer Rotating Counter-Gyro Ring (Shown on tablet/desktop, hidden on small mobile to eliminate CPU churn) */}
      <div className="hidden sm:block absolute w-34 h-34 rounded-full border border-dashed border-cyan-500/30 animate-[spin_20s_linear_infinite] group-hover:border-cyan-400 transition-all pointer-events-none">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-mono-code text-cyan-400 bg-[#070b16] px-1">000°</div>
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 text-[8px] font-mono-code text-cyan-400 bg-[#070b16] px-1">090°</div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono-code text-cyan-400 bg-[#070b16] px-1">180°</div>
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 text-[8px] font-mono-code text-cyan-400 bg-[#070b16] px-1">270°</div>
      </div>

      {/* Middle Rotating Clockwise Accent Ring */}
      <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-t-cyan-400 border-r-transparent border-b-cyan-500/30 border-l-transparent animate-[spin_10s_linear_infinite] opacity-70 pointer-events-none"></div>

      {/* Inner Hologram Frame */}
      <div className={`relative w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-[#050914]/95 border border-cyan-500/50 shadow-lg shadow-cyan-950/60 flex items-center justify-center transition-transform ${
        isHovered ? 'scale-105 border-cyan-300' : ''
      }`}>
        {/* 3D Wireframe Canvas */}
        <canvas ref={canvasRef} className="w-[90px] h-[90px] sm:w-[105px] sm:h-[105px] block pointer-events-none" />

        {/* Central Crosshair Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 group-hover:opacity-80 transition-opacity">
          <Crosshair className="w-5 h-5 text-cyan-300" />
        </div>
      </div>

      {/* Telemetry Badge */}
      <div className="absolute -bottom-3 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/50 text-[8px] sm:text-[9px] font-mono-code text-cyan-300 font-bold tracking-wider shadow-sm flex items-center gap-1 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
        <span>NEURAL_CORE</span>
      </div>
    </div>
  );
};
