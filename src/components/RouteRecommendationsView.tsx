import React, { useState } from 'react';
import {
  Route,
  ArrowRight,
  Clock,
  Navigation,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useTraffic } from '../context/TrafficContext';
import { RouteComparisonPair } from '../types/traffic';

export const RouteRecommendationsView: React.FC = () => {
  const { routeComparisons, setActiveTab, selectLocation } = useTraffic();
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [isComparing, setIsComparing] = useState(false);
  const [isBroadcasted, setIsBroadcasted] = useState(false);

  const currentPair: RouteComparisonPair = routeComparisons[selectedPairIndex] || routeComparisons[0];

  const handleCompareRoutes = () => {
    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
    }, 600);
  };

  const handleBroadcastAdvisory = () => {
    setIsBroadcasted(true);
    setTimeout(() => {
      setIsBroadcasted(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Prototype Data Warning Banner */}
      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Simulation / Prototype Data — Model outputs generated for demonstration and operational decision support only.
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-400/90 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full shrink-0">
          Simulation / Prototype Data
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Dynamic Route Recommendations</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-generated arterial diversion strategies to alleviate bottleneck convergence
          </p>
        </div>

        {/* Corridor Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          {routeComparisons.map((pair, idx) => (
            <button
              key={pair.id}
              onClick={() => {
                setSelectedPairIndex(idx);
                setIsBroadcasted(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedPairIndex === idx
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Corridor {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Corridor Title */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Corridor Focus: {currentPair.corridorTitle}
        </span>
      </div>

      {/* Main Side-by-Side Route Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Route Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-rose-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Primary / Current Route
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                Congestion: {currentPair.currentRoute.congestion}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {currentPair.currentRoute.from} → {currentPair.currentRoute.to}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{currentPair.currentRoute.via}</p>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-4">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Distance</span>
                <span className="text-lg font-bold text-white tabular-nums">
                  {currentPair.currentRoute.distanceKm} km
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Estimated Time</span>
                <span className="text-lg font-bold text-rose-400 tabular-nums">
                  {currentPair.currentRoute.durationMin} min
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 space-y-1">
              <div className="text-[11px] font-semibold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Heavy Tailback Identified</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Persistent 86% volume saturation at central terminal. Average waiting queue exceeds
                90 seconds.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            Status: Standard Transit Path (Saturated)
          </div>
        </div>

        {/* Alternative Route Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-cyan-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Recommended Alternative</span>
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Congestion: {currentPair.altRoute.congestion}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {currentPair.altRoute.from} → {currentPair.altRoute.to}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{currentPair.altRoute.via}</p>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-4">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Distance</span>
                <span className="text-lg font-bold text-white tabular-nums">
                  {currentPair.altRoute.distanceKm} km
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                  (+{(currentPair.altRoute.distanceKm - currentPair.currentRoute.distanceKm).toFixed(1)} km)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                <span className="text-[10px] text-emerald-400 block font-sans">Estimated Time</span>
                <span className="text-lg font-bold text-emerald-300 tabular-nums">
                  {currentPair.altRoute.durationMin} min
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5 font-sans">
                  Time Saved: {currentPair.estimatedTimeSavedMin} min
                </span>
              </div>
            </div>

            {/* Time Saved Highlight Widget */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-slate-200 space-y-1">
              <div className="flex items-center justify-between text-cyan-300 font-bold text-xs">
                <span>Estimated Time Saved:</span>
                <span className="text-base font-mono text-emerald-300">
                  {currentPair.estimatedTimeSavedMin} min (~
                  {Math.round(
                    (currentPair.estimatedTimeSavedMin / currentPair.currentRoute.durationMin) * 100
                  )}
                  %)
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                "{currentPair.aiRecommendation}"
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High Flow Efficiency
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls & VMS Broadcast Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Operator Operational Clearance</span>
          </h4>
          <p className="text-xs text-slate-400 max-w-xl">
            Authorize dynamic Variable Message Sign (VMS) advisory broadcast or review full vector path
            on the live spatial map.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCompareRoutes}
            disabled={isComparing}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Clock className={`w-3.5 h-3.5 ${isComparing ? 'animate-spin' : ''}`} />
            <span>{isComparing ? 'Computing Delays...' : 'Compare Routes'}</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold border border-cyan-800/50 transition-colors flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>View Route on Map</span>
          </button>

          <button
            onClick={handleBroadcastAdvisory}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 ${
              isBroadcasted
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-950/40'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/40'
            }`}
          >
            {isBroadcasted ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Advisory Broadcasted!</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5" />
                <span>Broadcast Divert Advisory</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
