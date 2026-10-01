import React, { useState, useEffect } from 'react';
import {
  Car,
  MapPin,
  AlertTriangle,
  Gauge,
  Clock,
  Bell,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Shield,
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useTraffic } from '../context/TrafficContext';
import { HumanInTheLoopCard } from './HumanInTheLoopCard';

export const DashboardView: React.FC = () => {
  const {
    totalVehicles,
    locations,
    highCongestionCount,
    averageSpeed,
    averageWaitingTime,
    alerts,
    aiAnalysis,
    setActiveTab,
    selectLocation,
    anprEvents,
    acknowledgeAlert
  } = useTraffic();

  // Animated counter effect
  const [animatedTotal, setAnimatedTotal] = useState(totalVehicles);
  const [animatedSpeed, setAnimatedSpeed] = useState(averageSpeed);
  const [animatedWait, setAnimatedWait] = useState(averageWaitingTime);

  useEffect(() => {
    setAnimatedTotal(totalVehicles);
    setAnimatedSpeed(averageSpeed);
    setAnimatedWait(averageWaitingTime);
  }, [totalVehicles, averageSpeed, averageWaitingTime]);

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  const getCongestionBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/70 border-rose-800/80';
      case 'HIGH':
        return 'text-red-400 bg-red-950/70 border-red-800/80';
      case 'MODERATE':
        return 'text-amber-400 bg-amber-950/70 border-amber-800/80';
      default:
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-800/80';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Traffic Intelligence Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time traffic analysis and AI-assisted operational decision support
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ai-agent')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/25 transition-all shadow-md shadow-cyan-950/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Launch AI Agent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards (6 cards with animated figures) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Total Vehicles */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Vehicles</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              {animatedTotal.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 mt-1 font-mono">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Sensors streaming</span>
            </div>
          </div>
        </div>

        {/* 2. Active Locations */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Locations</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              {locations.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              8/8 nodes calibrated
            </div>
          </div>
        </div>

        {/* 3. High Congestion Zones */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">High Congestion</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-rose-400 font-mono tracking-tight tabular-nums">
              {highCongestionCount}
            </div>
            <div className="text-[10px] text-rose-400/80 mt-1 font-mono">
              Immediate attention
            </div>
          </div>
        </div>

        {/* 4. Average Speed */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Average Speed</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              {animatedSpeed}{' '}
              <span className="text-xs text-slate-400 font-sans font-normal">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              City baseline: 36 km/h
            </div>
          </div>
        </div>

        {/* 5. Average Waiting Time */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Waiting Time</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-300 font-mono tracking-tight tabular-nums">
              {animatedWait}{' '}
              <span className="text-xs text-slate-400 font-sans font-normal">sec</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Cycle delay index: 1.2
            </div>
          </div>
        </div>

        {/* 6. Active Alerts */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Alerts</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              {activeAlerts.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              3 High · 2 Moderate
            </div>
          </div>
        </div>
      </div>

      {/* AI Spotlight Intervention Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Active AI Advisory
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Location: {aiAnalysis.targetLocation}
              </span>
            </div>

            <h3 className="text-base font-bold text-white leading-snug">
              {aiAnalysis.detectedIssue}
            </h3>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {aiAnalysis.analysis} Recommended intervention:{' '}
              <span className="text-cyan-300 font-semibold font-mono">
                "{aiAnalysis.recommendedActions[0]}"
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('ai-agent')}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-cyan-950/40 flex items-center gap-1.5"
            >
              <span>Inspect AI Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              View Route Divert
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Live Corridor Cards & Real-Time ANPR Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monitored Corridors Fast Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Arterial Corridor Matrix</span>
            </h3>
            <button
              onClick={() => setActiveTab('live')}
              className="text-xs font-medium text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Live Table</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locations.slice(0, 6).map(loc => (
              <div
                key={loc.id}
                onClick={() => {
                  selectLocation(loc.id);
                  setActiveTab('map');
                }}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:translate-y-[-1px] group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-white text-xs group-hover:text-cyan-400 transition-colors">
                      {loc.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">{loc.area}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCongestionBadge(
                      loc.congestionLevel
                    )}`}
                  >
                    {loc.congestionLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Vehicles</span>
                    <span className="font-bold text-slate-200">
                      {loc.vehicleCount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Avg Speed</span>
                    <span className="font-bold text-slate-200">{loc.avgSpeed} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Waiting</span>
                    <span className="font-bold text-amber-300">{loc.waitingTime}s</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      loc.density >= 85
                        ? 'bg-rose-500'
                        : loc.density >= 70
                        ? 'bg-red-500'
                        : loc.density >= 45
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${loc.density}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Human-in-the-Loop Safeguard info */}
          <HumanInTheLoopCard compact />
        </div>

        {/* Right Col: Active Alerts & ANPR Stream */}
        <div className="space-y-6">
          {/* Active Alerts List */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-rose-400" />
                <span>Active Alerts ({activeAlerts.length})</span>
              </h3>
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {activeAlerts.slice(0, 4).map(alert => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">{alert.locationName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{alert.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {alert.detectedCondition}
                  </p>
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                    <span className="font-mono text-rose-400">{alert.metricDelta}</span>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ANPR Vehicle Events Stream */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-cyan-400" />
                <span>ANPR Camera Stream</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-[11px] font-mono">
              {anprEvents.slice(0, 5).map(event => (
                <div
                  key={event.id}
                  className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-200">{event.plateNumber}</span>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      {event.locationName} · {event.vehicleType}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-bold ${
                        event.status === 'SPEEDING'
                          ? 'text-rose-400'
                          : event.status === 'CONGESTED_ZONE'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {event.speedKmH} km/h
                    </span>
                    <span className="text-[9px] text-slate-400 block">{event.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
