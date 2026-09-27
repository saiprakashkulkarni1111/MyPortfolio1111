import React from 'react';
import { ArrowUp, Cpu, Mail, ExternalLink } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { PERSONAL_INFO } from '../data/portfolioData';
import { OWNER_EMAIL, getGmailComposeUrl } from '../utils/emailLinks';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundFx.playChirp(750);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-cyan-950/80 bg-[#060810] py-12 relative z-10 text-xs font-mono-code text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display font-bold text-slate-200 text-sm tracking-wider">
              {PERSONAL_INFO.name}
            </div>
            <div className="text-[10px] text-cyan-400/80">
              AI & MACHINE LEARNING ENGINEER // BENGALURU NODE
            </div>
          </div>
        </div>

        {/* Status / Location / Email Link */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <div>RESEARCH // INTELLIGENT RECIPIENT VERIFICATION & EARLY WARNING SYSTEMS</div>
          <div className="flex items-center justify-center gap-2">
            <span>DIRECT INBOX:</span>
            <a 
              href={getGmailComposeUrl({ to: OWNER_EMAIL, subject: 'Inquiry for Saiprakash Kulkarni' })}
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => soundFx.playChirp(720)}
              className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1 font-medium transition-colors"
              title={`Open Gmail with To: ${OWNER_EMAIL}`}
            >
              <Mail className="w-3 h-3" />
              <span>{OWNER_EMAIL}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Back to top */}
        <div className="flex items-center gap-4">
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

      </div>
    </footer>
  );
};
