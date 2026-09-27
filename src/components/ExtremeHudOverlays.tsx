import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Sliders, 
  Zap, 
  Crosshair,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export type HudTheme = 'cyan' | 'amber' | 'emerald' | 'crimson';

interface ExtremeHudOverlaysProps {
  currentTheme: HudTheme;
  onThemeChange: (theme: HudTheme) => void;
}

export const ExtremeHudOverlays: React.FC<ExtremeHudOverlaysProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const [clock, setClock] = useState('');
  const [millis, setMillis] = useState('000');
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [audioBars, setAudioBars] = useState<number[]>([12, 28, 45, 18, 62, 34, 50, 22]);

  // Live Military Digital Clock with Milliseconds
  useEffect(() => {
    let animId: number;
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setClock(`${h}:${m}:${s}`);
      setMillis(ms);
      animId = requestAnimationFrame(updateTime);
    };
    animId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Audio spectrum simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioBars(prev => prev.map(() => Math.floor(Math.random() * 48) + 8));
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const handleSelectTheme = (theme: HudTheme) => {
    soundFx.playLaserSweep();
    onThemeChange(theme);
  };

  const getThemeColorClass = () => {
    switch (currentTheme) {
      case 'amber':
        return 'text-amber-400 border-amber-500/50 shadow-amber-950/40';
      case 'emerald':
        return 'text-emerald-400 border-emerald-500/50 shadow-emerald-950/40';
      case 'crimson':
        return 'text-rose-400 border-rose-500/50 shadow-rose-950/40';
      default:
        return 'text-cyan-400 border-cyan-500/50 shadow-cyan-950/40';
    }
  };

  return (
    <>
      {/* Global CRT Phosphor Grid Overlay (Toggleable) */}
      {crtEnabled && (
        <div className="fixed inset-0 pointer-events-none z-50 crt-scanlines opacity-40 mix-blend-overlay"></div>
      )}

      {/* Floating Laser Sweep Beam that travels down the screen */}
      <div className="fixed inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none z-40 animate-scanline opacity-30"></div>

      {/* Left Viewport Edge Scale Ruler */}
      <div className="fixed left-1.5 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col items-center gap-6 font-mono-code text-[8px] text-cyan-500/40 pointer-events-none select-none">
        <span>00</span>
        <div className="h-6 w-0.5 bg-cyan-500/20"></div>
        <span>25</span>
        <div className="h-6 w-0.5 bg-cyan-500/20"></div>
        <span className="text-cyan-400 font-bold">50</span>
        <div className="h-6 w-0.5 bg-cyan-500/20"></div>
        <span>75</span>
        <div className="h-6 w-0.5 bg-cyan-500/20"></div>
        <span>100</span>
      </div>

      {/* Right Viewport Edge Scale Ruler */}
      <div className="fixed right-1.5 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col items-center gap-6 font-mono-code text-[8px] text-cyan-500/40 pointer-events-none select-none">
        <div className="w-2 h-0.5 bg-cyan-500/30"></div>
        <div className="w-1.5 h-0.5 bg-cyan-500/20"></div>
        <div className="w-2.5 h-0.5 bg-cyan-400"></div>
        <div className="w-1.5 h-0.5 bg-cyan-500/20"></div>
        <div className="w-2 h-0.5 bg-cyan-500/30"></div>
      </div>

      {/* FLOATING TACTICAL HUD DOCK (TOP/BOTTOM INTERACTIVE COCKPIT) */}
      <div className="fixed bottom-4 left-4 z-40 hidden lg:flex items-center gap-3">
        {/* Tactical Control Module */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#060a14]/90 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-xs font-mono-code text-slate-300 glow-cyan">
          
          {/* Live Military Time with Milliseconds */}
          <div className="flex items-center gap-1.5 pr-2.5 border-r border-cyan-950">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold font-display tracking-wider">
              {clock}<span className="text-[10px] text-cyan-500/80">.{millis}</span>
            </span>
          </div>

          {/* Audio Spectrum Graphic */}
          <div className="flex items-end gap-0.5 h-4.5 px-2 border-r border-cyan-950" title="Neural telemetry frequency">
            {audioBars.map((height, idx) => (
              <div
                key={idx}
                className="w-1 bg-cyan-400/80 rounded-t-sm transition-all duration-150"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>

          {/* Theme Palette Matrix Switcher */}
          <div className="flex items-center gap-1.5 px-2 border-r border-cyan-950">
            <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">MATRIX:</span>
            <button
              onClick={() => handleSelectTheme('cyan')}
              className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                currentTheme === 'cyan' 
                  ? 'bg-cyan-400 border-cyan-200 ring-2 ring-cyan-500/50 scale-110' 
                  : 'bg-cyan-900 border-cyan-700 opacity-60 hover:opacity-100'
              }`}
              title="Neon Cyber (Cyan)"
            />
            <button
              onClick={() => handleSelectTheme('amber')}
              className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                currentTheme === 'amber' 
                  ? 'bg-amber-400 border-amber-200 ring-2 ring-amber-500/50 scale-110' 
                  : 'bg-amber-900 border-amber-700 opacity-60 hover:opacity-100'
              }`}
              title="Deus Ex (Amber)"
            />
            <button
              onClick={() => handleSelectTheme('emerald')}
              className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                currentTheme === 'emerald' 
                  ? 'bg-emerald-400 border-emerald-200 ring-2 ring-emerald-500/50 scale-110' 
                  : 'bg-emerald-900 border-emerald-700 opacity-60 hover:opacity-100'
              }`}
              title="Matrix Protocol (Emerald)"
            />
            <button
              onClick={() => handleSelectTheme('crimson')}
              className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                currentTheme === 'crimson' 
                  ? 'bg-rose-500 border-rose-200 ring-2 ring-rose-500/50 scale-110' 
                  : 'bg-rose-950 border-rose-800 opacity-60 hover:opacity-100'
              }`}
              title="War Room Alert (Crimson)"
            />
          </div>

          {/* CRT Overlay Toggle */}
          <button
            onClick={() => {
              soundFx.playChirp(650);
              setCrtEnabled(prev => !prev);
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
              crtEnabled
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Toggle Holographic CRT Scanlines"
          >
            {crtEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-mono-code hidden sm:inline">CRT</span>
          </button>
        </div>
      </div>
    </>
  );
};
