import React from 'react';
import { FileText, Sparkles, Cpu, Bot } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface NavbarProps {
  onOpenTerminal: () => void;
  onOpenResume: () => void;
  onOpenAiChat: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenResume,
  onOpenAiChat,
  activeSection
}) => {
  const navLinks = [
    { label: 'OVERVIEW', href: '#overview', id: 'overview' },
    { label: 'RESEARCH (UPI)', href: '#research', id: 'research' },
    { label: 'PROJECTS', href: '#projects', id: 'projects' },
    { label: 'SKILLS RADAR', href: '#skills', id: 'skills' },
    { label: 'EXPERIENCE & CERTS', href: '#timeline', id: 'timeline' },
    { label: 'TRANSMISSION', href: '#contact', id: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#07090e]/85 border-b border-cyan-950/60 shadow-lg shadow-black/40">
      {/* Top Telemetry Micro-Bar */}
      <div className="hidden sm:flex justify-between items-center px-4 py-1.5 text-[11px] font-mono-code text-cyan-400/90 border-b border-cyan-950/40 bg-cyan-950/25 tracking-wider">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            SYS.STATUS: ONLINE
          </span>
          <span className="text-slate-500">|</span>
          <span>NODE: BENGALURU, INDIA</span>
          <span className="text-slate-500">|</span>
          <span>LATENCY: 12ms</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold text-[11px] tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.5)] opacity-100">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <Sparkles className="w-3 h-3 text-cyan-300" />
            <span>NEURAL ACTIVE</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium">ARCHETYPE: AI/ML RESEARCHER</span>
        </div>
      </div>

      {/* Primary HUD Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand identity */}
        <a 
          href="#overview" 
          onClick={() => soundFx.playChirp(720)}
          className="flex items-center gap-3 group text-left"
        >
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-transparent border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
          </div>
          <div>
            <div className="font-display font-bold tracking-widest text-slate-100 text-sm sm:text-base group-hover:text-cyan-300 transition-colors">
              SAIPRAKASH KULKARNI
            </div>
            <div className="text-[10px] font-mono-code text-cyan-400/70 tracking-widest">
              AI & ML ENGINEER // DEEP LEARNING
            </div>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => soundFx.playChirp(600)}
              className={`px-3 py-1.5 rounded text-xs font-mono-code tracking-wider transition-all duration-200 ${
                activeSection === link.id
                  ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Copilot Button - Logo Only */}
          <button
            onClick={() => {
              soundFx.playChirp(880);
              onOpenAiChat();
            }}
            title="Ask AI Copilot"
            aria-label="Ask AI Copilot"
            className="p-2 sm:p-2.5 rounded-lg border border-cyan-500/60 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] flex items-center justify-center"
          >
            <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
          </button>

          {/* Resume Viewer Button */}
          <button
            onClick={() => {
              soundFx.playChirp(900);
              onOpenResume();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-semibold text-xs tracking-wider transition-all duration-200 shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>VIEW CV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
