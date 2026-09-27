import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  BrainCircuit, 
  Terminal, 
  ChevronRight, 
  Copy, 
  Check, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  Zap,
  Bot,
  Linkedin,
  Github
} from 'lucide-react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';
import { OWNER_EMAIL, getGmailComposeUrl } from '../utils/emailLinks';
import { HeroTelemetryCockpit } from './HeroTelemetryCockpit';
import { HoloNeuralCore } from './HoloNeuralCore';

interface HeroSectionProps {
  onOpenTerminal: () => void;
  onOpenAiChat?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTerminal, onOpenAiChat }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  const heroSubtitles = [
    "LEAD AUTHOR // INTELLIGENT UPI FRAUD & VPA VERIFICATION [APR 2026]",
    "BI-LSTM & XGBOOST MULTI-HAZARD EARLY WARNING [95% ACCURACY]",
    "AGRO-VISION & NATIVE KANNADA NLP PIPELINES [GCP DEPLOYED]",
    "ORACLE 2025 GENAI PROFESSIONAL // NPTEL CLOUD ELITE (TOP 5%)"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingIndex((prev) => (prev + 1) % heroSubtitles.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    soundFx.playSuccess();
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <section id="overview" className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Radial Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-20 right-10 w-[300px] h-[250px] bg-sky-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HUD Frame Container */}
        <div className="relative rounded-2xl border border-cyan-500/40 bg-[#070b16]/95 sm:bg-[#070b16]/85 backdrop-blur-none sm:backdrop-blur-md p-5 sm:p-8 md:p-12 shadow-2xl shadow-cyan-950/50 glow-cyan-lg overflow-hidden">
          {/* Extreme Hazard Caution Chevrons Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 hazard-stripes-cyan opacity-80"></div>
          
          {/* Subtle Cyber Scanline Bar */}
          <div className="absolute top-1.5 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          
          {/* Top Decorative HUD Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>

          {/* Header Tagline & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cyan-950/80 mt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>NEURAL IDENTITY // PORTFOLIO PROTOCOL</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono-code text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                PEER REVIEW VERIFIED
              </span>
              <span>•</span>
              <span className="text-cyan-400">BE AI & ML (2023–2027)</span>
            </div>
          </div>

          {/* Main Grid: Info + Holographic Telemetry Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-center">
            
            {/* Left Column: Headline, Bio & Primary CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
                <div>
                  <p className="text-xs font-mono-code tracking-widest text-cyan-400 uppercase mb-2 flex items-center gap-2">
                    <span className="w-2 h-0.5 bg-cyan-400"></span>
                    // APPLIED MACHINE LEARNING & RESEARCH PORTFOLIO
                  </p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-100 tracking-tight leading-none hover-cyber-glitch cursor-default transition-all">
                    SAIPRAKASH <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 neon-text-cyan">
                      KULKARNI
                    </span>
                  </h1>
                </div>

                {/* 3D Interactive Holographic Neural Core */}
                <div className="self-center sm:self-start py-2 sm:py-0">
                  <HoloNeuralCore onInteract={() => onOpenTerminal()} />
                </div>
              </div>

              {/* Dynamic Decrypting Subtitle Box */}
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2 text-cyan-200 font-mono-code text-xs sm:text-sm">
                <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
                <span className="truncate">{heroSubtitles[typingIndex]}</span>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans-modern">
                {PERSONAL_INFO.bio}
              </p>

              {/* Coordinates & Contact Pills */}
              <div className="flex flex-wrap gap-2.5 pt-1 text-xs font-mono-code">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Bengaluru, India</span>
                </div>

                <div className="inline-flex items-center rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-slate-300 transition-colors overflow-hidden">
                  <a
                    href={getGmailComposeUrl({ to: OWNER_EMAIL, subject: 'Inquiry for Saiprakash Kulkarni' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playChirp(720)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer"
                    title={`Send Email via Gmail (To: ${OWNER_EMAIL})`}
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{OWNER_EMAIL}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-500 hover:text-cyan-300" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(OWNER_EMAIL, 'email')}
                    className="px-2 py-1.5 border-l border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Copy email address"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(SOCIAL_LINKS.phone, 'phone')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  title="Click to copy phone number"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{SOCIAL_LINKS.phone}</span>
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                </button>
              </div>

              {/* Social Profiles: LinkedIn & GitHub below Location, Email & Phone */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-code">
                <a
                  href="https://www.linkedin.com/in/saiprakash-kulkarni/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playChirp(750)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-800/60 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 transition-all cursor-pointer group shadow-sm"
                  title="Visit Saiprakash's LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="font-semibold tracking-wide">LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>

                <a
                  href="https://github.com/saiprakashkulkarni1111"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playChirp(750)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-800/60 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 transition-all cursor-pointer group shadow-sm"
                  title="Visit Saiprakash's GitHub"
                >
                  <Github className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="font-semibold tracking-wide">GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>
              </div>

              {/* Availability Notice */}
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-start sm:items-center gap-2.5 text-xs font-mono-code text-cyan-200">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  Available for <strong className="text-cyan-300">Machine Learning Engineer</strong>, <strong className="text-cyan-300">Software Development Engineer</strong>, <strong className="text-cyan-300">Data Analyst</strong>, <strong className="text-cyan-300">Data Engineer</strong>, <strong className="text-cyan-300">Forward Deployed Engineer</strong> & <strong className="text-cyan-300">AI Researcher</strong> opportunities.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#research"
                  onClick={() => soundFx.playChirp(700)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-display font-semibold text-sm tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                >
                  <span>EXPLORE UPI RESEARCH</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#interactive-labs"
                  onClick={() => soundFx.playChirp(800)}
                  className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-display font-medium text-sm tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                  <span>LAUNCH SIMULATOR LABS</span>
                </a>

                {onOpenAiChat && (
                  <button
                    onClick={() => {
                      soundFx.playChirp(890);
                      onOpenAiChat();
                    }}
                    title="Ask AI Copilot"
                    aria-label="Ask AI Copilot"
                    className="p-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: High-Tech Telemetry Cockpit */}
            <div className="lg:col-span-5">
              <HeroTelemetryCockpit
                onOpenAiChat={onOpenAiChat}
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
