import React, { useState } from 'react';
import { 
  Sprout, 
  Volume2, 
  Cloud, 
  TrendingUp, 
  CheckCircle, 
  Eye, 
  Languages, 
  Sparkles,
  Zap
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface CropSample {
  name: string;
  scientificName: string;
  crop: string;
  imageHint: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidence: number;
  advisoryEn: string;
  advisoryKn: string;
  recommendedTreatment: string;
  marketPrice: string;
}

export const KisanMitraInspector: React.FC = () => {
  const cropSamples: CropSample[] = [
    {
      name: "Early Blight Infection",
      scientificName: "Alternaria solani",
      crop: "Tomato (Kolar Variety)",
      imageHint: "Concentric dark brown rings with chlorotic yellow haloes on lower foliage.",
      severity: "Moderate",
      confidence: 94.8,
      advisoryEn: "Detected Early Blight in tomato foliage. Remove lower infected leaves and spray Mancozeb or Copper Oxychloride. Ensure drip irrigation to avoid leaf wetness.",
      advisoryKn: "ಟೊಮ್ಯಾಟೊ ಬೆಳೆಯಲ್ಲಿ ಮುಂಚಿನ ಬ್ಲೈಟ್ ರೋಗ ಕಂಡುಬಂದಿದೆ. ಮ್ಯಾಂಕೋಜೆಬ್ ಅಥವಾ ತಾಮ್ರದ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಸಿಂಪಡಿಸಿ.",
      recommendedTreatment: "Copper Oxychloride (3g/L) + Potassium Phosphite foliar feed",
      marketPrice: "Kolar APMC: ₹2,450 / quintal (▲ 4.2%)"
    },
    {
      name: "Rice Blast Lesions",
      scientificName: "Magnaporthe oryzae",
      crop: "Paddy (Sona Masoori)",
      imageHint: "Spindle-shaped lesions with gray-white centers and reddish-brown borders.",
      severity: "Severe",
      confidence: 96.2,
      advisoryEn: "Critical Rice Blast infection detected. Immediately regulate nitrogen fertilizer. Apply Tricyclazole 75% WP to prevent neck blast spread.",
      advisoryKn: "ಭತ್ತದ ಬೆಳೆಯಲ್ಲಿ ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್) ಪತ್ತೆಯಾಗಿದೆ. ಟ್ರೈಸೈಕ್ಲಜೋಲ್ ೭೫% ಸಿಂಪಡಿಸಿ.",
      recommendedTreatment: "Tricyclazole 75 WP @ 0.6g/L water during tillering",
      marketPrice: "Raichur APMC: ₹3,920 / quintal (▲ 1.8%)"
    },
    {
      name: "Cotton Leaf Curl Virus",
      scientificName: "Begomovirus (CLCuV)",
      crop: "Cotton (Bt Hybrid)",
      imageHint: "Upward leaf curling, thickening of veins, and enations on the abaxial surface.",
      severity: "Mild",
      confidence: 92.4,
      advisoryEn: "Early-stage Cotton Leaf Curl observed, transmitted by Whiteflies. Spray systemic insecticide to curb vector population.",
      advisoryKn: "ಹತ್ತಿ ಬೆಳೆಯಲ್ಲಿ ಎಲೆ ಸುರುಟು ರೋಗದ ಆರಂಭಿಕ ಲಕ್ಷಣಗಳು. ಬಿಳಿ ನೊಣಗಳ ನಿಯಂತ್ರಣಕ್ಕೆ ಕೀಟನಾಶಕ ಬಳಸಿ.",
      recommendedTreatment: "Diafenthiuron 50% WP @ 1g/L for whitefly vector suppression",
      marketPrice: "Kalaburgi APMC: ₹7,100 / quintal (▼ 0.5%)"
    }
  ];

  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'KN'>('EN');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const activeSample = cropSamples[selectedCropIndex];

  const handleSelectCrop = (idx: number) => {
    soundFx.playChirp(680);
    setSelectedCropIndex(idx);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const playVoiceAdvisory = () => {
    soundFx.playChirp(750);
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const textToSpeak = selectedLanguage === 'KN' ? activeSample.advisoryKn : activeSample.advisoryEn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.lang = selectedLanguage === 'KN' ? 'kn-IN' : 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-xl border border-cyan-900/50 bg-[#090e1a] p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-950 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono-code text-xs">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>AGRO-VISION & MULTILINGUAL KANNADA NLP LAB</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-100 mt-1">
            Kisan Mitra Diagnostic & Speech Console
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-sky-950/60 border border-sky-500/40 text-sky-300 font-mono-code text-xs">
            GCP CLOUD RUN
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono-code text-xs">
            LOW-BANDWIDTH (&lt;120KB)
          </span>
        </div>
      </div>

      {/* Crop Sample Selector Chips */}
      <div>
        <label className="block text-xs font-mono-code text-slate-400 mb-2 uppercase">
          Select Field Crop Telemetry Sample:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cropSamples.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectCrop(idx)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedCropIndex === idx
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-display font-bold text-sm text-slate-200">
                <span>{sample.crop}</span>
                <span className="text-emerald-400 text-xs font-mono-code font-bold">{sample.confidence}%</span>
              </div>
              <div className="text-xs text-slate-400 font-mono-code mt-0.5">{sample.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Inspection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Computer Vision Diagnostics Card */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950/90 border border-emerald-950 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-xs font-mono-code text-emerald-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              CV LEAF SEGMENTATION & INFERENCE
            </span>
            <span className="text-[10px] font-mono-code text-slate-500">PYTORCH ON GCP</span>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="font-display font-bold text-slate-100 text-base">{activeSample.name}</div>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono-code text-[11px] font-bold">
                {activeSample.confidence}% CONFIDENCE
              </span>
            </div>
            <div className="text-xs font-mono-code text-emerald-400/90 italic">
              Pathogen: {activeSample.scientificName}
            </div>
            <p className="text-xs text-slate-300 pt-1 font-sans-modern">
              {activeSample.imageHint}
            </p>
          </div>

          <div>
            <div className="text-[11px] font-mono-code text-slate-400 uppercase mb-1">Recommended Agronomic Remedy:</div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-code text-slate-200">
              {activeSample.recommendedTreatment}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs font-mono-code text-cyan-300">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              LIVE MANDI PRICE FEED:
            </span>
            <span className="font-bold text-slate-100">{activeSample.marketPrice}</span>
          </div>
        </div>

        {/* Right: Multilingual Kannada Speech & Voice Advisory */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950/90 border border-cyan-950 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-xs font-mono-code text-cyan-400 flex items-center gap-1.5">
              <Languages className="w-4 h-4" />
              NATIVE KANNADA SPEECH PIPELINE (TTS / STT)
            </span>
            
            {/* Language Switcher */}
            <div className="flex rounded-md bg-slate-900 p-0.5 border border-slate-800 text-xs font-mono-code">
              <button
                onClick={() => { soundFx.playChirp(600); setSelectedLanguage('EN'); }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedLanguage === 'EN' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => { soundFx.playChirp(600); setSelectedLanguage('KN'); }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedLanguage === 'KN' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                ಕನ್ನಡ (Kannada)
              </button>
            </div>
          </div>

          {/* Speech Synthesis Box */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code text-slate-400">
                {selectedLanguage === 'KN' ? 'ಸ್ಥಳೀಯ ಕನ್ನಡ ಧ್ವನಿ ಸಮಾಲೋಚನೆ (Native Voice Advisory):' : 'Multilingual Agro-Advisory Stream:'}
              </span>
              <span className="text-[10px] font-mono-code text-cyan-400">LATENCY &lt; 450ms</span>
            </div>

            <p className={`text-sm leading-relaxed p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 ${
              selectedLanguage === 'KN' ? 'font-sans text-base leading-relaxed text-cyan-200' : 'font-sans-modern'
            }`}>
              {selectedLanguage === 'KN' ? activeSample.advisoryKn : activeSample.advisoryEn}
            </p>

            <button
              onClick={playVoiceAdvisory}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-display font-bold text-xs tracking-wider transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span>{isSpeaking ? 'VOICE SYNTHESIZER ACTIVE (PLAYING...)' : `LISTEN ADVISORY IN ${selectedLanguage === 'KN' ? 'KANNADA' : 'ENGLISH'}`}</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-code text-slate-400 flex items-center justify-between">
            <span>Low-bandwidth schema-validated API gateway</span>
            <span className="text-emerald-400">Deployed on GCP</span>
          </div>
        </div>

      </div>

    </div>
  );
};
