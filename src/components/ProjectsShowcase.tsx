import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Layers, 
  Cpu, 
  ArrowUpRight, 
  CheckCircle, 
  Activity, 
  Radio, 
  Sprout,
  Sparkles
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { FloodWarningSimulator } from './FloodWarningSimulator';
import { KisanMitraInspector } from './KisanMitraInspector';
import { ProjectCodePreview } from './ProjectCodePreview';
import { ProjectHoloTiltCard } from './ProjectHoloTiltCard';
import { soundFx } from '../utils/soundEffects';

interface ProjectsShowcaseProps {}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = () => {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'mhews' | 'kisan'>('mhews');

  return (
    <section id="projects" className="py-16 md:py-24 border-t border-cyan-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code mb-3">
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>KEY ENGINEERING DEPLOYMENTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-100 tracking-tight">
              Featured Deep Learning Projects
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans-modern mt-1 max-w-2xl">
              End-to-end engineered machine learning systems deployed on cloud infrastructure, solving real-world hydrological disasters and agrarian challenges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={() => soundFx.playChirp(720)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-900/60 hover:border-cyan-400 text-cyan-300 font-mono-code text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Request Source / Demos</span>
            </a>
          </div>
        </div>

        {/* Deep Dive Project Cards Grid with 3D Holographic Tilt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {PROJECTS_DATA.map((project) => (
            <ProjectHoloTiltCard key={project.id}>
              <div className="space-y-5">
                
                {/* Project Header & Timeline */}
                <div className="flex items-start justify-between gap-2 border-b border-cyan-950 pb-4">
                  <div>
                    <span className="text-[11px] font-mono-code text-cyan-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mt-0.5">
                      {project.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-cyan-900/60 text-[11px] font-mono-code text-cyan-300 whitespace-nowrap shadow-sm">
                    {project.timeline}
                  </span>
                </div>

                {/* Tagline */}
                <p className="text-slate-300 text-sm sm:text-base font-sans-modern leading-relaxed">
                  {project.tagline}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-cyan-950 text-center">
                      <div className="text-[10px] font-mono-code text-slate-400 uppercase">{m.label}</div>
                      <div className="text-base font-display font-bold text-cyan-300 mt-0.5">{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Verbatim Resume Bullet Points */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-xs font-mono-code text-cyan-400/90 uppercase tracking-wider">
                    Core Technical Accomplishments:
                  </div>
                  {project.bulletPoints.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans-modern">
                      <span className="text-cyan-400 font-bold mt-1">▹</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {project.technologies.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 font-mono-code text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expandable Model Architecture Code Preview */}
                {project.codeSnippet && (
                  <ProjectCodePreview
                    snippet={project.codeSnippet}
                    projectTitle={project.title}
                  />
                )}

              </div>

              {/* Bottom Card Action */}
              <div className="pt-6 mt-6 border-t border-cyan-950/80 flex items-center justify-between text-xs font-mono-code">
                <span className="text-slate-500">SYSTEM STATUS: FULLY PROTOTYPED</span>
                <a
                  href="#interactive-labs"
                  onClick={() => {
                    soundFx.playChirp(700);
                    setActiveInteractiveTab(project.id === 'kisan-mitra' ? 'kisan' : 'mhews');
                  }}
                  className="text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <span>Launch Live Simulator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </ProjectHoloTiltCard>
          ))}
        </div>

        {/* SECTION: LIVE INTERACTIVE LABS */}
        <div id="interactive-labs" className="pt-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-mono-code text-xs">
                <Cpu className="w-4 h-4 animate-pulse" />
                <span>EXPERIENCE LIVE TELEMETRY SIMULATIONS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-100 mt-1">
                Interactive Project Testing Grounds
              </h3>
            </div>

            {/* Simulator Switcher Buttons */}
            <div className="flex p-1 rounded-xl bg-slate-900 border border-cyan-950 text-xs font-mono-code">
              <button
                onClick={() => { soundFx.playChirp(600); setActiveInteractiveTab('mhews'); }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  activeInteractiveTab === 'mhews'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Smart Flood (MHEWS)</span>
              </button>
              <button
                onClick={() => { soundFx.playChirp(600); setActiveInteractiveTab('kisan'); }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  activeInteractiveTab === 'kisan'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Kisan Mitra (Agro-Vision)</span>
              </button>
            </div>
          </div>

          {/* Active Interactive Lab */}
          {activeInteractiveTab === 'mhews' ? (
            <FloodWarningSimulator />
          ) : (
            <KisanMitraInspector />
          )}
        </div>

      </div>
    </section>
  );
};
