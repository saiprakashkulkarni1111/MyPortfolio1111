/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { ParticleCanvas } from './components/ParticleCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { UpiSecuritySimulator } from './components/UpiSecuritySimulator';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { SkillsRadarMatrix } from './components/SkillsRadarMatrix';
import { TimelineEducation } from './components/TimelineEducation';
import { ContactTransmissionHub } from './components/ContactTransmissionHub';
import { Footer } from './components/Footer';
import { FuturisticTerminal } from './components/FuturisticTerminal';
import { ResumeModal } from './components/ResumeModal';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { AiChatSidebar } from './components/AiChatSidebar';
import { ExtremeHudOverlays, HudTheme } from './components/ExtremeHudOverlays';
import { soundFx } from './utils/soundEffects';

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [hudTheme, setHudTheme] = useState<HudTheme>('cyan');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'research', 'projects', 'skills', 'timeline', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 cyber-grid">
      {/* Extreme Viewport Tactical HUD Frame & Controls */}
      <ExtremeHudOverlays 
        currentTheme={hudTheme}
        onThemeChange={setHudTheme}
      />

      {/* Scroll Progress Indicator Bar */}
      <ScrollProgressBar />

      {/* Background Neural Constellation Canvas (Paused when modal/drawer is open to eliminate lag) */}
      <ParticleCanvas isPaused={Boolean(terminalOpen || resumeOpen || aiChatOpen)} />

      {/* Main HUD Interface */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenTerminal={() => setTerminalOpen(true)}
          onOpenResume={() => setResumeOpen(true)}
          onOpenAiChat={() => setAiChatOpen(true)}
          activeSection={activeSection}
        />

        <main className="flex-1">
          <HeroSection 
            onOpenTerminal={() => setTerminalOpen(true)}
            onOpenAiChat={() => setAiChatOpen(true)}
          />

          <UpiSecuritySimulator />

          <ProjectsShowcase />

          <SkillsRadarMatrix />

          <TimelineEducation />

          <ContactTransmissionHub />
        </main>

        <Footer />
      </div>

      {/* Floating AI Copilot Trigger Button (Bottom Right) - Logo Only */}
      {!aiChatOpen && (
        <button
          onClick={() => {
            soundFx.playChirp(880);
            setAiChatOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          title="Ask AI Copilot"
          aria-label="Ask AI Copilot"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
          </div>
        </button>
      )}

      {/* Interactive Overlays */}
      <FuturisticTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onOpenResume={() => {
          setTerminalOpen(false);
          setResumeOpen(true);
        }}
        onOpenAiChat={() => {
          setTerminalOpen(false);
          setAiChatOpen(true);
        }}
      />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />

      {/* AI Chatbot Sidebar */}
      <AiChatSidebar
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />
    </div>
  );
}
