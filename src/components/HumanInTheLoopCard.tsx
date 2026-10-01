import React from 'react';
import { ShieldAlert, CheckCircle, Info } from 'lucide-react';

export const HumanInTheLoopCard: React.FC<{ compact?: boolean }> = ({ compact }) => {
  if (compact) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300 font-medium">
            AI provides recommendations — <strong className="text-white font-semibold">humans make the final operational decision.</strong>
          </span>
        </div>
        <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded shrink-0">
          Supervisory Control Only
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/20 border border-cyan-500/20 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Human-in-the-Loop Operational Safeguard
            </h4>
            <p className="text-sm font-semibold text-slate-100">
              AI provides recommendations — humans make the final operational decision.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-lg self-start sm:self-auto">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supervisory Clearance Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">Simulated Traffic Data</span>
            <span className="text-[11px] text-slate-400">Arterial flows generated from dynamic stochastic models.</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">No Auto-Signal Override</span>
            <span className="text-[11px] text-slate-400">Physical signal timing controllers require manual operator lock.</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">AI Recommendations Only</span>
            <span className="text-[11px] text-slate-400">Action plans present clear transparent evidence and rationale.</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">Operator Accountability</span>
            <span className="text-[11px] text-slate-400">All implemented decisions are logged to the immutable audit trail.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
