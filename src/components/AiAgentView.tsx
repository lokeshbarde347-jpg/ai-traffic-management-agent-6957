import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  UserCheck,
  RefreshCw,
  Eye,
  FileCheck,
  TrendingUp,
  Clock,
  Gauge,
  Sliders,
  X
} from 'lucide-react';
import { useTraffic } from '../context/TrafficContext';
import { HumanInTheLoopCard } from './HumanInTheLoopCard';

export const AiAgentView: React.FC = () => {
  const {
    locations,
    aiAnalysis,
    isAnalyzing,
    triggerAiAnalysis,
    generateNewRecommendation,
    approveAiRecommendation,
    selectedLocationId,
    selectLocation,
    setActiveTab
  } = useTraffic();

  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const pipelineStages = [
    {
      id: 'data',
      label: 'Traffic Data',
      sub: 'Sensors, Radar & ANPR',
      icon: Database,
      status: 'active'
    },
    {
      id: 'processing',
      label: 'Data Processing',
      sub: 'Spatial Aggregation',
      icon: Cpu,
      status: 'active'
    },
    {
      id: 'detection',
      label: 'Congestion Detection',
      sub: 'Anomaly Thresholds',
      icon: AlertTriangle,
      status: 'active'
    },
    {
      id: 'analysis',
      label: 'AI Analysis',
      sub: 'Baseline Comparison',
      icon: Bot,
      status: isAnalyzing ? 'processing' : 'active'
    },
    {
      id: 'recommendation',
      label: 'Recommendation',
      sub: 'Adaptive Control Plan',
      icon: Lightbulb,
      status: 'active'
    },
    {
      id: 'decision',
      label: 'Operator Decision',
      sub: 'Supervisory Authorization',
      icon: UserCheck,
      status: 'pending'
    }
  ];

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const handleApprove = () => {
    approveAiRecommendation(approvalNote || undefined);
    setShowApprovalModal(false);
    setApprovalNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Autonomous Reasoning Engine
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">Online & Synchronized</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
              AI Traffic Management Agent
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time deep diagnostic engine analyzing multi-sensor telemetry across arterial corridors.
              Evaluates historical baselines, projects clearance windows, and synthesizes explainable action plans.
            </p>
          </div>

          {/* Location Selector to target analysis */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 px-2 font-medium">Target Node:</span>
            <select
              value={selectedLocationId || ''}
              onChange={e => {
                selectLocation(e.target.value);
                triggerAiAnalysis(e.target.value);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.congestionLevel})
                </option>
              ))}
            </select>

            <button
              onClick={() => triggerAiAnalysis(selectedLocationId || undefined)}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-700/60 rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Scanning...' : 'Re-analyze'}</span>
            </button>
          </div>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Inference Pipeline</span>
            <span className="text-cyan-400 font-mono text-[10px]">End-to-End Decision Flow</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isCurrent = isAnalyzing && stage.id === 'analysis';

              return (
                <div key={stage.id} className="relative">
                  <div
                    className={`p-3 rounded-xl border transition-all h-full flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-950/60 border-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isCurrent
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-cyan-400 border border-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-200 tracking-tight leading-snug">
                        {stage.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{stage.sub}</div>
                    </div>
                  </div>

                  {idx < pipelineStages.length - 1 && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main AI Active Investigation Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detected Issue, Analysis & Action Plans */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                <div className="text-center">
                  <div className="text-sm font-bold text-white">Synthesizing Sensor Telemetry...</div>
                  <div className="text-xs text-slate-400 mt-1">Comparing 30-day historical time-of-day distributions</div>
                </div>
              </div>
            )}

            {/* Severity Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getSeverityBadge(
                    aiAnalysis.severity
                  )}`}
                >
                  Severity: {aiAnalysis.severity}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Timestamp: {aiAnalysis.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400">Inference Confidence:</span>
                <span className="font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded">
                  {aiAnalysis.confidenceScore}%
                </span>
              </div>
            </div>

            {/* Issue & Rationale */}
            <div className="py-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Detected Issue
                </label>
                <div className="text-lg font-bold text-white leading-snug">
                  {aiAnalysis.detectedIssue}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <label className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  AI Deep Analysis & Baseline Rationale
                </label>
                <p className="text-xs text-slate-300 leading-relaxed">{aiAnalysis.analysis}</p>
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                  <span>{aiAnalysis.baselineComparison}</span>
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Recommended Operational Actions
                  </label>
                  <span className="text-[11px] text-slate-400">Ordered by priority</span>
                </div>

                <div className="space-y-2">
                  {aiAnalysis.recommendedActions.map((action, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 flex items-start gap-3 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-xs text-slate-200 leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => triggerAiAnalysis(selectedLocationId || undefined)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Analyze Traffic</span>
                </button>

                <button
                  onClick={() => generateNewRecommendation(selectedLocationId || undefined)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/80 rounded-xl transition-all"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Generate Recommendation</span>
                </button>

                <button
                  onClick={() => setIsEvidenceOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Evidence</span>
                </button>
              </div>

              {/* Operator Approval Button */}
              <button
                onClick={() => setShowApprovalModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-950/40"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Action</span>
              </button>
            </div>
          </div>

          {/* Safety Card */}
          <HumanInTheLoopCard />
        </div>

        {/* Right Col: Telemetry Telemetry Rationale & Real-Time Projections */}
        <div className="space-y-6">
          {/* Quick Metrics Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Telemetry Diagnostic</span>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-1">Inflow vs Outflow Rate</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-mono font-bold text-white">
                    {aiAnalysis.evidence.inflowRatePerMin}{' '}
                    <span className="text-xs text-slate-400 font-normal">veh/min</span>
                  </span>
                  <span className="text-xs font-mono text-rose-400">
                    Outflow: {aiAnalysis.evidence.outflowRatePerMin} veh/min
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (aiAnalysis.evidence.inflowRatePerMin /
                          (aiAnalysis.evidence.outflowRatePerMin || 1)) *
                          50
                      )}%`
                    }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-1">Estimated Clearance Window</div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-mono font-extrabold text-cyan-300">
                    ~{aiAnalysis.projectedClearanceMin} min
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-cyan-400" /> With signal split
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-1">Queue Bottleneck Radius</div>
                <div className="text-base font-mono font-bold text-white">
                  {aiAnalysis.evidence.bottleneckRadiusMeters} meters
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Tailback verified via inductive loop telemetry.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('routes')}
                className="w-full py-2 px-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Suggested Alternative Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Explainability Breakdown Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Transparent AI Rationale</span>
            </h3>

            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                The AI does not execute black-box actions. Recommendations are calculated by combining:
              </p>
              <ul className="space-y-1.5 text-slate-400 list-disc list-inside text-[11px]">
                <li>Kalman-filtered inductive loop vehicle counts</li>
                <li>Time-of-day seasonal historical distribution curves</li>
                <li>Network spillover propagation matrices</li>
                <li>Fixed physical safety clearance constraints</li>
              </ul>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 text-[11px] text-slate-400">
                Model: <span className="font-mono text-slate-300">Deterministic Traffic Optimizer v2.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View Evidence */}
      {isEvidenceOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">
                  Neural Evidence & Baseline Telemetry: {aiAnalysis.targetLocation}
                </h3>
              </div>
              <button
                onClick={() => setIsEvidenceOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Historical Delta</span>
                  <span className="text-base font-mono font-bold text-rose-400">
                    +{aiAnalysis.evidence.historicalDeviationPercent}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Inflow</span>
                  <span className="text-base font-mono font-bold text-white">
                    {aiAnalysis.evidence.inflowRatePerMin} /min
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Outflow</span>
                  <span className="text-base font-mono font-bold text-cyan-300">
                    {aiAnalysis.evidence.outflowRatePerMin} /min
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Bottleneck</span>
                  <span className="text-base font-mono font-bold text-amber-400">
                    {aiAnalysis.evidence.bottleneckRadiusMeters}m
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block text-xs">
                  Sensor Correlation Breakdown
                </span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Loop sensor #04 (southbound approach) registered a vehicle clearance interval decay from
                  2.4s to 5.8s over the last 12 minutes. Synchronized ANPR cameras recorded zero stationary
                  breakdowns, confirming continuous high-volume saturation rather than mechanical blockage.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-slate-300">
                <span className="font-bold text-cyan-300 block mb-1">Audit Traceability</span>
                Every metric used to produce this advisory is logged with high-resolution timestamps
                for post-incident municipal reporting and insurance review.
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsEvidenceOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close Evidence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Operator Decision Approval */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-xs space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">
                  Supervisory Action Confirmation
                </h3>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              You are authorizing the primary recommendation for{' '}
              <strong className="text-white">{aiAnalysis.targetLocation}</strong>:
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-xs">
              "{aiAnalysis.recommendedActions[0]}"
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1.5">
                Operator Operational Note (Optional):
              </label>
              <textarea
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
                placeholder="e.g. Signal cycle updated via SCATS controller; traffic marshals dispatched to crosswalk."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-xl transition-colors shadow-lg shadow-emerald-950/40"
              >
                Confirm & Log Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
