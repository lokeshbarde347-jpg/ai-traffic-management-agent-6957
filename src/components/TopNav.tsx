import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  User,
  Zap,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useTraffic, NavTab } from '../context/TrafficContext';

export const TopNav: React.FC = () => {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    isSimulating,
    simulationSpeed,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSimulationSpeed,
    injectScenario,
    notifications,
    dismissNotification,
    markAllNotificationsRead,
    setActiveTab
  } = useTraffic();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isScenarioOpen, setIsScenarioOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', sub: 'Traffic Intelligence & Decision Center' };
      case 'live':
        return { title: 'Live Traffic Monitoring', sub: 'Real-time Arterial Corridors & Density' };
      case 'map':
        return { title: 'Congestion Map', sub: 'Spatial Grid & Intersection Diagnostics' };
      case 'ai-agent':
        return { title: 'AI Traffic Management Agent', sub: 'Predictive Inference & Autonomous Reasoning' };
      case 'routes':
        return { title: 'Route Recommendations', sub: 'Dynamic Traffic Balancing & Divert Planning' };
      case 'historical':
        return { title: 'Historical Analysis', sub: 'Recurring Pattern Mining & Baseline Analytics' };
      case 'alerts':
        return { title: 'Alert Center', sub: 'Anomaly Detection & Threshold Breaches' };
      case 'decisions':
        return { title: 'Decision Log', sub: 'Human-in-the-Loop Audit Trail' };
      case 'architecture':
        return { title: 'Technical Architecture', sub: 'End-to-End Pipeline & System Schematics' };
      case 'settings':
        return { title: 'System Settings', sub: 'Simulation Telemetry & Threshold Controls' };
      default:
        return { title: 'Operations Control', sub: 'Smart City Intelligent Traffic Grid' };
    }
  };

  const { title } = getPageTitle(activeTab);

  return (
    <header className="h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 z-20 shrink-0">
      {/* Left: Page Title */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight leading-tight flex items-center gap-2">
            <span>{title}</span>
            {activeTab === 'ai-agent' && (
              <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                Active Reasoning
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search intersection, route, or alert..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls: Clock, Simulation Controls, Notifications, Operator */}
      <div className="flex items-center gap-3">
        {/* Live Clock */}
        <div className="hidden lg:flex flex-col items-end text-right px-2 py-0.5 rounded border border-slate-800/60 bg-slate-900/40">
          <span className="text-xs font-mono font-semibold text-slate-200 tracking-tight">
            {currentTime || '08:42:00 AM'}
          </span>
          <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
            {currentDate || 'Today'} · IST
          </span>
        </div>

        {/* Demo Simulation Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-lg">
          {isSimulating ? (
            <button
              onClick={pauseSimulation}
              title="Pause Simulation"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/50 rounded-md transition-colors whitespace-nowrap"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Pause</span>
            </button>
          ) : (
            <button
              onClick={startSimulation}
              title="Start Simulation"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/50 rounded-md transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Start Simulation</span>
            </button>
          )}

          <button
            onClick={resetSimulation}
            title="Reset Simulation"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center text-[10px] font-mono font-semibold bg-slate-950 border border-slate-800/90 rounded px-1 py-0.5 gap-1">
            {([1, 2, 5] as const).map(speed => (
              <button
                key={speed}
                onClick={() => setSimulationSpeed(speed)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  simulationSpeed === speed
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Scenario Injector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsScenarioOpen(!isScenarioOpen)}
              className="px-2 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1"
              title="Inject Traffic Scenarios"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="hidden xl:inline">Scenarios</span>
            </button>

            {isScenarioOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Inject Hackathon Demo Events
                </div>
                <button
                  onClick={() => {
                    injectScenario('medical-surge');
                    setIsScenarioOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-start gap-2 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-rose-300">Surge at Medical Sq</div>
                    <div className="text-[11px] text-slate-400">95% density critical gridlock</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    injectScenario('rush-hour');
                    setIsScenarioOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-start gap-2 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-300">Citywide Peak Rush</div>
                    <div className="text-[11px] text-slate-400">88% load across all 8 corridors</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    injectScenario('clear-corridors');
                    setIsScenarioOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-start gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-emerald-300">All Corridors Clear</div>
                    <div className="text-[11px] text-slate-400">Reset to free flow</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notification Bell with Badge & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-lg shadow-rose-950">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Real-time Advisories ({notifications.length})
                </span>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Mark read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-slate-400">No active advisories</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors relative group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-200 text-xs">{n.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                      <button
                        onClick={() => dismissNotification(n.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Operator Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-white shadow-md">
            AS
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <span className="text-xs font-semibold text-slate-200 block">Cmdr. A. Sharma</span>
            <span className="text-[10px] text-slate-400">Lead Traffic Analyst</span>
          </div>
        </div>
      </div>
    </header>
  );
};
