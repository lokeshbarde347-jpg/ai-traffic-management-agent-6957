import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Flame,
  TrendingUp,
  Activity,
  CheckCircle2,
  Bot,
  Filter,
  ArrowRight,
  ShieldCheck,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { useTraffic } from '../context/TrafficContext';
import { AlertType, AlertSeverity, AlertItem } from '../types/traffic';

export const AlertCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, selectLocation, triggerAiAnalysis, setActiveTab } =
    useTraffic();

  const [typeFilter, setTypeFilter] = useState<'ALL' | AlertType>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'>('ALL');

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = typeFilter === 'ALL' || alert.type === typeFilter;
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || alert.status === statusFilter;
    return matchesType && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'HIGH':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'LOW':
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'HIGH_CONGESTION':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'SUDDEN_TRAFFIC_INCREASE':
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case 'ROAD_CAPACITY_EXCEEDED':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'UNUSUAL_TRAFFIC_PATTERN':
        return <Activity className="w-4 h-4 text-cyan-400" />;
    }
  };

  const handleEscalateToAi = (alert: AlertItem) => {
    selectLocation(alert.locationId);
    triggerAiAnalysis(alert.locationId);
    setActiveTab('ai-agent');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Anomaly Surveillance
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400">Automated Threshold Breaches</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Alert Center</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active congestion anomalies, threshold exceedances, and actionable AI mitigation advisories
          </p>
        </div>

        {/* Status Filter segmented control */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === st ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs by Alert Type */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium px-1 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          <span>Alert Type:</span>
        </span>

        <button
          onClick={() => setTypeFilter('ALL')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            typeFilter === 'ALL'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Types
        </button>

        <button
          onClick={() => setTypeFilter('HIGH_CONGESTION')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            typeFilter === 'HIGH_CONGESTION'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          High Congestion
        </button>

        <button
          onClick={() => setTypeFilter('SUDDEN_TRAFFIC_INCREASE')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            typeFilter === 'SUDDEN_TRAFFIC_INCREASE'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sudden Traffic Increase
        </button>

        <button
          onClick={() => setTypeFilter('ROAD_CAPACITY_EXCEEDED')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            typeFilter === 'ROAD_CAPACITY_EXCEEDED'
              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Road Capacity Exceeded
        </button>

        <button
          onClick={() => setTypeFilter('UNUSUAL_TRAFFIC_PATTERN')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            typeFilter === 'UNUSUAL_TRAFFIC_PATTERN'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Unusual Pattern
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-white">No alerts matching filter criteria</p>
            <p className="text-xs text-slate-400 mt-1">All corridor thresholds within nominal limits.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl bg-slate-900/90 border transition-all shadow-xl space-y-4 ${
                alert.status === 'ACTIVE'
                  ? alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                    ? 'border-rose-500/40'
                    : 'border-slate-800'
                  : 'border-slate-800/60 opacity-80'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        {alert.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {alert.locationName}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">{alert.time}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                      alert.status === 'ACTIVE'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : alert.status === 'ACKNOWLEDGED'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Detected Condition & Recommendation (per prompt specifications) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Detected Condition
                  </span>
                  <p className="text-slate-200 leading-relaxed font-mono">
                    {alert.detectedCondition}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                    AI Recommendation
                  </span>
                  <p className="text-slate-200 leading-relaxed font-mono">
                    {alert.aiRecommendation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleEscalateToAi(alert)}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-semibold transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Escalate to AI Agent</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
