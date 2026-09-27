import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Cpu, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Terminal, 
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface HeroTelemetryCockpitProps {
  onOpenAiChat?: () => void;
}

type TelemetryMode = 'sbert' | 'bilstm' | 'agro';

export const HeroTelemetryCockpit: React.FC<HeroTelemetryCockpitProps> = ({
  onOpenAiChat
}) => {
  const [activeMode, setActiveMode] = useState<TelemetryMode>('sbert');
  const [uptimeSeconds, setUptimeSeconds] = useState(148);
  const [pingPulse, setPingPulse] = useState(false);
  const [liveLatency, setLiveLatency] = useState(14);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live uptime counter
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Neural inference waveform animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let step = 0;
    let w = (canvas.width = canvas.offsetWidth || 340);
    let h = (canvas.height = 70);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const xStep = isMobile ? 2 : 1;

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth || 340;
      h = canvas.height = 70;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let isVisible = true;
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      }, { threshold: 0.1 });
      observer.observe(canvas);
    }

    const render = () => {
      frameId = requestAnimationFrame(render);

      if (document.hidden || !isVisible) {
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Oscilloscope wave based on active mode
      ctx.beginPath();
      ctx.lineWidth = 2;
      
      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      if (activeMode === 'sbert') {
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(0.5, '#38bdf8');
        gradient.addColorStop(1, '#06b6d4');
      } else if (activeMode === 'bilstm') {
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(0.5, '#34d399');
        gradient.addColorStop(1, '#10b981');
      } else {
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(0.5, '#fbbf24');
        gradient.addColorStop(1, '#f59e0b');
      }
      ctx.strokeStyle = gradient;

      for (let x = 0; x < w; x += xStep) {
        let y = h / 2;
        if (activeMode === 'sbert') {
          // Complex NLP token harmonic wave
          y += Math.sin((x + step * 2) * 0.05) * 16 * Math.cos((x - step) * 0.02);
        } else if (activeMode === 'bilstm') {
          // Time-series hydrologic surge trajectory wave
          y += Math.sin((x + step * 1.5) * 0.04) * 18 + Math.cos(x * 0.08) * 6;
        } else {
          // Vision convolutional feature extraction wave
          y += Math.sin((x + step * 3) * 0.08) * 12 + Math.sin(x * 0.2) * 5;
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Glowing scan dot at right edge
      const dotY = h / 2 + Math.sin((w + step * 2) * 0.05) * 14;
      ctx.fillStyle = activeMode === 'sbert' ? '#38bdf8' : activeMode === 'bilstm' ? '#34d399' : '#fbbf24';
      ctx.beginPath();
      ctx.arc(w - 6, dotY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      step += isMobile ? 1.0 : 1.2;
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, [activeMode]);

  const handleModeSwitch = (mode: TelemetryMode) => {
    soundFx.playChirp(mode === 'sbert' ? 750 : mode === 'bilstm' ? 820 : 900);
    setActiveMode(mode);
    setLiveLatency(mode === 'sbert' ? 42 : mode === 'bilstm' ? 18 : 35);
  };

  const handlePingTest = () => {
    soundFx.playChirp(960);
    setPingPulse(true);
    setLiveLatency(Math.floor(Math.random() * 8) + 9);
    setTimeout(() => setPingPulse(false), 1200);
  };

  return (
    <div className="relative rounded-2xl border border-cyan-500/30 bg-[#090e1a]/95 backdrop-blur-2xl p-5 md:p-6 shadow-2xl shadow-cyan-950/40 glow-cyan transition-all overflow-hidden group">
      {/* Corner Cyber HUD Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

      {/* Background Subtle Radar Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-cyan-950/90 text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute"></span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 relative"></span>
          </div>
          <span className="text-cyan-300 font-bold tracking-wider">NEURAL_TELEMETRY.SYS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePingTest}
            className={`px-2 py-0.5 rounded text-[10px] font-mono-code border transition-all cursor-pointer flex items-center gap-1 ${
              pingPulse 
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold' 
                : 'bg-slate-900 hover:bg-cyan-950 border-cyan-500/30 text-cyan-300'
            }`}
            title="Send test ping signal"
          >
            <Radio className="w-3 h-3" />
            <span>PING: {liveLatency}ms</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px]">
            UP: {Math.floor(uptimeSeconds / 60)}m {uptimeSeconds % 60}s
          </span>
        </div>
      </div>

      {/* Interactive Architecture Model Selector */}
      <div className="my-4 grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-950/90 border border-cyan-900/60">
        <button
          onClick={() => handleModeSwitch('sbert')}
          className={`py-2 px-2.5 rounded-lg text-[11px] sm:text-xs font-mono-code font-semibold transition-all cursor-pointer text-center whitespace-nowrap leading-tight flex items-center justify-center ${
            activeMode === 'sbert'
              ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
          }`}
        >
          SBERT UPI
        </button>

        <button
          onClick={() => handleModeSwitch('bilstm')}
          className={`py-2 px-2.5 rounded-lg text-[11px] sm:text-xs font-mono-code font-semibold transition-all cursor-pointer text-center whitespace-nowrap leading-tight flex items-center justify-center ${
            activeMode === 'bilstm'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
          }`}
        >
          HYDRO BI-LSTM
        </button>

        <button
          onClick={() => handleModeSwitch('agro')}
          className={`py-2 px-2.5 rounded-lg text-[11px] sm:text-xs font-mono-code font-semibold transition-all cursor-pointer text-center whitespace-nowrap leading-tight flex items-center justify-center ${
            activeMode === 'agro'
              ? 'bg-amber-950/90 text-amber-300 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
          }`}
        >
          AGRO VISION
        </button>
      </div>

      {/* Live Oscilloscope Waveform Display */}
      <div className="relative rounded-xl border border-cyan-950 bg-black/60 p-2.5 overflow-hidden">
        <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 mb-1 px-1">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            LIVE HARMONIC INFERENCE STREAM
          </span>
          <span className="text-cyan-400 font-mono-code">
            {activeMode === 'sbert' ? '768-DIM VECTOR' : activeMode === 'bilstm' ? '72H HORIZON' : '224x224 RGB'}
          </span>
        </div>

        <canvas 
          ref={canvasRef} 
          className="w-full h-[65px] block rounded"
        />

        {/* CRT Scanline faint overlay */}
        <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-40"></div>
      </div>

      {/* Dynamic Key Performance Indicators for Selected Model */}
      <div className="grid grid-cols-2 gap-2.5 mt-3.5">
        {activeMode === 'sbert' && (
          <>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-950 hover:border-cyan-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Cosine Match Threshold</div>
              <div className="text-2xl font-display font-bold text-cyan-300 mt-1">&ge; 0.88</div>
              <div className="text-[10px] text-cyan-400/80 font-mono-code mt-0.5">Dual-layer token gate</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-950 hover:border-cyan-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Homoglyph Detection</div>
              <div className="text-2xl font-display font-bold text-emerald-400 mt-1">100%</div>
              <div className="text-[10px] text-emerald-400/80 font-mono-code mt-0.5">Levenstein + SBERT</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-950 hover:border-cyan-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Inference Overhead</div>
              <div className="text-2xl font-display font-bold text-amber-400 mt-1">&lt; 45ms</div>
              <div className="text-[10px] text-amber-400/80 font-mono-code mt-0.5">Zero payment delay</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-950 hover:border-cyan-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Device Fingerprint</div>
              <div className="text-2xl font-display font-bold text-sky-400 mt-1">RBA</div>
              <div className="text-[10px] text-sky-400/80 font-mono-code mt-0.5">Passive risk-based auth</div>
            </div>
          </>
        )}

        {activeMode === 'bilstm' && (
          <>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-950/60 hover:border-emerald-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Surge Forecast Acc.</div>
              <div className="text-2xl font-display font-bold text-emerald-300 mt-1">95.0%</div>
              <div className="text-[10px] text-emerald-400/80 font-mono-code mt-0.5">6-24 hour window</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-950/60 hover:border-emerald-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">False-Alarm Drop</div>
              <div className="text-2xl font-display font-bold text-cyan-300 mt-1">90.0%</div>
              <div className="text-[10px] text-cyan-400/80 font-mono-code mt-0.5">Via XGBoost filter</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-950/60 hover:border-emerald-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Emergency SLA</div>
              <div className="text-2xl font-display font-bold text-amber-400 mt-1">&lt; 5 min</div>
              <div className="text-[10px] text-amber-400/80 font-mono-code mt-0.5">Automated siren alert</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-950/60 hover:border-emerald-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Telemetry Sources</div>
              <div className="text-2xl font-display font-bold text-sky-400 mt-1">12 Feeds</div>
              <div className="text-[10px] text-sky-400/80 font-mono-code mt-0.5">Sensor &amp; Satellite</div>
            </div>
          </>
        )}

        {activeMode === 'agro' && (
          <>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-950/60 hover:border-amber-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Quantized Model</div>
              <div className="text-2xl font-display font-bold text-amber-300 mt-1">&lt; 120 KB</div>
              <div className="text-[10px] text-amber-400/80 font-mono-code mt-0.5">MobileNet TorchScript</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-950/60 hover:border-amber-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Kannada Voice SLA</div>
              <div className="text-2xl font-display font-bold text-emerald-400 mt-1">&lt; 450 ms</div>
              <div className="text-[10px] text-emerald-400/80 font-mono-code mt-0.5">Rural STT + TTS</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-950/60 hover:border-amber-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Deployment</div>
              <div className="text-2xl font-display font-bold text-cyan-400 mt-1">GCP</div>
              <div className="text-[10px] text-cyan-400/80 font-mono-code mt-0.5">Cloud Run Serverless</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-950/60 hover:border-amber-500/40 transition-colors">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Stream Pricing</div>
              <div className="text-2xl font-display font-bold text-sky-400 mt-1">Real-time</div>
              <div className="text-[10px] text-sky-400/80 font-mono-code mt-0.5">APMC Mandi Gateway</div>
            </div>
          </>
        )}
      </div>

      {/* Cybernetic Publication Flag & Inquiry Banner */}
      <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-400/30 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="text-[11px] font-mono-code font-semibold text-cyan-200 truncate">
              {activeMode === 'sbert' 
                ? 'UPI Threat Research Paper (April 2026)' 
                : activeMode === 'bilstm' 
                ? 'Smart Flood Warning (MHEWS Model)' 
                : 'Kisan Mitra Agro-Vision Pipeline'}
            </div>
            <div className="text-[10px] font-mono-code text-slate-400">
              {activeMode === 'sbert' ? 'Published Research • Code & Architecture Available' : 'End-to-End Deep Learning Architecture'}
            </div>
          </div>
        </div>

        <a
          href="#research"
          onClick={() => soundFx.playChirp(800)}
          className="ml-2 px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono-code text-[11px] font-semibold flex-shrink-0 transition-colors"
        >
          VIEW PROTOCOL
        </a>
      </div>
    </div>
  );
};
