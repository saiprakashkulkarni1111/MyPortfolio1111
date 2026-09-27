import React, { useState } from 'react';
import { 
  Binary, 
  BrainCircuit, 
  Database, 
  Code2, 
  BarChart3, 
  Sparkles, 
  Search, 
  CheckCircle, 
  Cpu,
  Globe2
} from 'lucide-react';
import { SKILL_CATEGORIES, LANGUAGES_DATA, SOFT_SKILLS } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

export const SkillsRadarMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSkill, setActiveSkill] = useState<{
    name: string;
    level: number;
    badge?: string;
    description: string;
    usedIn: string[];
    category: string;
  } | null>(null);

  const allSkills = SKILL_CATEGORIES.flatMap(cat => 
    cat.skills.map(s => ({ ...s, category: cat.category }))
  );

  const filteredSkills = allSkills.filter(s => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.usedIn.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSelectSkill = (skill: typeof allSkills[0]) => {
    soundFx.playChirp(720);
    setActiveSkill(skill);
  };

  return (
    <section id="skills" className="py-16 md:py-24 border-t border-cyan-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code mb-3">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>TECHNICAL CAPABILITIES MATRIX</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-100 tracking-tight">
              Neural Skills Radar & Telemetry
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans-modern mt-1 max-w-2xl">
              Comprehensive proficiency map across modern deep learning frameworks, statistical data pipelines, and core computer science fundamentals.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              placeholder="Search skill, project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-cyan-900/60 text-slate-200 font-mono-code text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['ALL', 'ML / AI & LLMs', 'Programming Languages', 'Analytics & Data Science', 'Core Fundamentals & Systems'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playChirp(600);
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/80 border border-cyan-950 text-slate-400 hover:border-cyan-900 hover:text-slate-200'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Interactive Skills Grid (Full Width, Intuitive & Clean) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
          {filteredSkills.map((skill) => {
            const isSelected = activeSkill?.name === skill.name;
            return (
              <div
                key={skill.name}
                onClick={() => handleSelectSkill(isSelected ? (null as any) : skill)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-[#090d18] border-cyan-950/80 hover:border-cyan-500/50 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display font-semibold text-slate-100 text-sm">{skill.name}</div>
                      <div className="text-[10px] font-mono-code text-cyan-400 mt-0.5">{skill.category}</div>
                    </div>
                    {skill.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                        {skill.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-sans-modern mt-2.5 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>

                  {/* If clicked, show applied projects inline */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-cyan-900/60 space-y-1.5 animate-in fade-in duration-200">
                      <div className="text-[10px] font-mono-code text-cyan-300 uppercase font-semibold">Applied In:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.usedIn.map((item, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-[10px] font-mono-code text-slate-200 px-2 py-0.5 rounded bg-slate-950 border border-cyan-900/50">
                            <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono-code text-slate-400">
                    <span>Proficiency</span>
                    <span className="text-cyan-300 font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Natural Languages & Soft Skills Engineering Matrix (Full Width) */}
        <div className="mt-12 p-6 rounded-2xl border border-cyan-950 bg-[#070b16]/95 space-y-5">
          <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
            <span className="text-xs font-mono-code text-cyan-400 flex items-center gap-2 font-bold tracking-wider">
              <Globe2 className="w-4 h-4" />
              COMMUNICATION MATRIX & CORE ATTRIBUTES
            </span>
            <span className="text-[10px] font-mono-code text-slate-500">GLOBAL COLLABORATION</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Natural Languages */}
            <div className="lg:col-span-6 space-y-2">
              <div className="text-[11px] font-mono-code text-slate-400 uppercase">Spoken & Written Languages:</div>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES_DATA.map((lang) => (
                  <div key={lang.name} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div className="text-[10px] font-mono-code text-cyan-400 font-bold">{lang.code}</div>
                    <div className="text-xs font-display font-semibold text-slate-200 mt-0.5">{lang.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono-code mt-0.5">{lang.level}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills & Professional Attributes */}
            <div className="lg:col-span-6 space-y-2">
              <div className="text-[11px] font-mono-code text-slate-400 uppercase">Professional & Collaborative Strengths:</div>
              <div className="flex flex-wrap gap-2">
                {SOFT_SKILLS.map((sk) => (
                  <span key={sk} className="px-3 py-1.5 rounded-lg bg-slate-950/80 text-cyan-200 font-mono-code text-xs border border-cyan-950 hover:border-cyan-500/40 transition-colors">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
