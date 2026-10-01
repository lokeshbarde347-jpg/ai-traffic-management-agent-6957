import React, { useState } from 'react';
import {
  Camera,
  Cpu,
  AlertTriangle,
  Bot,
  HelpCircle,
  Monitor,
  ArrowDown,
  Layers,
  Code2,
  CheckCircle2,
  Zap,
  Server,
  Database,
  Radio,
  FileText
} from 'lucide-react';

interface ArchNode {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  description: string;
  components: string[];
  latency: string;
  samplePayload: Record<string, any>;
}

export const TechnicalArchitectureView: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ai-agent');

  const nodes: ArchNode[] = [
    {
      id: 'sensor-data',
      stepNumber: '01',
      title: 'SIMULATED CAMERA / SENSOR DATA',
      subtitle: 'Edge Telemetry Layer',
      icon: Camera,
      accentColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
      description:
        'Continuous simulated ingestion stream representing induction loops, virtual ANPR CCTV cameras, and radar speed sensors at 8 key arterial junctions.',
      components: [
        'Inductive loop occupancy counts',
        'Virtual ANPR license plate parsing',
        'Doppler radar corridor speed',
        'Simulated IoT MQTT broker'
      ],
      latency: '< 150ms ingestion latency',
      samplePayload: {
        sensorId: 'LOOP_MED_SQ_04',
        vehicleCount10s: 38,
        averageVelocityKmH: 18.2,
        occupancyRatio: 0.86,
        anprConfidence: 0.982
      }
    },
    {
      id: 'data-processing',
      stepNumber: '02',
      title: 'TRAFFIC DATA PROCESSING',
      subtitle: 'Stream Aggregation Layer',
      icon: Cpu,
      accentColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      description:
        'Kalman filtering and rolling window calculations to eliminate sensor noise, compute road density percentages against design capacity, and smooth momentary traffic pulses.',
      components: [
        'Kalman state filtering',
        'Road capacity percentage estimation',
        'Spatial queue length projection',
        'Time-weighted exponential smoothing'
      ],
      latency: '~80ms compute interval',
      samplePayload: {
        junctionId: 'loc-medical-square',
        densityPercent: 86.4,
        waitingQueueMeters: 380,
        inflowRateVehPerMin: 54,
        outflowRateVehPerMin: 39
      }
    },
    {
      id: 'anomaly-detection',
      stepNumber: '03',
      title: 'CONGESTION & ANOMALY DETECTION',
      subtitle: 'Statistical Deviation Engine',
      icon: AlertTriangle,
      accentColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      description:
        'Compares real-time corridor metrics with 30-day historical time-of-day distributions. Flags unexpected bottlenecks, sudden volume surges, or abnormal queue build-up.',
      components: [
        'Z-score historical baseline comparison',
        'Road design capacity threshold triggers',
        'Spillover propagation risk scoring',
        'Multi-junction correlation check'
      ],
      latency: '~60ms evaluation interval',
      samplePayload: {
        anomalyDetected: true,
        type: 'HIGH_CONGESTION',
        severity: 'HIGH',
        baselineVolumeVehHr: 1840,
        currentVolumeVehHr: 2430,
        historicalDeviationPercent: 32.1
      }
    },
    {
      id: 'ai-agent',
      stepNumber: '04',
      title: 'AI TRAFFIC MANAGEMENT AGENT',
      subtitle: 'Predictive Inference & Reasoning Core',
      icon: Bot,
      accentColor: 'border-cyan-400 text-cyan-300 bg-cyan-500/20 shadow-cyan-950/50 shadow-lg',
      description:
        'Deterministic & heuristic optimization engine. Evaluates network topology, models downstream signal cycle impacts, and synthesizes clear, explainable mitigation recommendations.',
      components: [
        'Multi-corridor equilibrium solver',
        'Adaptive green-split recommendations',
        'Transparent rationale generator',
        'Alternative route deflection modeling'
      ],
      latency: '< 1.1s reasoning inference',
      samplePayload: {
        recommendedGreenSplitDeltaSec: 15,
        targetApproach: 'Wardha Southbound',
        projectedDelayReductionMin: 8.4,
        recommendedDiversionCorridor: 'corridor-south-central',
        confidenceScore: 94.6
      }
    },
    {
      id: 'decision-support',
      stepNumber: '05',
      title: 'DECISION SUPPORT',
      subtitle: 'Supervisory Authorization Gateway',
      icon: HelpCircle,
      accentColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
      description:
        'Enforces Human-in-the-Loop governance. Presents evidence, confidence scores, and time-saved projections to certified traffic operations personnel before execution.',
      components: [
        'Human authorization barrier',
        'Variable Message Sign (VMS) advisory staging',
        'SCATS / SCOOT signal plan preview',
        'Safety invariant verification'
      ],
      latency: 'Human-governed gate',
      samplePayload: {
        authorizationStatus: 'AWAITING_OPERATOR_SIGN_OFF',
        governanceTier: 'MUNICIPAL_CLASS_A',
        recommendedVmsMessage: 'HEAVY DELAY MEDICAL SQ. DIVERT VIA AJNI OVERPASS.'
      }
    },
    {
      id: 'dashboard-operator',
      stepNumber: '06',
      title: 'DASHBOARD / OPERATOR',
      subtitle: 'Command Center & Execution Log',
      icon: Monitor,
      accentColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      description:
        'Single-pane-of-glass operations console. Operator executes vetted action, overrides parameters, and logs immutable timestamped audit entries for post-incident review.',
      components: [
        'Real-time WebSocket telemetry rendering',
        'Interactive spatial Leaflet map',
        'Decision log immutable persistence',
        'Live ANPR stream monitoring'
      ],
      latency: 'Real-time 60fps reactive UI',
      samplePayload: {
        operatorId: 'Cmdr. A. Sharma',
        actionApprovedAt: '08:42:18 AM',
        status: 'DISPATCHED_TO_CONTROLLER'
      }
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[3];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            System Architecture
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-slate-400">End-to-End Pipeline Schematic</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Technical Architecture
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Modular micro-services pipeline powering predictive signal management and human supervisory support
        </p>
      </div>

      {/* Main Visual Architecture Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Animated Pipeline Flow (Vertical Sequence as requested) */}
        <div className="lg:col-span-2 space-y-3">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNode.id === node.id;

            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group shadow-lg ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400/40 shadow-cyan-950/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${node.accentColor}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            STAGE {node.stepNumber}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-[10px] font-mono text-cyan-400">
                            {node.subtitle}
                          </span>
                        </div>

                        <h3 className="text-sm font-extrabold text-white tracking-tight mt-0.5">
                          {node.title}
                        </h3>

                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {node.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 hidden sm:block">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                        {node.latency}
                      </span>
                    </div>
                  </div>
                </div>

                {index < nodes.length - 1 && (
                  <div className="flex items-center justify-center py-0.5">
                    <div className="flex flex-col items-center text-cyan-400">
                      <div className="w-0.5 h-3 bg-cyan-500/40" />
                      <ArrowDown className="w-4 h-4 -my-0.5 animate-bounce" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Col: Inspection Drawer for Selected Subsystem */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-1">
                Subsystem Specification
              </span>
              <h3 className="text-base font-bold text-white leading-snug">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{selectedNode.subtitle}</p>
            </div>

            {/* Components in this node */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Core Modules
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedNode.components.map((comp, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample JSON Telemetry Payload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Data Contract Payload
                </span>
                <span className="text-[10px] font-mono text-cyan-400">JSON Schema</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(selectedNode.samplePayload, null, 2)}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-slate-300 flex items-start gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Standardized REST/gRPC interfaces allow direct drop-in replacement with real city SCATS or
                OpenTraffic API endpoints.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
