import React, { useEffect } from 'react';
import { X, Printer, Download, Mail, Phone, ExternalLink, FileCheck } from 'lucide-react';
import { PERSONAL_INFO, SOCIAL_LINKS, PUBLICATION_DATA, PROJECTS_DATA, SKILL_CATEGORIES, EDUCATION_DATA, QUALIFICATIONS_DATA, LANGUAGES_DATA } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';
import { downloadResumeDoc, printResumeDoc } from '../utils/resumeDocument';
import { OWNER_EMAIL, getGmailComposeUrl } from '../utils/emailLinks';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  // Prevent background scroll and support ESC key
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundFx.playChirp(700);
    printResumeDoc();
  };

  const handleDownload = () => {
    soundFx.playSuccess();
    downloadResumeDoc();
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFx.playChirp(600);
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 select-none animate-in fade-in duration-150"
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-4xl rounded-2xl border border-cyan-800/80 bg-[#090d18] shadow-2xl flex flex-col h-[92vh] max-h-[860px] overflow-hidden select-text text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-950 border-b border-cyan-950 text-xs font-mono-code text-cyan-400">
          <div className="flex items-center gap-2 min-w-0">
            <FileCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 hidden sm:block" />
            <span className="font-bold truncate max-w-[130px] sm:max-w-none">RESUME // SAIPRAKASH</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              title="Download ATS-Friendly Resume HTML/Document"
              className="px-2 sm:px-3 py-1.5 rounded-lg border border-cyan-500/60 bg-cyan-950/70 text-cyan-300 font-bold flex items-center gap-1 hover:bg-cyan-900/60 hover:text-cyan-200 transition-colors cursor-pointer text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DOWNLOAD DOC</span>
              <span className="sm:hidden">DOC</span>
            </button>
            <button
              onClick={handlePrint}
              title="Print or Save as PDF"
              className="px-2 sm:px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center gap-1 hover:bg-cyan-400 transition-colors cursor-pointer text-xs shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PRINT / PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={() => {
                soundFx.playChirp(600);
                onClose();
              }}
              title="Close (ESC)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document with Native Momentum Scroll */}
        <div 
          className="flex-1 p-5 sm:p-8 md:p-10 overflow-y-auto bg-[#070a12] text-slate-200 font-sans-modern space-y-6 text-left"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* Header */}
          <div className="text-center border-b border-cyan-950/80 pb-5 space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-100 tracking-wider">
              SAIPRAKASH KULKARNI
            </h1>
            <p className="text-xs sm:text-sm font-mono-code text-cyan-400">
              Bengaluru, India
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-mono-code text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                {SOCIAL_LINKS.phone}
              </span>
              <span>•</span>
              <a
                href={getGmailComposeUrl({ to: OWNER_EMAIL, subject: 'Interview / Role Opportunity for Saiprakash' })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playChirp(720)}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
                title={`Open Gmail with To: ${OWNER_EMAIL}`}
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                {OWNER_EMAIL}
              </a>
              <span>•</span>
              <a 
                href={SOCIAL_LINKS.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                LinkedIn
              </a>
              <span>•</span>
              <a 
                href={SOCIAL_LINKS.github} 
                target="_blank" 
                rel="noreferrer" 
                className="text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* PUBLICATION */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono-code text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-950 pb-1">
              PUBLICATION
            </div>
            <div>
              <div className="flex flex-wrap justify-between items-start gap-1">
                <div className="font-bold text-slate-100 text-sm sm:text-base">
                  {PUBLICATION_DATA.title}
                </div>
                <div className="text-xs font-mono-code text-slate-400">
                  {PUBLICATION_DATA.location} • {PUBLICATION_DATA.date}
                </div>
              </div>
              <div className="text-xs font-mono-code text-cyan-400/90 font-medium mt-0.5">
                {PUBLICATION_DATA.role}
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pt-1.5">
                {PUBLICATION_DATA.highlights.map((h, idx) => (
                  <li key={idx} className="leading-relaxed">{h}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* PROJECTS */}
          <div className="space-y-3.5">
            <div className="text-xs font-mono-code text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-950 pb-1">
              PROJECTS
            </div>
            {PROJECTS_DATA.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex flex-wrap justify-between items-start gap-1">
                  <div className="font-bold text-slate-100 text-sm sm:text-base">
                    {proj.title}
                  </div>
                  <div className="text-xs font-mono-code text-slate-400">
                    {proj.timeline}
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {proj.bulletPoints.map((b, idx) => (
                    <li key={idx} className="leading-relaxed">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* TECHNICAL SKILLS */}
          <div className="space-y-2">
            <div className="text-xs font-mono-code text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-950 pb-1">
              TECHNICAL SKILLS
            </div>
            <div className="space-y-1 text-xs text-slate-300 font-mono-code">
              <div>
                <strong className="text-slate-100">Programming Languages:</strong> Python, SQL (MySQL), HTML, CSS, Java
              </div>
              <div>
                <strong className="text-slate-100">Analytics:</strong> Pandas, NumPy, Matplotlib, CVA, Tableau, Power BI, Statistical Analysis
              </div>
              <div>
                <strong className="text-slate-100">Core Fundamentals:</strong> Data Structure & Algorithm, OOP, Operating System, DBMS, Microsoft Office Suite (Excel, Word, PowerPoint)
              </div>
              <div>
                <strong className="text-slate-100">ML/AI & LLMs:</strong> PyTorch, OpenCV, Scikit-learn, NLP, Seaborn, Claude, Gemini, Prompt Engineering
              </div>
            </div>
          </div>

          {/* EDUCATION */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono-code text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-950 pb-1">
              EDUCATION
            </div>
            <div className="space-y-2.5 text-xs">
              {EDUCATION_DATA.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-100">{edu.institution}</div>
                    <div className="text-slate-300">{edu.degree} in {edu.field}, {edu.score}</div>
                  </div>
                  <div className="text-right font-mono-code text-slate-400">
                    <div>{edu.location}</div>
                    <div>{edu.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ADDITIONAL QUALIFICATIONS */}
          <div className="space-y-2">
            <div className="text-xs font-mono-code text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-950 pb-1">
              ADDITIONAL QUALIFICATIONS
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div>
                <strong className="text-slate-100 font-mono-code">Certifications:</strong> Oracle Cloud Infrastructure 2025 Certified Generative AI Professional, NPTEL Cloud Computing (Elite + Top 5%), AI Fundamentals by IBM
              </div>
              <div>
                <strong className="text-slate-100 font-mono-code">Leadership & Activities:</strong> Google Agentic AI Day (Volunteer), HCLTech Campus Ambassador, Sports
              </div>
              <div>
                <strong className="text-slate-100 font-mono-code">Soft Skills:</strong> Critical Thinking, Problem-Solving, Leadership, Teamwork, Communication, Stress Management
              </div>
              <div>
                <strong className="text-slate-100 font-mono-code">Languages:</strong> English (Fluent), Kannada (Native), Hindi (Limited)
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
