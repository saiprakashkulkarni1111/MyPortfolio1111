import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Play, CornerDownLeft, Sparkles, Shield, Cpu } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { PERSONAL_INFO, SOCIAL_LINKS, PROJECTS_DATA, PUBLICATION_DATA } from '../data/portfolioData';
import { downloadResumeDoc, printResumeDoc } from '../utils/resumeDocument';
import { OWNER_EMAIL, getGmailComposeUrl, getMailtoUrl } from '../utils/emailLinks';

interface FuturisticTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  onOpenAiChat?: () => void;
}

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export const FuturisticTerminal: React.FC<FuturisticTerminalProps> = ({
  isOpen,
  onClose,
  onOpenResume,
  onOpenAiChat
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: 'sys.init',
      output: (
        <div className="text-cyan-300 space-y-1">
          <div>KULKARNI.AI NEURAL CLI [VERSION 3.8.2]</div>
          <div>BENGALURU AI/ML RESEARCH NODE ONLINE.</div>
          <div className="text-slate-400 text-xs">Type <span className="text-cyan-400 font-bold">'help'</span> or tap chips below to query the researcher's knowledge base.</div>
        </div>
      )
    }
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Body scroll lock and ESC listener
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (cmdText: string) => {
    soundFx.playChirp(700);
    const trimmed = cmdText.trim().toLowerCase();
    let response: React.ReactNode = null;

    if (!trimmed) return;

    switch (trimmed) {
      case 'help':
        response = (
          <div className="space-y-1 text-slate-300">
            <div className="text-cyan-400 font-bold">AVAILABLE COMMANDS:</div>
            <div>• <span className="text-cyan-300">bio</span> - Personal & academic background summary</div>
            <div>• <span className="text-cyan-300">research</span> - Read details of April 2026 UPI Security paper</div>
            <div>• <span className="text-cyan-300">projects</span> - View Kisan Mitra & Smart Flood MHEWS telemetry</div>
            <div>• <span className="text-cyan-300">skills</span> - List deep learning frameworks & programming tools</div>
            <div>• <span className="text-cyan-300">certs</span> - List Oracle GenAI, NPTEL Top 5%, IBM accreditations</div>
            <div>• <span className="text-cyan-300">contact</span> - Display email, phone, and secure transmission lines</div>
            <div>• <span className="text-cyan-300">cv</span> - Open formatted resume document</div>
            <div>• <span className="text-cyan-300">ai</span> - Launch Gemini-powered AI Research Copilot</div>
            <div>• <span className="text-cyan-300">clear</span> - Clear terminal window</div>
          </div>
        );
        break;

      case 'bio':
      case 'about':
        response = (
          <div className="space-y-1.5 text-slate-300">
            <div className="text-cyan-400 font-bold">{PERSONAL_INFO.name} — {PERSONAL_INFO.role}</div>
            <div>{PERSONAL_INFO.bio}</div>
            <div className="text-xs text-slate-400">Node: {PERSONAL_INFO.location}</div>
          </div>
        );
        break;

      case 'research':
      case 'paper':
      case 'upi':
        response = (
          <div className="space-y-2 text-slate-300">
            <div className="text-cyan-400 font-bold">PUBLICATION: {PUBLICATION_DATA.title}</div>
            <div className="text-xs text-slate-400">{PUBLICATION_DATA.role} • {PUBLICATION_DATA.location} • {PUBLICATION_DATA.date}</div>
            <p className="text-xs">{PUBLICATION_DATA.abstract}</p>
            <div className="text-emerald-400 text-xs">Aligned with Reserve Bank of India (RBI) cybersecurity mandates.</div>
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="space-y-3 text-slate-300">
            {PROJECTS_DATA.map((p) => (
              <div key={p.id} className="border-l-2 border-cyan-500 pl-2">
                <div className="text-cyan-300 font-bold">{p.title}</div>
                <div className="text-xs text-slate-400">{p.tagline}</div>
                <div className="text-xs text-cyan-400/90 mt-1">Tech: {p.technologies.join(', ')}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="space-y-1.5 text-slate-300">
            <div><span className="text-cyan-400 font-bold">Languages:</span> Python, SQL (MySQL), Java, HTML, CSS</div>
            <div><span className="text-cyan-400 font-bold">ML/AI & LLMs:</span> PyTorch, SBERT, OpenCV, Scikit-learn, Bi-LSTM, XGBoost, Gemini, Claude, Prompt Engineering</div>
            <div><span className="text-cyan-400 font-bold">Analytics:</span> Pandas, NumPy, Matplotlib, Seaborn, Tableau, Power BI</div>
            <div><span className="text-cyan-400 font-bold">Systems:</span> DSA, OOP, Operating Systems, DBMS, GCP</div>
          </div>
        );
        break;

      case 'certs':
      case 'certifications':
        response = (
          <div className="space-y-1.5 text-slate-300">
            <div>• <span className="text-cyan-300">Oracle Cloud Infrastructure 2025</span> - Certified Generative AI Professional</div>
            <div>• <span className="text-cyan-300">NPTEL Cloud Computing</span> - Elite + Top 5% Distinction</div>
            <div>• <span className="text-cyan-300">IBM</span> - AI Fundamentals Accredited</div>
            <div>• <span className="text-cyan-300">Google Community</span> - Agentic AI Day Volunteer</div>
            <div>• <span className="text-cyan-300">HCLTech</span> - Campus Ambassador</div>
          </div>
        );
        break;

      case 'contact':
        response = (
          <div className="space-y-1.5 text-slate-300">
            <div>
              <span className="text-cyan-400 font-bold">Primary Email: </span>
              <span className="text-slate-100 font-mono-code">{OWNER_EMAIL}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs pt-0.5">
              <a 
                href={getGmailComposeUrl({ to: OWNER_EMAIL, subject: 'Inquiry for Saiprakash Kulkarni' })} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:text-white hover:bg-cyan-900/60 transition-colors"
              >
                [Launch Gmail Compose (To: {OWNER_EMAIL})]
              </a>
              <a 
                href={getMailtoUrl({ to: OWNER_EMAIL, subject: 'Inquiry for Saiprakash Kulkarni' })} 
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                [Default Mail App]
              </a>
            </div>
            <div>Phone: <a href={`tel:${SOCIAL_LINKS.phone}`} className="text-cyan-400 underline">{SOCIAL_LINKS.phone}</a></div>
            <div>LinkedIn: {SOCIAL_LINKS.linkedin}</div>
            <div>GitHub: {SOCIAL_LINKS.github}</div>
            <div>Location: {SOCIAL_LINKS.location}</div>
          </div>
        );
        break;

      case 'email':
      case 'mail':
      case 'gmail':
        response = (
          <div className="space-y-1.5 text-slate-300">
            <div className="text-emerald-400 font-bold">Uplink target: {OWNER_EMAIL} (Default recipient)</div>
            <p className="text-xs text-slate-400">Opening compose window with default recipient set to Saiprakash...</p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <a 
                href={getGmailComposeUrl({ to: OWNER_EMAIL, subject: 'Inquiry for Saiprakash Kulkarni' })} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <span>OPEN IN GMAIL NOW (TO: {OWNER_EMAIL})</span>
              </a>
              <a 
                href={getMailtoUrl({ to: OWNER_EMAIL, subject: 'Inquiry for Saiprakash Kulkarni' })} 
                className="px-3 py-1 rounded bg-slate-900 border border-cyan-800/80 text-cyan-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>NATIVE MAIL APP</span>
              </a>
            </div>
          </div>
        );
        break;

      case 'cv':
      case 'resume':
        onOpenResume();
        response = <div className="text-emerald-400">Opening formatted CV viewer window...</div>;
        break;

      case 'download':
        downloadResumeDoc();
        response = <div className="text-emerald-400">Transmitting ATS-formatted resume document to local storage... Download initiated.</div>;
        break;

      case 'print':
      case 'pdf':
        printResumeDoc();
        response = <div className="text-emerald-400">Launching browser print dialogue for Saiprakash_Kulkarni_Resume...</div>;
        break;

      case 'ai':
      case 'chat':
      case 'ask':
      case 'gemini':
      case 'copilot':
        if (onOpenAiChat) {
          onOpenAiChat();
          response = <div className="text-cyan-300">Launching Gemini 3.8 Flash AI Research Copilot sidebar...</div>;
        } else {
          response = <div className="text-amber-300">AI Copilot module is ready.</div>;
        }
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        response = (
          <div className="text-rose-400">
            Unknown command: "{trimmed}". Type <span className="text-cyan-300 font-bold">'help'</span> for a list of valid commands.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: cmdText, output: response }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    }
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
        className="relative w-full max-w-3xl rounded-2xl border border-cyan-800/80 bg-[#070b14] shadow-2xl flex flex-col h-[88vh] max-h-[640px] overflow-hidden select-text text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-slate-950 border-b border-cyan-950 text-xs font-mono-code text-cyan-400">
          <div className="flex items-center gap-2 min-w-0">
            <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="font-bold truncate">KULKARNI-CLI // NEURAL CONSOLE</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                soundFx.playChirp(600);
                onClose();
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Chips: single row scroll on mobile to save vertical screen space */}
        <div className="flex items-center sm:flex-wrap gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#090e1c] border-b border-cyan-950 text-xs font-mono-code overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="text-slate-500 text-[10px] mr-1 flex-shrink-0">CMDS:</span>
          {['help', 'bio', 'research', 'projects', 'skills', 'certs', 'contact', 'email', 'cv', 'ai', 'clear'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleCommand(cmd)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 text-slate-300 text-[11px] cursor-pointer transition-colors flex-shrink-0"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Screen / Output Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-mono-code text-xs sm:text-sm">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400/80">
                <span className="text-emerald-400">saiprakash@neural:~$</span>
                <span className="text-slate-100 font-semibold">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Input Prompt */}
        <div className="px-4 py-3 bg-slate-950 border-t border-cyan-950 flex items-center gap-2">
          <span className="text-emerald-400 font-mono-code text-xs sm:text-sm font-bold">
            saiprakash@neural:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help'..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono-code text-xs sm:text-sm placeholder:text-slate-600"
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
