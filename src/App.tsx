import React from 'react';
import { TrafficProvider, useTraffic } from './context/TrafficContext';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { LiveTrafficView } from './components/LiveTrafficView';
import { CongestionMapView } from './components/CongestionMapView';
import { AiAgentView } from './components/AiAgentView';
import { RouteRecommendationsView } from './components/RouteRecommendationsView';
import { HistoricalAnalysisView } from './components/HistoricalAnalysisView';
import { AlertCenterView } from './components/AlertCenterView';
import { DecisionLogView } from './components/DecisionLogView';
import { TechnicalArchitectureView } from './components/TechnicalArchitectureView';
import { SettingsView } from './components/SettingsView';
import { Footer } from './components/Footer';
import { Bell, X, Sparkles, AlertTriangle, Route } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, notifications, dismissNotification } = useTraffic();

  // Pick view based on activeTab
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'live':
        return <LiveTrafficView />;
      case 'map':
        return <CongestionMapView />;
      case 'ai-agent':
        return <AiAgentView />;
      case 'routes':
        return <RouteRecommendationsView />;
      case 'historical':
        return <HistoricalAnalysisView />;
      case 'alerts':
        return <AlertCenterView />;
      case 'decisions':
        return <DecisionLogView />;
      case 'architecture':
        return <TechnicalArchitectureView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  // Recent floating toast notification
  const latestUnread = notifications.filter(n => !n.read)[0];

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {renderView()}
          </div>
          <Footer />
        </main>
      </div>

      {/* Floating Real-Time Toast Notification */}
      {latestUnread && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                {latestUnread.type === 'alert' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                ) : latestUnread.type === 'route' ? (
                  <Route className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  Live Dispatch Stream · {latestUnread.timestamp}
                </span>
                <h4 className="text-xs font-bold text-white mt-0.5">{latestUnread.title}</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {latestUnread.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => dismissNotification(latestUnread.id)}
              className="text-slate-400 hover:text-white shrink-0 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <TrafficProvider>
      <AppContent />
    </TrafficProvider>
  );
}
