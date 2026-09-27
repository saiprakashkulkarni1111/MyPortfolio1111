import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  ShieldCheck, 
  Cpu, 
  User, 
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  ClipboardPaste,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const STORAGE_KEY = 'saiprakash_portfolio_gemini_key';

const DEFAULT_SUGGESTIONS = [
  "How does the SBERT UPI security framework work?",
  "Tell me about Kisan Mitra and its Kannada voice system",
  "Explain the Bi-LSTM & XGBoost flood warning architecture",
  "What are Saiprakash's primary ML frameworks & skills?",
  "What certifications and honors does he hold?"
];

interface AiChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiChatSidebar: React.FC<AiChatSidebarProps> = ({ isOpen, onClose }) => {
  // API Key State
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [verifiedKey, setVerifiedKey] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);
  const [showKeyPlaintext, setShowKeyPlaintext] = useState(false);
  const [isEditingKey, setIsEditingKey] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I am Saiprakash Kulkarni's AI Research & Engineering Copilot, powered by Gemini 3.8 Flash. Ask me anything about his peer-reviewed UPI security publication, the Kisan Mitra rural agro-vision system, the Smart Flood MHEWS early-warning ensemble, or his machine learning proficiencies.",
      timestamp: 'Online'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const keyInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  // Body scroll lock and ESC key dismiss
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
      if (verifiedKey && !isEditingKey) {
        scrollToBottom();
        setTimeout(() => inputRef.current?.focus(), 80);
      } else {
        setTimeout(() => keyInputRef.current?.focus(), 80);
      }
    }
  }, [isOpen, messages, isLoading, verifiedKey, isEditingKey]);

  // Verify user-provided API key via backend
  const handleVerifyKey = async (keyToVerify?: string) => {
    const rawKey = (keyToVerify || apiKeyInput).trim();
    if (!rawKey) {
      setVerificationError('Please paste your Gemini API key to proceed.');
      return;
    }

    if (rawKey.length < 15) {
      setVerificationError('The API key seems too short. Gemini keys typically start with "AIzaSy" and are at least 30 characters.');
      return;
    }

    soundFx.playChirp(700);
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(null);

    try {
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: rawKey }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        throw new Error(data.error || 'Key verification failed. Please check the key from Google AI Studio.');
      }

      // Success
      soundFx.playSuccess();
      setVerificationSuccess('API key authenticated successfully! Initializing neural connection...');
      
      try {
        localStorage.setItem(STORAGE_KEY, rawKey);
      } catch (storageErr) {
        console.warn('LocalStorage not available:', storageErr);
      }

      setVerifiedKey(rawKey);
      setApiKeyInput('');

      // Add confirmation message to chat if switching or first key
      setTimeout(() => {
        setIsEditingKey(false);
        setVerificationSuccess(null);
        setMessages((prev) => [
          ...prev,
          {
            id: `key-verified-${Date.now()}`,
            role: 'model',
            text: "Verified API Key active. Neural link established with Gemini 3.8 Flash! You can now explore Saiprakash's research, algorithms, and technical credentials.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 900);

    } catch (err: any) {
      soundFx.playChirp(300);
      setVerificationError(err?.message || 'Verification failed. Please check your key and network connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Paste from clipboard helper
  const handlePasteClipboard = async () => {
    try {
      soundFx.playChirp(650);
      const text = await navigator.clipboard.readText();
      if (text) {
        setApiKeyInput(text.trim());
        setVerificationError(null);
      }
    } catch {
      setVerificationError('Clipboard access was blocked by the browser. Please paste the key directly into the input field.');
    }
  };

  // Remove verified key
  const handleRemoveKey = () => {
    soundFx.playChirp(400);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setVerifiedKey(null);
    setApiKeyInput('');
    setIsEditingKey(false);
    setVerificationError(null);
    setVerificationSuccess(null);
  };

  const parseErrorMessage = (rawError: any): string => {
    if (!rawError) return 'An error occurred while connecting to the AI service.';
    const text = typeof rawError === 'string' ? rawError : rawError.message || String(rawError);

    if (text.includes('"message":')) {
      try {
        const match = text.match(/"message":\s*"([^"]+)"/);
        if (match && match[1]) return match[1];
      } catch {
        // fallback
      }
    }

    if (text.includes('503') || text.includes('high demand') || text.includes('UNAVAILABLE')) {
      return 'The Gemini neural model is currently experiencing high demand spikes. Please click Retry below.';
    }

    if (text.includes('API_KEY') || text.includes('401') || text.includes('requiresKey')) {
      return 'API key authorization failed. Please click the key icon above to re-verify your Gemini API key.';
    }

    return text;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isLoading) return;

    if (!verifiedKey) {
      setIsEditingKey(true);
      return;
    }

    soundFx.playChirp(800);
    setErrorMsg(null);
    setLastQuery(query);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-gemini-api-key': verifiedKey,
        },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          apiKey: verifiedKey,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setIsEditingKey(true);
        }
        throw new Error(data.error || `Error ${res.status}: Failed to fetch AI response`);
      }

      soundFx.playSuccess();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || "No response received from model.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      soundFx.playChirp(350);
      console.error('Chat error:', err);
      setErrorMsg(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    soundFx.playChirp(500);
    setMessages([
      {
        id: 'welcome-cleared',
        role: 'model',
        text: "Conversation reset. How can I assist you in exploring Saiprakash's research, algorithms, or technical background?",
        timestamp: 'Reset'
      }
    ]);
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  // Masked representation of verified key
  const maskedVerifiedKey = verifiedKey 
    ? `${verifiedKey.slice(0, 6)}••••••••${verifiedKey.slice(-4)}`
    : '';

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/85 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFx.playChirp(600);
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
    >
      <aside 
        className="w-full sm:w-[440px] md:w-[480px] h-full bg-[#070b14] border-l border-cyan-800/80 shadow-2xl flex flex-col transition-all duration-200 animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
        aria-label="AI Chatbot Sidebar"
      >
      {/* Header Bar */}
      <div className="p-4 border-b border-cyan-950 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
              verifiedKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-sm text-slate-100 tracking-wider">
                SAIPRAKASH AI COPILOT
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                GEMINI 3.8
              </span>
            </div>
            <p className="text-[11px] font-mono-code text-cyan-400/80">
              // Research & Technical Inquiries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Key Management Button */}
          {verifiedKey && !isEditingKey && (
            <button
              onClick={() => {
                soundFx.playChirp(600);
                setIsEditingKey(true);
              }}
              title="Manage Verified API Key"
              className="px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 font-mono-code text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3 h-3 text-emerald-400" />
              <span>KEY ACTIVE</span>
            </button>
          )}

          {verifiedKey && !isEditingKey && (
            <button
              onClick={clearChat}
              title="Clear Chat History"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playChirp(600);
              onClose();
            }}
            title="Close Assistant"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Telemetry Status Line */}
      <div className="px-4 py-1.5 bg-cyan-950/30 border-b border-cyan-950/60 flex items-center justify-between text-[10px] font-mono-code text-cyan-400/70">
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-cyan-400" />
          CONTEXT: RESEARCH, MHEWS & KISAN MITRA
        </span>
        <span className={verifiedKey ? "text-emerald-400" : "text-amber-400"}>
          {verifiedKey ? "LINK SECURE" : "KEY REQUIRED"}
        </span>
      </div>

      {/* VIEW A: API KEY VERIFICATION GATE (if no key or user clicked edit key) */}
      {(!verifiedKey || isEditingKey) ? (
        <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-center space-y-6">
          <div className="relative p-6 rounded-2xl border border-cyan-500/50 bg-[#0a0f1d] shadow-2xl shadow-cyan-950/60 overflow-hidden">
            {/* Ambient Cyber Top Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-600"></div>

            <div className="flex items-start gap-3.5 mb-4">
              <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 flex-shrink-0 shadow-lg shadow-cyan-950/40">
                <KeyRound className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                  AUTHENTICATION REQUIRED
                </div>
                <h4 className="font-display font-bold text-base text-slate-100">
                  {verifiedKey ? "Update Gemini API Key" : "Connect Gemini API Key"}
                </h4>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans-modern mb-4">
              To converse with Saiprakash's AI Copilot powered by <strong>Gemini 3.8 Flash</strong>, please paste your Gemini API key below. The key will be tested against Google's Neural Engine to verify authentication before proceeding.
            </p>

            {/* Currently Active Key Indicator if editing */}
            {verifiedKey && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-mono-code">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Current: {maskedVerifiedKey}</span>
                </div>
                <button
                  onClick={handleRemoveKey}
                  title="Remove Key"
                  className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/60 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            )}

            {/* Input Field with Paste & Eye toggle */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono-code text-slate-300 flex items-center justify-between">
                <span>PASTE GEMINI API KEY</span>
                <span className="text-[10px] text-cyan-400/80">Begins with AIzaSy...</span>
              </label>

              <div className="relative flex items-center">
                <input
                  ref={keyInputRef}
                  type={showKeyPlaintext ? "text" : "password"}
                  value={apiKeyInput}
                  onChange={(e) => {
                    setApiKeyInput(e.target.value);
                    setVerificationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleVerifyKey();
                    }
                  }}
                  placeholder="AIzaSy..."
                  disabled={isVerifying}
                  className="w-full pl-3.5 pr-20 py-3 rounded-xl bg-[#060a14] border border-cyan-500/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 font-mono-code text-xs focus:outline-none transition-all placeholder:text-slate-600"
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {apiKeyInput && (
                    <button
                      type="button"
                      onClick={() => setShowKeyPlaintext(!showKeyPlaintext)}
                      title={showKeyPlaintext ? "Mask key" : "Show key"}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {showKeyPlaintext ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    title="Paste from clipboard"
                    className="p-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-mono-code"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {verificationError && (
              <div className="mt-3.5 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2 font-mono-code animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1 leading-relaxed">{verificationError}</div>
              </div>
            )}

            {/* Success Message */}
            {verificationSuccess && (
              <div className="mt-3.5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-start gap-2 font-mono-code animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <div className="flex-1 leading-relaxed">{verificationSuccess}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => handleVerifyKey()}
                disabled={isVerifying || !apiKeyInput.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_18px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>AUTHENTICATING KEY...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>VERIFY & PROCEED</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              {verifiedKey && (
                <button
                  onClick={() => {
                    soundFx.playChirp(500);
                    setIsEditingKey(false);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-mono-code text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-center"
                >
                  Cancel & return to active chat
                </button>
              )}
            </div>

            {/* Key Retrieval Instructions */}
            <div className="mt-5 pt-4 border-t border-cyan-950/80 flex items-center justify-between text-[11px] font-mono-code">
              <span className="text-slate-400">Need a Gemini API key?</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1 font-semibold transition-colors"
              >
                <span>Get key on Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono-code text-slate-400 space-y-1 text-center">
            <p>🔒 Your API key is stored only in your local browser session and passed securely via encrypted headers for verification.</p>
          </div>
        </div>
      ) : (
        /* VIEW B: ACTIVE CHAT CONVERSATION */
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans-modern text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div 
                    className={`p-1.5 rounded-lg flex-shrink-0 ${
                      isUser 
                        ? 'bg-sky-950 border border-sky-500/40 text-sky-300' 
                        : 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-slate-950 font-medium rounded-tr-none shadow-md shadow-sky-950/50'
                          : 'bg-[#0b1020] border border-cyan-900/50 text-slate-200 rounded-tl-none shadow-lg shadow-black/40'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className={`text-[10px] font-mono-code text-slate-500 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Bubble */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex-shrink-0">
                  <Bot className="w-4 h-4 animate-spin text-cyan-400" />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#0b1020] border border-cyan-900/50 text-cyan-300 text-xs flex items-center gap-2 font-mono-code">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Querying Gemini 3.8 Flash Neural Engine...</span>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex flex-col gap-2 font-mono-code">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                  <div className="space-y-1 flex-1">
                    <div className="font-bold text-rose-200">TRANSMISSION NOTICE</div>
                    <div className="text-rose-300/90 leading-relaxed">{errorMsg}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-rose-500/30 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsEditingKey(true)}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono-code border border-slate-700 transition-colors cursor-pointer"
                  >
                    Change API Key
                  </button>
                  {lastQuery && (
                    <button
                      onClick={() => handleSend(lastQuery)}
                      className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-white font-mono-code text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>RETRY TRANSMISSION</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="p-3 border-t border-cyan-950/80 bg-slate-950/60 space-y-1.5">
            <div className="text-[10px] font-mono-code text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>SUGGESTED EXPLORATIONS</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {DEFAULT_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  disabled={isLoading}
                  onClick={() => handleSend(sug)}
                  className="text-[11px] font-mono-code text-slate-300 hover:text-cyan-300 bg-slate-900/90 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="p-3 border-t border-cyan-950 bg-slate-950">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about UPI security, flood AI, Kisan Mitra..."
                value={inputVal}
                disabled={isLoading}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#080d1a] border border-cyan-900/60 text-slate-200 text-xs font-sans-modern focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !inputVal.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                title="Send Query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] font-mono-code text-slate-500 text-center mt-2 flex items-center justify-center gap-2">
              <span>Powered by Gemini 3.8 Flash</span>
              <span>•</span>
              <button 
                onClick={() => setIsEditingKey(true)}
                className="text-cyan-400/80 hover:text-cyan-300 underline cursor-pointer"
              >
                Key: {maskedVerifiedKey}
              </button>
            </div>
          </div>
        </>
      )}
      </aside>
    </div>
  );
};
