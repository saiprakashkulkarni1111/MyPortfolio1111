import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  AlertTriangle, 
  Lock, 
  FileText, 
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { PUBLICATION_DATA } from '../data/portfolioData';
import { soundFx } from '../utils/soundEffects';

interface PresetCase {
  label: string;
  authenticVpa: string;
  targetVpa: string;
  claimedEntity: string;
  amount: number;
  deviceRisk: 'low' | 'medium' | 'high';
  notes: string;
}

export const UpiSecuritySimulator: React.FC = () => {
  const presets: PresetCase[] = [
    {
      label: "Typo-squatting Utility Impersonation",
      authenticVpa: "bescom.billpay@sbi",
      targetVpa: "besc0m.bi11pay@sbi",
      claimedEntity: "Bangalore Electricity Supply Co (BESCOM)",
      amount: 4850,
      deviceRisk: "high",
      notes: "Substitutes 'o' with '0' and 'l' with '1' to trick users paying utility bills."
    },
    {
      label: "Social Engineering Fake Refund Handle",
      authenticVpa: "irctc.tickets@icici",
      targetVpa: "irctc-refund-officer@ybl",
      claimedEntity: "Indian Railway Catering and Tourism Corp",
      amount: 2300,
      deviceRisk: "high",
      notes: "Attacker claims to be an IRCTC refund executive asking the user to send UPI request."
    },
    {
      label: "Legitimate Verified Merchant Payment",
      authenticVpa: "swiggy.orders@hdfcbank",
      targetVpa: "swiggy.orders@hdfcbank",
      claimedEntity: "Swiggy Food Delivery",
      amount: 620,
      deviceRisk: "low",
      notes: "Authentic verified VPA from known merchant on standard device."
    }
  ];

  const [activeTab, setActiveTab] = useState<'simulator' | 'architecture' | 'paper'>('simulator');
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [targetVpa, setTargetVpa] = useState<string>(presets[0].targetVpa);
  const [authenticVpa, setAuthenticVpa] = useState<string>(presets[0].authenticVpa);
  const [amount, setAmount] = useState<number>(presets[0].amount);
  const [deviceRisk, setDeviceRisk] = useState<'low' | 'medium' | 'high'>('high');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    similarityScore: number;
    riskScore: number;
    decision: 'APPROVE' | 'FRICTION_INTERVENE' | 'BLOCK';
    reason: string;
    details: string[];
  } | null>(null);

  const handleApplyPreset = (index: number) => {
    soundFx.playChirp(650);
    const p = presets[index];
    setSelectedPreset(index);
    setTargetVpa(p.targetVpa);
    setAuthenticVpa(p.authenticVpa);
    setAmount(p.amount);
    setDeviceRisk(p.deviceRisk);
    setVerificationResult(null);
  };

  const runVerification = () => {
    soundFx.playChirp(750);
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      // Calculate algorithmic similarity
      const vpa1 = authenticVpa.toLowerCase().trim();
      const vpa2 = targetVpa.toLowerCase().trim();

      let similarity = 0.98;
      if (vpa1 === vpa2) {
        similarity = 1.0;
      } else {
        // Levenshtein & SBERT semantic embedding distance simulation
        const commonSubstrings = ['bescom', 'irctc', 'swiggy', 'bill', 'pay', 'order', 'refund'];
        let matched = 0;
        commonSubstrings.forEach(w => {
          if (vpa1.includes(w) && vpa2.includes(w)) matched++;
        });
        const lengthDiff = Math.abs(vpa1.length - vpa2.length);
        similarity = Math.max(0.65, 0.95 - (lengthDiff * 0.04) + (matched * 0.02));
      }

      // Compute Risk-Based Authentication (RBA) composite
      let rbaScore = 15; // baseline
      if (deviceRisk === 'high') rbaScore += 50;
      if (deviceRisk === 'medium') rbaScore += 25;
      if (amount > 2000) rbaScore += 15;

      const isExactMatch = vpa1 === vpa2;
      const isImpersonating = !isExactMatch && similarity > 0.70;

      let decision: 'APPROVE' | 'FRICTION_INTERVENE' | 'BLOCK' = 'APPROVE';
      let reason = "Verified legitimate recipient entity.";
      const details: string[] = [];

      if (isImpersonating || rbaScore > 65) {
        decision = 'FRICTION_INTERVENE';
        soundFx.playAlert();
        reason = "POTENTIAL IMPERSONATION DETECTED // UX INHIBITIVE ATTRACTOR TRIGGERED";
        details.push(`SBERT Semantic Cosine Similarity: ${(similarity * 100).toFixed(1)}% (High Homoglyph/Typo overlap)`);
        details.push(`Risk-Based Device Telemetry: ${rbaScore}/100 composite risk`);
        details.push("Action: Enforce 5-second cognitive cooldown lock & display verified legal entity confirmation banner.");
      } else if (rbaScore > 40) {
        decision = 'FRICTION_INTERVENE';
        reason = "MEDIUM RISK TRANSACTION // ADVISORY FRICTION";
        details.push(`Similarity Score: ${(similarity * 100).toFixed(1)}%`);
        details.push("Action: Present passive security confirmation prompt.");
      } else {
        soundFx.playSuccess();
        decision = 'APPROVE';
        details.push(`VPA Authenticity Index: 100% genuine match`);
        details.push(`RBA Device Integrity: Clean device fingerprint & low-risk channel`);
        details.push("Action: Instant frictionless routing permitted.");
      }

      setVerificationResult({
        similarityScore: similarity,
        riskScore: rbaScore,
        decision,
        reason,
        details
      });
      setIsVerifying(false);
    }, 850);
  };

  return (
    <section id="research" className="py-16 md:py-24 border-t border-cyan-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>FEATURED RESEARCH PUBLICATION (APRIL 2026)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-100 tracking-tight">
              Intelligent UPI Recipient Verification
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans-modern mt-1 max-w-2xl">
              Published research by Saiprakash Kulkarni addressing cross-lingual VPA impersonation and social engineering in Indian digital payments via SBERT embeddings and dynamic UX friction.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 rounded-xl bg-slate-900/90 border border-cyan-950 text-xs font-mono-code">
            <button
              onClick={() => { soundFx.playChirp(600); setActiveTab('simulator'); }}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'simulator' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Simulator
            </button>
            <button
              onClick={() => { soundFx.playChirp(600); setActiveTab('architecture'); }}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'architecture' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              System Architecture
            </button>
            <button
              onClick={() => { soundFx.playChirp(600); setActiveTab('paper'); }}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'paper' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paper Abstract
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Controls Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-2xl border border-cyan-500/30 bg-[#070b16]/95 p-5 sm:p-6 space-y-5 shadow-2xl glow-cyan backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 hazard-stripes-cyan opacity-70"></div>
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
                
                <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mt-1">
                  <span className="text-xs font-mono-code text-cyan-400 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    TEST BENCH INPUT CONTROLS
                  </span>
                  <span className="text-[11px] font-mono-code text-cyan-400/70">[SBERT + RBA ENGINE // SEC-3]</span>
                </div>

                {/* Preset Selector */}
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-2">
                    SELECT REAL-WORLD ATTACK SCENARIO:
                  </label>
                  <div className="space-y-2">
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleApplyPreset(idx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
                          selectedPreset === idx
                            ? 'border-cyan-500/80 bg-cyan-950/50 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-200">
                          <span>{p.label}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code ${
                            p.deviceRisk === 'high' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          }`}>
                            {p.deviceRisk.toUpperCase()} RISK
                          </span>
                        </div>
                        <div className="font-mono-code text-[11px] text-slate-400 truncate">
                          Target: <span className="text-cyan-400 font-semibold">{p.targetVpa}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editable Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">
                      Recipient VPA (Entering):
                    </label>
                    <input
                      type="text"
                      value={targetVpa}
                      onChange={(e) => setTargetVpa(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-cyan-900/60 text-cyan-300 font-mono-code text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">
                      Authentic Entity VPA:
                    </label>
                    <input
                      type="text"
                      value={authenticVpa}
                      onChange={(e) => setAuthenticVpa(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-cyan-900/60 text-slate-300 font-mono-code text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">
                      Amount (INR ₹):
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-cyan-900/60 text-cyan-300 font-mono-code text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">
                      Passive Device Risk:
                    </label>
                    <select
                      value={deviceRisk}
                      onChange={(e) => setDeviceRisk(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-cyan-900/60 text-cyan-300 font-mono-code text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="low">Low (Standard User Device)</option>
                      <option value="medium">Medium (Unusual IP/Carrier)</option>
                      <option value="high">High (New Device + Velocity Anomaly)</option>
                    </select>
                  </div>
                </div>

                {/* VPA Character-Level Homoglyph Anomaly Detector */}
                <div className="p-3 rounded-xl bg-black/60 border border-cyan-950 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono-code">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      HOMOGLYPH &amp; STRING ANOMALY SCANNER
                    </span>
                    <span className="text-cyan-400 text-[10px]">REAL-TIME DIFF</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-code">
                    <div className="p-2 rounded bg-slate-950 border border-emerald-950/60">
                      <div className="text-[10px] text-emerald-400 font-semibold mb-1">AUTHENTIC VPA:</div>
                      <div className="text-slate-200 tracking-wider truncate">
                        {authenticVpa}
                      </div>
                    </div>

                    <div className="p-2 rounded bg-slate-950 border border-rose-950/60">
                      <div className="text-[10px] text-rose-400 font-semibold mb-1">TARGET VPA (ENTERED):</div>
                      <div className="tracking-wider break-all">
                        {Array.from(targetVpa).map((char, i) => {
                          const authChar = authenticVpa[i];
                          const isMismatch = char !== authChar;
                          return isMismatch ? (
                            <span 
                              key={i} 
                              className="text-rose-300 bg-rose-950/90 border border-rose-500/80 px-1 py-0.5 rounded font-bold inline-block mx-0.5 animate-pulse"
                              title={`Anomalous character: '${char}' (Expected: '${authChar || 'None'}')`}
                            >
                              {char}
                            </span>
                          ) : (
                            <span key={i} className="text-slate-300">
                              {char}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Execute Button */}
                <button
                  onClick={runVerification}
                  disabled={isVerifying}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      <span>COMPUTING SBERT EMBEDDINGS & RBA SCORE...</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      <span>RUN INTELLIGENT VERIFICATION LAYER</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Output / Decision HUD */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl border border-cyan-500/30 bg-[#070b16]/95 p-5 sm:p-6 space-y-5 min-h-[460px] flex flex-col justify-between shadow-2xl glow-cyan backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 hazard-stripes-cyan opacity-70"></div>
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

                <div>
                  <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-4 mt-1">
                    <span className="text-xs font-mono-code text-cyan-400 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      SECURITY DECISION ENGINE TELEMETRY
                    </span>
                    <span className="text-[11px] font-mono-code text-cyan-400/70">[RBI PROTOCOL LEVEL 3]</span>
                  </div>

                  {!verificationResult && !isVerifying && (
                    <div className="py-8 text-center space-y-5">
                      {/* Interactive Holographic Threat Radar Screen */}
                      <div className="relative w-36 h-36 mx-auto rounded-full border border-cyan-500/40 bg-slate-950/80 p-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] overflow-hidden">
                        {/* Radar Range Rings */}
                        <div className="absolute inset-3 rounded-full border border-cyan-500/20"></div>
                        <div className="absolute inset-7 rounded-full border border-cyan-500/30"></div>
                        <div className="absolute inset-11 rounded-full border border-cyan-500/40"></div>
                        
                        {/* Axis Crosshairs */}
                        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/30"></div>
                        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/30"></div>

                        {/* Rotating Radar Sweep Laser */}
                        <div className="absolute inset-0 origin-center animate-radar pointer-events-none">
                          <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/40 via-cyan-500/10 to-transparent [clip-path:polygon(100%_100%,_0_100%,_0_0)]"></div>
                        </div>

                        {/* Simulated Vector Blips */}
                        <div className="absolute top-8 left-10 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping"></div>
                        <div className="absolute bottom-10 right-8 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e] animate-pulse"></div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-cyan-300 font-mono-code text-xs tracking-wider">
                          // THREAT RADAR: CONTINUOUS VECTOR SWEEP
                        </p>
                        <p className="text-slate-400 text-xs max-w-sm mx-auto font-sans-modern">
                          Click "RUN INTELLIGENT VERIFICATION LAYER" to evaluate cross-lingual semantic embeddings and real-time device integrity.
                        </p>
                      </div>
                    </div>
                  )}

                  {isVerifying && (
                    <div className="py-16 text-center space-y-4">
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping"></div>
                        <div className="w-14 h-14 rounded-full border-2 border-t-cyan-400 border-cyan-900 animate-spin flex items-center justify-center">
                          <Cpu className="w-6 h-6 text-cyan-400" />
                        </div>
                      </div>
                      <div className="font-mono-code text-xs text-cyan-300 animate-pulse">
                        SBERT VECTORIZER: EXTRACTING CROSS-LINGUAL EMBEDDINGS...
                      </div>
                    </div>
                  )}

                  {verificationResult && !isVerifying && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      
                      {/* Decision Card */}
                      <div className={`p-4 rounded-xl border ${
                        verificationResult.decision === 'APPROVE'
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          {verificationResult.decision === 'APPROVE' ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-7 h-7 text-rose-400 flex-shrink-0 animate-bounce" />
                          )}
                          <div>
                            <div className="font-display font-bold text-base sm:text-lg tracking-wide">
                              {verificationResult.decision === 'APPROVE' ? 'TRANSACTION APPROVED' : 'INTERVENTION REQUIRED'}
                            </div>
                            <div className="text-xs font-mono-code opacity-90 mt-0.5">
                              {verificationResult.reason}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Meters: SBERT Cosine Similarity & Risk Score */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                          <div className="text-[10px] font-mono-code text-slate-400">SBERT COSINE SIMILARITY</div>
                          <div className="text-xl font-display font-bold text-cyan-300 mt-1">
                            {(verificationResult.similarityScore * 100).toFixed(1)}%
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="bg-cyan-400 h-full rounded-full transition-all duration-700"
                              style={{ width: `${verificationResult.similarityScore * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                          <div className="text-[10px] font-mono-code text-slate-400">COMPOSITE RISK RATING</div>
                          <div className={`text-xl font-display font-bold mt-1 ${
                            verificationResult.riskScore > 60 ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {verificationResult.riskScore} / 100
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${
                                verificationResult.riskScore > 60 ? 'bg-rose-500' : 'bg-emerald-400'
                              }`}
                              style={{ width: `${verificationResult.riskScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* UX Inhibitive Attractor Mockup for High Risk */}
                      {verificationResult.decision === 'FRICTION_INTERVENE' && (
                        <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs space-y-2">
                          <div className="flex items-center gap-1.5 text-amber-300 font-mono-code font-bold">
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            UX INHIBITIVE ATTRACTOR (DYNAMIC FRICTION)
                          </div>
                          <p className="text-slate-300">
                            The user interface automatically disables the "Pay" button for 5 seconds and enforces a cognitive challenge:
                          </p>
                          <div className="p-2.5 rounded bg-slate-950 border border-amber-500/30 text-slate-300 font-mono-code text-[11px]">
                            "You are paying to: <span className="text-rose-400 font-bold">{targetVpa}</span>. This handle is NOT the verified merchant <span className="text-emerald-400 font-bold">{presets[selectedPreset].claimedEntity}</span>. Confirm recipient identity?"
                          </div>
                        </div>
                      )}

                      {/* Diagnostic Log */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-mono-code text-slate-400">AUDIT TRAIL LOGS:</div>
                        {verificationResult.details.map((item, i) => (
                          <div key={i} className="text-xs font-mono-code text-cyan-300/90 flex items-start gap-1.5">
                            <span className="text-cyan-500 font-bold">»</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-cyan-950 flex items-center justify-between text-xs font-mono-code text-slate-400">
                  <span>Directly aligns with RBI Cybersecurity Directives</span>
                  <span className="text-cyan-400 font-semibold">Author: Saiprakash Kulkarni</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SYSTEM ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="rounded-xl border border-cyan-900/40 bg-[#0a0f1d] p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Proposed Intelligent Verification Architecture Flow
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {[
                { step: "01", title: "Ingestion & Tokenizer", desc: "Extracts VPA handles, merchant IDs, and regional script transliterations." },
                { step: "02", title: "SBERT Vector Embedding", desc: "Encodes handles into dense semantic vectors to detect cross-lingual homoglyphs." },
                { step: "03", title: "Cosine Similarity Core", desc: "Computes vector angular distances against a verified registry of national entities." },
                { step: "04", title: "RBA Risk Aggregation", desc: "Evaluates passive device fingerprint, transaction velocity, and geolocation hops." },
                { step: "05", title: "Dynamic UX Attractor", desc: "Imposes cognitive friction or blocks transfer based on composite risk threshold." }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-950/80 border border-cyan-950 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="text-cyan-400 font-mono-code text-xs font-bold mb-1">STAGE {item.step}</div>
                    <div className="font-display font-semibold text-slate-200 text-sm mb-2">{item.title}</div>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans-modern">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-900 text-[10px] font-mono-code text-slate-500">
                    LATENCY &lt; 40ms
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono-code text-cyan-200 flex items-center justify-between">
              <span>Paper Title: "Enhancing UPI Security Through Intelligent Recipient Verification"</span>
              <span className="text-slate-400">Bengaluru, India • April 2026</span>
            </div>
          </div>
        )}

        {/* TAB 3: FULL PAPER HIGHLIGHTS */}
        {activeTab === 'paper' && (
          <div className="rounded-xl border border-cyan-900/40 bg-[#0a0f1d] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-4">
              <div>
                <span className="text-xs font-mono-code text-cyan-400 uppercase">RESEARCH MANUSCRIPT OVERVIEW</span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-100 mt-1">
                  {PUBLICATION_DATA.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono-code text-xs font-bold">
                  {PUBLICATION_DATA.status}
                </span>
                <div className="text-xs text-slate-400 font-mono-code mt-1">{PUBLICATION_DATA.location} • {PUBLICATION_DATA.date}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-2">RESEARCH ABSTRACT</h4>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans-modern bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                {PUBLICATION_DATA.abstract}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-2">CORE RESEARCH CONTRIBUTIONS</h4>
              <ul className="space-y-2.5">
                {PUBLICATION_DATA.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300 bg-cyan-950/20 p-3 rounded-lg border border-cyan-950/80">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono-code text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {PUBLICATION_DATA.tags.map((t, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-slate-900 border border-cyan-900/60 text-cyan-300 text-xs font-mono-code">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
