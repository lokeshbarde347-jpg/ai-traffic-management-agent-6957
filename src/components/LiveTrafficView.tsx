import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  ArrowUpDown,
  Bot,
  MapPin,
  TrendingUp,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  Gauge,
  SlidersHorizontal
} from 'lucide-react';
import { useTraffic } from '../context/TrafficContext';
import { CongestionLevel } from '../types/traffic';

export const LiveTrafficView: React.FC = () => {
  const {
    locations,
    searchQuery,
    setSearchQuery,
    selectLocation,
    setActiveTab,
    triggerAiAnalysis,
    isSimulating
  } = useTraffic();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [levelFilter, setLevelFilter] = useState<'ALL' | CongestionLevel>('ALL');
  const [sortBy, setSortBy] = useState<'density' | 'volume' | 'speed' | 'wait'>('density');

  const getCongestionColor = (level: CongestionLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          badge: 'bg-red-950 text-red-300 border-red-800/80',
          dot: 'bg-red-600',
          text: 'text-red-400',
          bar: 'bg-red-600'
        };
      case 'HIGH':
        return {
          badge: 'bg-rose-950/70 text-rose-300 border-rose-800/80',
          dot: 'bg-rose-500',
          text: 'text-rose-400',
          bar: 'bg-rose-500'
        };
      case 'MODERATE':
        return {
          badge: 'bg-amber-950/70 text-amber-300 border-amber-800/80',
          dot: 'bg-amber-400',
          text: 'text-amber-400',
          bar: 'bg-amber-400'
        };
      case 'LOW':
      default:
        return {
          badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
          dot: 'bg-emerald-400',
          text: 'text-emerald-400',
          bar: 'bg-emerald-400'
        };
    }
  };

  const filteredLocations = locations
    .filter(loc => {
      const matchesSearch =
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.area.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = levelFilter === 'ALL' || loc.congestionLevel === levelFilter;
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      if (sortBy === 'density') return b.density - a.density;
      if (sortBy === 'volume') return b.vehicleCount - a.vehicleCount;
      if (sortBy === 'speed') return a.avgSpeed - b.avgSpeed;
      if (sortBy === 'wait') return b.waitingTime - a.waitingTime;
      return 0;
    });

  const handleInspectInAi = (locId: string) => {
    selectLocation(locId);
    triggerAiAnalysis(locId);
    setActiveTab('ai-agent');
  };

  const handleLocateOnMap = (locId: string) => {
    selectLocation(locId);
    setActiveTab('map');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Live Arterial Telemetry
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isSimulating ? 'animate-ping' : ''}`} />
              Streaming (3s cycle)
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Live Traffic Monitoring
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous surveillance across 8 major Nagpur arterial junctions & expressways
          </p>
        </div>

        {/* View Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter segmented buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  levelFilter === lvl
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'ALL' ? 'All (8)' : lvl}
              </button>
            ))}
          </div>

          {/* Toggle Table vs Grid */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search & Sort Bar */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter location name or area..."
            className="w-full bg-transparent border-none text-slate-200 placeholder-slate-400 focus:outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="density">Density (Highest first)</option>
            <option value="volume">Vehicle Count</option>
            <option value="wait">Waiting Time</option>
            <option value="speed">Speed (Slowest first)</option>
          </select>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-3 text-right">Vehicle Count</th>
                  <th className="py-3.5 px-3 text-right">Avg Speed</th>
                  <th className="py-3.5 px-3 text-right">Traffic Density</th>
                  <th className="py-3.5 px-3 text-right">Waiting Time</th>
                  <th className="py-3.5 px-3 text-right">Road Capacity</th>
                  <th className="py-3.5 px-3 text-center">Congestion</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLocations.map(loc => {
                  const colors = getCongestionColor(loc.congestionLevel);

                  return (
                    <tr
                      key={loc.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => handleLocateOnMap(loc.id)}
                    >
                      {/* Location Name & Area */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-bold text-white group-hover:text-cyan-400 transition-colors text-xs flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                          <span>{loc.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">{loc.area}</div>
                      </td>

                      {/* Vehicle Count */}
                      <td className="py-3.5 px-3 text-right font-bold text-slate-100 tabular-nums">
                        {loc.vehicleCount.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal block">
                          baseline: {loc.baselineCount.toLocaleString()}
                        </span>
                      </td>

                      {/* Average Speed */}
                      <td className="py-3.5 px-3 text-right tabular-nums">
                        <span className="font-bold text-slate-200">{loc.avgSpeed}</span>
                        <span className="text-slate-400 text-[10px] font-sans"> km/h</span>
                      </td>

                      {/* Traffic Density with mini-bar */}
                      <td className="py-3.5 px-3 text-right tabular-nums">
                        <span className={`font-bold ${colors.text}`}>{loc.density}%</span>
                        <div className="w-16 bg-slate-800 h-1 rounded-full mt-1.5 ml-auto overflow-hidden">
                          <div
                            className={`h-full rounded-full ${colors.bar}`}
                            style={{ width: `${loc.density}%` }}
                          />
                        </div>
                      </td>

                      {/* Waiting Time */}
                      <td className="py-3.5 px-3 text-right tabular-nums font-bold text-amber-300">
                        {loc.waitingTime} <span className="text-slate-400 text-[10px] font-sans">sec</span>
                      </td>

                      {/* Road Capacity */}
                      <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">
                        {loc.capacity.toLocaleString()} <span className="text-[10px]">veh/h</span>
                      </td>

                      {/* Congestion Level */}
                      <td className="py-3.5 px-3 text-center font-sans">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}
                        >
                          {loc.congestionLevel}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 font-sans text-[11px] text-slate-300">
                        {loc.statusText}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center font-sans" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleInspectInAi(loc.id)}
                            className="p-1.5 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/60 rounded-lg transition-colors"
                            title="Inspect in AI Agent"
                          >
                            <Bot className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleLocateOnMap(loc.id)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="View on Congestion Map"
                          >
                            <MapPin className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredLocations.map(loc => {
            const colors = getCongestionColor(loc.congestionLevel);

            return (
              <div
                key={loc.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                        {loc.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{loc.area}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}
                    >
                      {loc.congestionLevel}
                    </span>
                  </div>

                  <div className="space-y-2 py-2 border-y border-slate-800/80 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans text-[11px]">Vehicle Count:</span>
                      <span className="font-bold text-white tabular-nums">
                        {loc.vehicleCount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans text-[11px]">Average Speed:</span>
                      <span className="font-bold text-slate-200 tabular-nums">{loc.avgSpeed} km/h</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans text-[11px]">Traffic Density:</span>
                      <span className={`font-bold tabular-nums ${colors.text}`}>{loc.density}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans text-[11px]">Waiting Time:</span>
                      <span className="font-bold text-amber-300 tabular-nums">{loc.waitingTime} sec</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans text-[11px]">Road Capacity:</span>
                      <span className="text-slate-400 tabular-nums">{loc.capacity.toLocaleString()} veh/h</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] text-slate-400 block mb-1">Status:</span>
                    <span className="text-xs text-slate-200 font-medium block">
                      {loc.statusText}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleInspectInAi(loc.id)}
                    className="flex-1 py-1.5 px-2 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 text-cyan-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI Agent</span>
                  </button>

                  <button
                    onClick={() => handleLocateOnMap(loc.id)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                    title="View on Map"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
