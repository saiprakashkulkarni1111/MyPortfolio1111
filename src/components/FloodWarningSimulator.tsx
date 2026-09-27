import React, { useState, useEffect } from 'react';
import { 
  Waves, 
  Activity, 
  Satellite, 
  Radio, 
  BellRing, 
  CheckCircle2, 
  Cpu, 
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface BasinProfile {
  name: string;
  location: string;
  dangerLevel: number; // in meters
  currentDepth: number;
  rainfall: number; // mm/h
  flowVelocity: number; // m/s
  history: number[];
}

export const FloodWarningSimulator: React.FC = () => {
  const basins: BasinProfile[] = [
    {
      name: "Cauvery River Basin",
      location: "Mandya / Srirangapatna Node",
      dangerLevel: 8.5,
      currentDepth: 7.8,
      rainfall: 42.5,
      flowVelocity: 3.4,
      history: [5.2, 5.8, 6.4, 7.1, 7.5, 7.8]
    },
    {
      name: "Krishna River Basin",
      location: "Bagalkot / Almatti Inflow",
      dangerLevel: 12.0,
      currentDepth: 9.4,
      rainfall: 24.0,
      flowVelocity: 2.8,
      history: [7.2, 7.5, 8.1, 8.6, 9.0, 9.4]
    },
    {
      name: "Tungabhadra River Basin",
      location: "Shivamogga / Hospet Sensor",
      dangerLevel: 10.2,
      currentDepth: 10.5, // above danger!
      rainfall: 68.0,
      flowVelocity: 4.6,
      history: [6.5, 7.4, 8.6, 9.5, 10.1, 10.5]
    }
  ];

  const [selectedBasinIndex, setSelectedBasinIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [alertDispatched, setAlertDispatched] = useState<boolean>(false);
  const [dispatchTimer, setDispatchTimer] = useState<number>(298); // 4m 58s (under 5 min)

  const activeBasin = basins[selectedBasinIndex];
  const isSurgeCondition = activeBasin.currentDepth >= activeBasin.dangerLevel * 0.92;

  const handleSelectBasin = (idx: number) => {
    soundFx.playChirp(650);
    setSelectedBasinIndex(idx);
    setAlertDispatched(false);
    setSimStep(0);
  };

  const runBiLSTMSimulation = () => {
    soundFx.playChirp(780);
    setIsSimulating(true);
    setAlertDispatched(false);
    setSimStep(1);

    setTimeout(() => {
      setSimStep(2); // Bi-LSTM sequence prediction
      setTimeout(() => {
        setSimStep(3); // XGBoost anomaly & false alarm check
        setTimeout(() => {
          setIsSimulating(false);
          if (isSurgeCondition) {
            setAlertDispatched(true);
            soundFx.playAlert();
          } else {
            soundFx.playSuccess();
          }
        }, 600);
      }, 700);
    }, 600);
  };

  return (
    <div className="rounded-xl border border-cyan-900/50 bg-[#090e1a] p-6 sm:p-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-950 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono-code text-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>MHEWS TELEMETRY LAB // BI-LSTM + XGBOOST ENSEMBLE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-100 mt-1">
            Smart Flood Early Warning Simulator
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono-code text-xs">
            95% ACCURACY
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono-code text-xs">
            90% FALSE ALARM CUT
          </span>
        </div>
      </div>

      {/* Basin Selector Tabs */}
      <div>
        <label className="block text-xs font-mono-code text-slate-400 mb-2 uppercase">
          Select River Basin Telemetry Stream:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {basins.map((b, idx) => {
            const isCritical = b.currentDepth >= b.dangerLevel;
            return (
              <button
                key={idx}
                onClick={() => handleSelectBasin(idx)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedBasinIndex === idx
                    ? 'border-cyan-400 bg-cyan-950/50 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-display font-bold text-sm">
                  <span>{b.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono-code ${
                    isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isCritical ? 'FLOOD SURGE' : 'MONITORING'}
                  </span>
                </div>
                <div className="text-[11px] font-mono-code text-slate-400 mt-1">{b.location}</div>
                <div className="text-xs font-mono-code text-cyan-400 mt-2 font-semibold">
                  Depth: {b.currentDepth}m / Danger: {b.dangerLevel}m
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Telemetry Gauges + Bi-LSTM Wave Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Sensor Gauges Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3.5 rounded-lg bg-slate-950/90 border border-cyan-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Waves className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-[10px] font-mono-code text-slate-400 uppercase">IoT Ultrasonic Water Depth</div>
                <div className="text-xl font-display font-bold text-slate-100">{activeBasin.currentDepth} meters</div>
              </div>
            </div>
            <span className="text-xs font-mono-code text-cyan-400 font-bold">LIVE</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/90 border border-cyan-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Satellite className="w-5 h-5 text-sky-400" />
              <div>
                <div className="text-[10px] font-mono-code text-slate-400 uppercase">Satellite Doppler Radar Inflow</div>
                <div className="text-xl font-display font-bold text-slate-100">{activeBasin.rainfall} mm/hr</div>
              </div>
            </div>
            <span className="text-xs font-mono-code text-sky-400 font-bold">RADAR</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/90 border border-cyan-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-[10px] font-mono-code text-slate-400 uppercase">Acoustic Flow Velocity</div>
                <div className="text-xl font-display font-bold text-slate-100">{activeBasin.flowVelocity} m/s</div>
              </div>
            </div>
            <span className="text-xs font-mono-code text-emerald-400 font-bold">TELEMETRY</span>
          </div>
        </div>

        {/* Neural Ensemble Forecaster Box */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-slate-950/90 border border-cyan-900/60 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono-code">
            <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
              <TrendingUp className="w-4 h-4" />
              BI-LSTM SEQUENCE WATER-LEVEL FORECAST [T+12H]
            </span>
            <span className="text-slate-400">GEO-GENERALIZABLE</span>
          </div>

          {/* Simple Visual Bar Trajectory */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[11px] font-mono-code text-slate-400">
              <span>Past T-5h</span>
              <span>Past T-3h</span>
              <span>Past T-1h</span>
              <span className="text-cyan-400 font-bold">Current</span>
              <span className="text-amber-400 font-bold">Bi-LSTM T+6h</span>
              <span className="text-rose-400 font-bold">Bi-LSTM T+12h</span>
            </div>

            {/* Sparkline simulation bars */}
            <div className="grid grid-cols-6 gap-2 h-24 items-end bg-slate-900/50 p-2 rounded-lg border border-slate-800">
              {activeBasin.history.map((val, i) => {
                const heightPct = Math.min(100, Math.max(20, (val / activeBasin.dangerLevel) * 75));
                return (
                  <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-mono-code text-slate-400">{val}m</span>
                    <div 
                      className="w-full rounded-t bg-cyan-600/70 border-t border-cyan-400 transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    ></div>
                  </div>
                );
              })}
              
              {/* Projected T+6h */}
              {(() => {
                const proj6 = isSurgeCondition ? +(activeBasin.currentDepth + 1.1).toFixed(1) : +(activeBasin.currentDepth + 0.2).toFixed(1);
                const heightPct = Math.min(100, (proj6 / activeBasin.dangerLevel) * 75);
                return (
                  <div className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-mono-code text-amber-300">{proj6}m</span>
                    <div 
                      className="w-full rounded-t bg-amber-500/70 border-t border-amber-300 animate-pulse"
                      style={{ height: `${heightPct}%` }}
                    ></div>
                  </div>
                );
              })()}

              {/* Projected T+12h */}
              {(() => {
                const proj12 = isSurgeCondition ? +(activeBasin.currentDepth + 1.8).toFixed(1) : +(activeBasin.currentDepth + 0.3).toFixed(1);
                const heightPct = Math.min(100, (proj12 / activeBasin.dangerLevel) * 75);
                return (
                  <div className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-mono-code text-rose-400 font-bold">{proj12}m</span>
                    <div 
                      className="w-full rounded-t bg-rose-600/80 border-t border-rose-400"
                      style={{ height: `${heightPct}%` }}
                    ></div>
                  </div>
                );
              })()}
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono-code text-slate-500 pt-1">
              <span>Threshold Mark: {activeBasin.dangerLevel}m (Red line)</span>
              <span>XGBoost Confidence Filter: ACTIVE (90% spurious noise rejected)</span>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={runBiLSTMSimulation}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>STEP {simStep}/3: PROCESSING TIME-SERIES WEIGHTS...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>EXECUTE ENSEMBLE PREDICTION PIPELINE</span>
                </>
              )}
            </button>

            <span className="text-xs font-mono-code text-slate-400 hidden sm:inline">
              Author: Saiprakash Kulkarni
            </span>
          </div>

          {/* Emergency Alert Pipeline Modal / Banner */}
          {alertDispatched && (
            <div className="p-4 rounded-lg bg-rose-950/60 border border-rose-500/70 text-rose-200 animate-in fade-in duration-300 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-display font-bold text-rose-300 text-sm">
                  <BellRing className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span>AUTOMATED EMERGENCY ALERT DISPATCHED (&lt; 5 MIN SLA)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-900 text-[10px] font-mono-code text-rose-100">
                  DISPATCH TIME: 03m 42s
                </span>
              </div>
              <p className="text-xs text-rose-200/90 font-sans-modern">
                Critical surge predicted in <strong>{activeBasin.name}</strong> ({activeBasin.location}). Automated emergency sirens, SDMA disaster alerts, and SMS evacuation notices triggered to district authorities.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
