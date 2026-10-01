import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 px-6 py-4 text-xs text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-bold text-slate-200">AI Traffic Management Agent</span>
          <span className="hidden sm:inline text-slate-600 mx-2">·</span>
          <span className="block sm:inline text-slate-400">
            Intelligent Traffic Analysis & Decision Support
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-cyan-400/90 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-0.5 rounded-full">
            Hackathon Prototype | Simulation Data
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active Node
          </span>
        </div>
      </div>
    </footer>
  );
};
