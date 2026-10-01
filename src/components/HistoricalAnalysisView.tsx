import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Gauge,
  Flame,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';
import { HISTORICAL_HOURLY_DATA, HOTSPOT_RANKINGS } from '../data/mockTrafficData';
import { useTraffic } from '../context/TrafficContext';

export const HistoricalAnalysisView: React.FC = () => {
  const { selectLocation, setActiveTab } = useTraffic();
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('today');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dataset = HISTORICAL_HOURLY_DATA[timeFilter];

  // Max calculations for clean SVG scaling
  const maxVolume = Math.max(...dataset.map(d => d.volume), 7000);
  const maxSpeed = 60;

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Longitudinal Intelligence
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400">Multi-Epoch Baselining</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Historical Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Temporal traffic volume distributions, recurring delay spikes, and anomaly profiling
          </p>
        </div>

        {/* Filter Tabs: Today / 7 Days / 30 Days */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              timeFilter === 'today'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Today (Hourly)
          </button>
          <button
            onClick={() => setTimeFilter('7days')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              timeFilter === '7days'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7 Days (Daily)
          </button>
          <button
            onClick={() => setTimeFilter('30days')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              timeFilter === '30days'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            30 Days (Weekly)
          </button>
        </div>
      </div>

      {/* Historical Explanation Banner (per prompt specification) */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Baseline Methodology:</span> Historical analysis
          identifies locations where congestion repeatedly occurs during similar time periods.
          Deviations exceeding $2\sigma$ from the rolling 30-day baseline trigger automatic AI advisory
          synthesis.
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Traffic Volume by Hour */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Traffic Volume by Hour
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Vehicles per hour vs baseline curve</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded bg-cyan-400" /> Current Volume
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded bg-slate-600" /> Baseline
              </span>
            </div>
          </div>

          {/* SVG Bar & Baseline Line Chart */}
          <div className="h-56 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${dataset.length * 36} 200`}>
              {/* Horizontal Gridlines */}
              {[0, 50, 100, 150].map((y, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={y}
                  x2={dataset.length * 36}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Bars for Volume */}
              {dataset.map((d, i) => {
                const barHeight = (d.volume / maxVolume) * 170;
                const baselineY = 200 - (d.baselineVolume / maxVolume) * 170;
                const x = i * 36 + 6;

                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer group"
                  >
                    <rect
                      x={x}
                      y={200 - barHeight}
                      width={22}
                      height={barHeight}
                      rx="4"
                      className={`transition-all ${
                        hoveredIndex === i
                          ? 'fill-cyan-400'
                          : d.volume > d.baselineVolume * 1.2
                          ? 'fill-rose-500/80 hover:fill-rose-400'
                          : 'fill-cyan-500/60 hover:fill-cyan-400'
                      }`}
                    />

                    {/* Baseline indicator tick */}
                    <line
                      x1={x - 2}
                      y1={baselineY}
                      x2={x + 24}
                      y2={baselineY}
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />

                    {/* X-axis label */}
                    <text
                      x={x + 11}
                      y="195"
                      textAnchor="middle"
                      className="text-[9px] fill-slate-400 font-mono"
                    >
                      {d.hour.slice(0, 5)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {hoveredIndex !== null && dataset[hoveredIndex] && (
              <div className="absolute top-2 right-2 bg-slate-950/90 border border-slate-700 rounded-lg p-2 text-[10px] font-mono shadow-xl pointer-events-none">
                <span className="text-white font-bold block">{dataset[hoveredIndex].hour}</span>
                <span className="text-cyan-300 block">
                  Volume: {dataset[hoveredIndex].volume.toLocaleString()} veh
                </span>
                <span className="text-slate-400 block">
                  Baseline: {dataset[hoveredIndex].baselineVolume.toLocaleString()} veh
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Average Speed by Hour */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Average Speed by Hour
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Corridor velocity (km/h)</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              Design Target: 45 km/h
            </span>
          </div>

          <div className="h-56 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${dataset.length * 36} 200`}>
              {/* Speed Target Line at 45km/h */}
              <line
                x1="0"
                y1={200 - (45 / maxSpeed) * 170}
                x2={dataset.length * 36}
                y2={200 - (45 / maxSpeed) * 170}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.6"
              />

              {/* Connected Line Path */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={dataset
                  .map((d, i) => `${i * 36 + 17},${200 - (d.speed / maxSpeed) * 170}`)
                  .join(' ')}
              />

              {/* Data points */}
              {dataset.map((d, i) => {
                const cx = i * 36 + 17;
                const cy = 200 - (d.speed / maxSpeed) * 170;

                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={d.speed < 20 ? 4.5 : 3.5}
                    className={`transition-all ${
                      d.speed < 20
                        ? 'fill-rose-500 stroke-slate-950 stroke-2'
                        : 'fill-cyan-400 stroke-slate-950 stroke-2'
                    }`}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 3: Congestion Trend (% density over time) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Congestion Trend Index
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Average density percentage</p>
            </div>
            <span className="text-[10px] font-mono text-rose-400">
              Peak: 91% (18:00 Evening Rush)
            </span>
          </div>

          <div className="h-48 w-full flex items-end gap-1.5 pt-4">
            {dataset.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full bg-slate-800 rounded-t-sm h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full transition-all rounded-t-sm ${
                      d.congestionPercent >= 80
                        ? 'bg-rose-500 group-hover:bg-rose-400'
                        : d.congestionPercent >= 60
                        ? 'bg-amber-400 group-hover:bg-amber-300'
                        : 'bg-emerald-500 group-hover:bg-emerald-400'
                    }`}
                    style={{ height: `${d.congestionPercent}%` }}
                  />
                </div>
                <span className="text-[8px] font-mono text-slate-400 truncate max-w-full">
                  {d.hour.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Vehicle Count Composition */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                4. Vehicle Count by Fleet Composition
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Modal share distribution</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Two-Wheelers (Motorcycles & Scooters)</span>
                <span className="font-mono font-bold text-white">48% (~6,166 veh)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Light Motor Vehicles (Cars, Cabs, EVs)</span>
                <span className="font-mono font-bold text-white">34% (~4,367 veh)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '34%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Public Transit (City Buses & Shuttles)</span>
                <span className="font-mono font-bold text-white">11% (~1,413 veh)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '11%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Heavy Commercial / Freight</span>
                <span className="font-mono font-bold text-white">7% (~900 veh)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '7%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recurring Hotspots Ranking List (per prompt specification) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>5. Recurring Congestion Locations (Hotspots Ranking)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by frequency of threshold breach and cumulative network delay
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Nagpur Metropolitan Traffic Grid
          </span>
        </div>

        <div className="space-y-3">
          {HOTSPOT_RANKINGS.map(item => (
            <div
              key={item.rank}
              onClick={() => {
                selectLocation(
                  item.locationName === 'Medical Square'
                    ? 'loc-medical-square'
                    : item.locationName === 'Wardha Road'
                    ? 'loc-wardha-road'
                    : item.locationName === 'Sadar'
                    ? 'loc-sadar'
                    : 'loc-variety-square'
                );
                setActiveTab('map');
              }}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                    item.rank === 1
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : item.rank === 2
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  #{item.rank}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs group-hover:text-cyan-400 transition-colors">
                    {item.locationName}
                  </h4>
                  <p className="text-[11px] text-slate-400">{item.frequency}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs font-mono text-right md:text-left">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Congestion Index</span>
                  <span className="font-bold text-rose-400">{item.congestionScore}/100</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Peak Hours</span>
                  <span className="font-bold text-slate-200">{item.peakHour}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Avg Delay Added</span>
                  <span className="font-bold text-amber-300">+{item.avgDelayMin} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
