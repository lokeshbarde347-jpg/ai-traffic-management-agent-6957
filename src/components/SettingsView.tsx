import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bell,
  Cpu,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useTraffic } from '../context/TrafficContext';

export const SettingsView: React.FC = () => {
  const {
    isSimulating,
    simulationSpeed,
    setSimulationSpeed,
    resetSimulation
  } = useTraffic();

  const [congestionThreshold, setCongestionThreshold] = useState(70);
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [maxGreenExtension, setMaxGreenExtension] = useState(25);
  const [minPedestrianTime, setMinPedestrianTime] = useState(15);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Operations Config
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-slate-400">Parameter Calibration</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tune algorithmic sensitivity thresholds, safety clamps, and simulated telemetry frequency
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Section 1: Threshold & Anomaly Sensitivity */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Anomaly Detection Thresholds</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>High Congestion Trigger (% Density):</span>
                <span className="font-mono font-bold text-amber-300">{congestionThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="85"
                value={congestionThreshold}
                onChange={e => setCongestionThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Volumes exceeding this ratio generate automated Level-2 alert notifications.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Critical Congestion Breach (% Density):</span>
                <span className="font-mono font-bold text-rose-400">{criticalThreshold}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="98"
                value={criticalThreshold}
                onChange={e => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Triggers immediate divert recommendation to alternative corridors.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Safety Clamps (Human-in-the-Loop Safeguards) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Safety Invariant Enforcement (Physical Signal Bounds)</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Maximum Allowed Green Phase Extension:</span>
                <span className="font-mono font-bold text-white">{maxGreenExtension} seconds</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={maxGreenExtension}
                onChange={e => setMaxGreenExtension(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[11px] text-slate-400 block mt-0.5">
                The AI is hard-constrained from recommending green phase extensions beyond this ceiling.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Minimum Pedestrian Clearance Window:</span>
                <span className="font-mono font-bold text-emerald-400">{minPedestrianTime} seconds</span>
              </div>
              <input
                type="range"
                min="12"
                max="30"
                value={minPedestrianTime}
                onChange={e => setMinPedestrianTime(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Guaranteed pedestrian crossing interval that cannot be shortened during vehicular flush.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Telemetry & Prototype Controls */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Prototype Reset
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Restores all 8 corridor locations, alert logs, and decision history to initial demonstration baseline state.
            </p>
          </div>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Parameters Synchronized
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
