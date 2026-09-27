import React, { useState } from 'react';
import { 
  Radio, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck,
  MessageSquare,
  ExternalLink,
  Terminal,
  RefreshCw,
  Clock,
  ArrowRight,
  SendHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';
import { OWNER_EMAIL, getGmailComposeUrl, getMailtoUrl } from '../utils/emailLinks';

interface TransmissionReceipt {
  transmissionId: string;
  timestamp: string;
  senderName: string;
  senderEmail: string;
  category: string;
  message: string;
  gmailUrl: string;
  mailtoUrl: string;
  payloadString: string;
}

export const ContactTransmissionHub: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Internships');
  const [customCategory, setCustomCategory] = useState('');
  const [message, setMessage] = useState('');
  
  // Transmission state
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [receipt, setReceipt] = useState<TransmissionReceipt | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const copyContact = (val: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(val);
    soundFx.playSuccess();
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !message || isTransmitting) return;

    setIsTransmitting(true);
    soundFx.playChirp(700, 0.08, 'sawtooth', 0.04);

    const categoryText = inquiryType === 'Other' ? (customCategory || 'Other Inquiry') : inquiryType;
    const recipient = 'saiprakashkulkarni494@gmail.com';
    const fallbackId = `TRX-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    }) + ' IST';

    let confirmedId = fallbackId;

    // 1. Asynchronous server dispatch to record transmission
    try {
      const response = await fetch('/api/transmit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: senderName || 'Recruiter / Researcher',
          senderEmail,
          inquiryType: categoryText,
          message,
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.transmissionId) {
          confirmedId = data.transmissionId;
        }
      }
    } catch {
      // Graceful offline / low-internet resilience: local fallback receipt generated
      console.warn('[Transmission] Offline buffer mode activated.');
    }

    // 2. Build email payloads with unencoded literal recipient to prevent Gmail composer from dropping the To: field
    const rawSubject = `[Portfolio Transmission] ${categoryText} - from ${senderName || 'Recruiter'}`;
    const rawBody = `Greetings Saiprakash,\n\n${message}\n\n========================================\nTRANSMISSION METADATA:\n• Sender Name: ${senderName || 'Recruiter / Researcher'}\n• Sender Email: ${senderEmail}\n• Inquiry Category: ${categoryText}\n• Transmission ID: ${confirmedId}\n• Recipient: ${OWNER_EMAIL}\n• Telemetry Node: Saiprakash Kulkarni AI & ML Portfolio\n========================================`;

    const directGmailUrl = getGmailComposeUrl({
      to: OWNER_EMAIL,
      subject: rawSubject,
      body: rawBody
    });

    const mailtoUrl = getMailtoUrl({
      to: OWNER_EMAIL,
      subject: rawSubject,
      body: rawBody
    });

    const newReceipt: TransmissionReceipt = {
      transmissionId: confirmedId,
      timestamp: formattedDate,
      senderName: senderName || 'Recruiter / Researcher',
      senderEmail,
      category: categoryText,
      message,
      gmailUrl: directGmailUrl,
      mailtoUrl,
      payloadString: `To: ${OWNER_EMAIL}\nSubject: ${rawSubject}\n\n${rawBody}`,
    };

    setReceipt(newReceipt);
    setIsTransmitting(false);

    soundFx.playSuccess();
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.75 },
      colors: ['#06b6d4', '#38bdf8', '#10b981']
    });
  };

  const copyReceiptPayload = () => {
    if (!receipt) return;
    navigator.clipboard.writeText(receipt.payloadString);
    soundFx.playSuccess();
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  const resetTransmission = () => {
    soundFx.playChirp(600, 0.05, 'sine');
    setReceipt(null);
    setMessage('');
    setCustomCategory('');
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-cyan-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code mb-3">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>DIRECT COMMUNICATIONS & TRANSMISSION NODE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-100 tracking-tight">
            Transmission Hub & Inquiries
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-sans-modern mt-1 max-w-2xl">
            Reach Saiprakash Kulkarni directly for AI/ML Engineering roles, applied NLP research collaborations, or speaking engagements.
          </p>
        </div>

        {/* Grid: Coordinates & Telemetry Cards + Message Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Links & Coordinates */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Primary Channel Card */}
            <div className="p-6 rounded-2xl border border-cyan-900/50 bg-[#090d18] space-y-5">
              <div className="text-xs font-mono-code text-cyan-400 uppercase tracking-widest border-b border-cyan-950 pb-2">
                TRANSMISSION CHANNELS
              </div>

              {/* Email Transmission Node */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-900/60 hover:border-cyan-500/50 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono-code text-cyan-400 font-semibold tracking-wider">
                        OFFICIAL INBOX (OWNER)
                      </div>
                      <div className="text-xs sm:text-sm font-mono-code text-slate-100 font-medium">
                        {OWNER_EMAIL}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyContact(OWNER_EMAIL, 'email')}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
                    title="Copy Email Address"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
                  <a
                    href={getGmailComposeUrl({
                      to: OWNER_EMAIL,
                      subject: 'Inquiry for Saiprakash Kulkarni'
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playChirp(720)}
                    className="py-2 px-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white text-[11px] font-mono-code font-semibold flex items-center justify-center gap-1.5 transition-all group cursor-pointer"
                    title="Opens Gmail composer with To: saiprakashkulkarni494@gmail.com"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Open in Gmail</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-300" />
                  </a>

                  <a
                    href={getMailtoUrl({
                      to: OWNER_EMAIL,
                      subject: 'Inquiry for Saiprakash Kulkarni'
                    })}
                    onClick={() => soundFx.playChirp(720)}
                    className="py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[11px] font-mono-code flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Opens Default Mail Client with To: saiprakashkulkarni494@gmail.com"
                  >
                    <SendHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mail Client</span>
                  </a>
                </div>
              </div>

              {/* Phone Button */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono-code text-slate-400">PHONE DIRECT</div>
                    <a 
                      href={`tel:${SOCIAL_LINKS.phone}`}
                      className="text-xs sm:text-sm font-mono-code text-slate-200 hover:text-cyan-300 transition-colors"
                    >
                      {SOCIAL_LINKS.phone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyContact(SOCIAL_LINKS.phone, 'phone')}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
                  title="Copy Phone"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Location Node */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-slate-400">LOCATION NODE</div>
                  <div className="text-xs sm:text-sm font-mono-code text-slate-200">
                    {SOCIAL_LINKS.location}
                  </div>
                </div>
              </div>

              {/* Social Portals */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playChirp(650)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center gap-2 text-xs font-mono-code text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 text-cyan-400" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playChirp(650)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center gap-2 text-xs font-mono-code text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* Quick Status Tag - Full Opportunity Spectrum */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-start gap-3 text-xs font-mono-code text-cyan-300">
              <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Available for <strong className="text-cyan-200">Machine Learning Engineer</strong>, <strong className="text-cyan-200">Software Development Engineer</strong>, <strong className="text-cyan-200">Data Analyst</strong>, <strong className="text-cyan-200">Data Engineer</strong>, <strong className="text-cyan-200">Forward Deployed Engineer</strong> & <strong className="text-cyan-200">AI Researcher</strong> opportunities.
              </span>
            </div>

          </div>

          {/* Right Column: Transmission Composer / Beautiful Dispatch Station */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-cyan-900/50 bg-[#090d18] shadow-2xl space-y-6 relative overflow-hidden">
              
              {/* Top Status Bar */}
              <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
                <span className="text-xs font-mono-code text-cyan-400 flex items-center gap-1.5 font-bold tracking-wide">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  DISPATCH TRANSMISSION PAYLOAD
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono-code text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  UPLINK ACTIVE
                </span>
              </div>

              {!receipt ? (
                /* Transmission Input Form */
                <form onSubmit={handleTransmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-code text-slate-300 mb-1">
                        Your Identity / Name <span className="text-rose-400 font-bold">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Ramesh / Technical Recruiter"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-cyan-900/60 text-slate-200 font-sans-modern text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-code text-slate-300 mb-1">
                        Your Contact Email <span className="text-rose-400 font-bold">*</span>:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="recruiter@enterprise.com"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-cyan-900/60 text-slate-200 font-mono-code text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">
                      Transmission Subject Category <span className="text-rose-400 font-bold">*</span>:
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-cyan-900/60 text-slate-200 font-mono-code text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="Internships">Internships</option>
                      <option value="Full-Time AI/ML Role">Full-Time AI / Machine Learning Role</option>
                      <option value="Software Development Role">Software Development Engineer (SDE) Role</option>
                      <option value="Data Engineering & Analytics">Data Analyst / Data Engineer Role</option>
                      <option value="Forward Deployed Engineer">Forward Deployed Engineer Role</option>
                      <option value="Research Collaboration">Academic / Industrial Research Collaboration</option>
                      <option value="Technical Mentorship">Campus Ambassador & Technical Mentorship</option>
                      <option value="Other">Other (Custom Subject)</option>
                    </select>
                  </div>

                  {/* If Other is selected, prompt user to write the category text */}
                  {inquiryType === 'Other' && (
                    <div className="animate-in fade-in duration-200">
                      <label className="block text-xs font-mono-code text-cyan-300 mb-1">
                        Please Specify Subject Category <span className="text-rose-400 font-bold">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter custom category / subject..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-cyan-400 text-slate-200 font-mono-code text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono-code text-slate-300">
                        Transmission Message <span className="text-rose-400 font-bold">*</span>:
                      </label>
                      <span className="text-[10px] font-mono-code text-slate-500">
                        {message.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your role opportunity, research proposal, or discussion topic..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-cyan-900/60 text-slate-200 font-sans-modern text-xs focus:outline-none focus:border-cyan-400 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isTransmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isTransmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>ESTABLISHING ENCRYPTED UPLINK...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>DISPATCH TRANSMISSION TO SAIPRAKASH</span>
                      </>
                    )}
                  </button>

                  <div className="pt-1">
                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-cyan-950/80"></div>
                      <span className="text-[10px] font-mono-code text-slate-500 uppercase tracking-wider">or compose directly</span>
                      <div className="flex-1 h-px bg-cyan-950/80"></div>
                    </div>

                    <a
                      href={getGmailComposeUrl({
                        to: OWNER_EMAIL,
                        subject: `Inquiry: ${inquiryType === 'Other' ? (customCategory || 'General Inquiry') : inquiryType}${senderName ? ` - ${senderName}` : ''}`,
                        body: message ? `Greetings Saiprakash,\n\n${message}\n\nSender: ${senderName || 'Visitor'}\nContact: ${senderEmail || 'Not specified'}` : `Greetings Saiprakash,\n\n`
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFx.playChirp(720)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-800/60 hover:border-cyan-400 text-cyan-300 font-mono-code text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group shadow-sm"
                      title={`Open Gmail with To: ${OWNER_EMAIL}`}
                    >
                      <Mail className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>Open Directly in Gmail (To: {OWNER_EMAIL})</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
                    </a>
                  </div>
                </form>
              ) : (
                /* Beautiful Cyberpunk Transmission Dispatch Station */
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  
                  {/* Status Banner */}
                  <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono-code space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-200 font-bold text-xs sm:text-sm">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>TRANSMISSION ENCRYPTED & LOGGED</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded">
                        {receipt.transmissionId}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300/90 leading-relaxed">
                      Payload buffered. In your Gmail composer, the destination <strong className="text-white underline decoration-emerald-400">{OWNER_EMAIL}</strong> will be pre-filled in <strong>To:</strong>. Click below to proceed:
                    </p>
                  </div>

                  {/* Primary 1-Click Dispatch Channels */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Channel 1: Gmail Web Compose (Direct <a> link, never blocked) */}
                    <a
                      href={receipt.gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFx.playChirp(720)}
                      className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-display font-bold text-xs flex flex-col gap-1 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all group cursor-pointer"
                      title={`Open Gmail Compose with To: ${OWNER_EMAIL}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-950" />
                          <span>OPEN IN GMAIL WEB</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="text-[10px] font-mono-code font-normal text-slate-950/80 truncate">
                        Default To: {OWNER_EMAIL}
                      </div>
                    </a>

                    {/* Channel 2: Native Mail App (mailto:) */}
                    <a
                      href={receipt.mailtoUrl}
                      onClick={() => soundFx.playChirp(720)}
                      className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-800/60 hover:border-cyan-500/80 text-cyan-300 hover:text-white font-display font-bold text-xs flex flex-col gap-1 transition-all group cursor-pointer"
                      title={`Open Native Mail Client with To: ${OWNER_EMAIL}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SendHorizontal className="w-4 h-4 text-cyan-400" />
                          <span>DEFAULT MAIL / GMAIL APP</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="text-[10px] font-mono-code font-normal text-slate-400 truncate">
                        Default To: {OWNER_EMAIL}
                      </div>
                    </a>
                  </div>

                  {/* Telemetry Summary Terminal Box */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-xs space-y-2.5">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>TRANSMISSION TELEMETRY</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{receipt.timestamp}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500">SENDER: </span>
                        <span className="text-slate-200 font-semibold">{receipt.senderName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">CATEGORY: </span>
                        <span className="text-cyan-300 font-semibold">{receipt.category}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500 text-[10px] mb-1">MESSAGE PAYLOAD:</div>
                      <div className="p-2.5 rounded bg-slate-900/90 text-slate-300 text-[11px] leading-relaxed line-clamp-3 font-sans-modern border border-slate-800/80">
                        {receipt.message}
                      </div>
                    </div>
                  </div>

                  {/* Secondary Actions: Copy Payload & Reset Form */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      onClick={copyReceiptPayload}
                      className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono-code inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      {copiedPayload ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-bold">PAYLOAD COPIED TO CLIPBOARD</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>COPY TRANSMISSION PAYLOAD</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={resetTransmission}
                      className="px-3.5 py-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-xs font-mono-code inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>NEW TRANSMISSION</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
