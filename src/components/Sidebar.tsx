import React from 'react';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  Bot,
  Route,
  BarChart3,
  Bell,
  ClipboardList,
  Cpu,
  Settings,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useTraffic, NavTab } from '../context/TrafficContext';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, isSimulating } = useTraffic();

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Traffic', icon: Activity },
    { id: 'map', label: 'Congestion Map', icon: MapPin },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot, highlight: true },
    { id: 'routes', label: 'Route Recommendations', icon: Route },
    { id: 'historical', label: 'Historical Analysis', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertsCount > 0 ? activeAlertsCount : undefined },
    { id: 'decisions', label: 'Decision Log', icon: ClipboardList },
    { id: 'architecture', label: 'Technical Architecture', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-xl shadow-lg shadow-cyan-950/40">
            🚦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">AI Traffic Agent</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Intelligent Traffic Analysis
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Operations Center
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAi = item.highlight;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? isAi
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/50'
                    : 'bg-slate-800 text-white border border-slate-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? isAi
                        ? 'text-cyan-400'
                        : 'text-blue-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isAi && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    Core
                  </span>
                )}
                {item.badge !== undefined && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Safety & System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isSimulating && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSimulating ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <div className="leading-tight">
              <span className="text-xs font-semibold text-slate-200 block">AI Agent Online</span>
              <span className="text-[10px] text-slate-400">Autonomous Inference Engine</span>
            </div>
          </div>
          <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">Human-in-the-Loop Safe</span>
        </div>
      </div>
    </aside>
  );
};
