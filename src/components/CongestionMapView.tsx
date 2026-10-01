import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Bot,
  Car,
  Gauge,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X
} from 'lucide-react';
import { useTraffic } from '../context/TrafficContext';
import { TrafficLocation, CongestionLevel } from '../types/traffic';

export const CongestionMapView: React.FC = () => {
  const {
    locations,
    selectedLocationId,
    selectLocation,
    setActiveTab,
    triggerAiAnalysis
  } = useTraffic();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const [activeLocation, setActiveLocation] = useState<TrafficLocation>(
    locations.find(l => l.id === selectedLocationId) || locations[0]
  );

  // Sync selected location
  useEffect(() => {
    const loc = locations.find(l => l.id === selectedLocationId);
    if (loc) {
      setActiveLocation(loc);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([loc.lat, loc.lng], 14, {
          duration: 1.2
        });
      }
    }
  }, [selectedLocationId, locations]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center map around Nagpur central coordinates
    const map = L.map(mapContainerRef.current, {
      center: [21.1350, 79.0800],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Dark tile layer (OpenStreetMap with CartoDB Dark Matter free tiles)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd'
      }
    ).addTo(map);

    // Arterial road network polylines connecting key nodes
    const roadCorridors: [number, number][][] = [
      // Wardha Road to Medical Sq corridor
      [
        [21.0921, 79.0765], // Manish Nagar
        [21.1054, 79.0689], // Wardha Road
        [21.1165, 79.0792], // Ajni Square
        [21.1278, 79.0989]  // Medical Square
      ],
      // Variety Square to Sadar corridor
      [
        [21.1442, 79.0848], // Variety Square
        [21.1625, 79.0831], // Sadar
        [21.1895, 79.1120]  // Kamptee Road
      ],
      // Medical Square to Variety Square
      [
        [21.1278, 79.0989],
        [21.1360, 79.0920],
        [21.1442, 79.0848]
      ],
      // Hingna T-Point to Wardha Road
      [
        [21.1189, 79.0125],
        [21.1120, 79.0400],
        [21.1054, 79.0689]
      ]
    ];

    roadCorridors.forEach(coords => {
      L.polyline(coords, {
        color: '#06b6d4',
        weight: 3,
        opacity: 0.45,
        dashArray: '6, 8'
      }).addTo(map);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when locations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    locations.forEach(loc => {
      let colorHex = '#10b981'; // green
      let glowHex = 'rgba(16, 185, 129, 0.4)';
      let symbol = '🟢';

      if (loc.congestionLevel === 'CRITICAL') {
        colorHex = '#881337'; // dark red
        glowHex = 'rgba(136, 19, 55, 0.7)';
        symbol = '🔴';
      } else if (loc.congestionLevel === 'HIGH') {
        colorHex = '#ef4444'; // red
        glowHex = 'rgba(239, 68, 68, 0.6)';
        symbol = '🔴';
      } else if (loc.congestionLevel === 'MODERATE') {
        colorHex = '#f59e0b'; // yellow
        glowHex = 'rgba(245, 158, 11, 0.5)';
        symbol = '🟡';
      }

      const isSelected = loc.id === activeLocation.id;

      const iconHtml = `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: ${glowHex}; animation: radar-pulse 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;"></div>
          <div style="width: ${isSelected ? '28px' : '22px'}; height: ${isSelected ? '28px' : '22px'}; border-radius: 9999px; background: ${colorHex}; border: 2.5px solid #ffffff; box-shadow: 0 0 14px ${colorHex}; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background: #ffffff;"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-traffic-marker',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      if (markersRef.current[loc.id]) {
        markersRef.current[loc.id].setIcon(customIcon);
        markersRef.current[loc.id].setLatLng([loc.lat, loc.lng]);
      } else {
        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          selectLocation(loc.id);
          setActiveLocation(loc);
        });
        markersRef.current[loc.id] = marker;
      }
    });
  }, [locations, activeLocation.id, selectLocation]);

  const handleAnalyzeLocation = () => {
    selectLocation(activeLocation.id);
    triggerAiAnalysis(activeLocation.id);
    setActiveTab('ai-agent');
  };

  const getStatusText = (level: CongestionLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'Critical Attention Required';
      case 'HIGH':
        return 'Attention Required';
      case 'MODERATE':
        return 'Advisory Monitoring';
      case 'LOW':
      default:
        return 'Optimal Flow';
    }
  };

  const getAiRecommendationSnippet = (loc: TrafficLocation) => {
    if (loc.density >= 70) {
      return 'Traffic volume is significantly above the historical baseline. Review signal timing and monitor an alternative route.';
    }
    if (loc.density >= 45) {
      return 'Moderate volume buildup. Maintain current signal split cycle while monitoring downstream corridor spillover.';
    }
    return 'Flow operates well within design capacity limits. Green-wave synchronization sustained.';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>City Congestion Map</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive spatial telematics & intersection diagnostics · Nagpur Smart Grid
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-950 border border-red-700 shadow-sm" />
            <span>Dark Red Critical</span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas + Detail Slide-over Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[650px] relative">
        {/* Map Viewport (2 cols on desktop) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Map Overlay Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg backdrop-blur-md"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg backdrop-blur-md"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.flyTo([21.1350, 79.0800], 13)}
              className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg backdrop-blur-md"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Location Pills on Bottom of Map */}
          <div className="absolute bottom-4 left-4 right-4 z-10 overflow-x-auto flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 shrink-0">
              Jump to:
            </span>
            {locations.map(loc => (
              <button
                key={loc.id}
                onClick={() => {
                  selectLocation(loc.id);
                  setActiveLocation(loc);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  loc.id === activeLocation.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    loc.congestionLevel === 'CRITICAL'
                      ? 'bg-red-800'
                      : loc.congestionLevel === 'HIGH'
                      ? 'bg-rose-500'
                      : loc.congestionLevel === 'MODERATE'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <span>{loc.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Detail Panel for Selected Location */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="space-y-4">
            {/* Header info */}
            <div className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  Intersection Diagnostic
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    activeLocation.congestionLevel === 'CRITICAL'
                      ? 'bg-red-950 text-red-300 border-red-800'
                      : activeLocation.congestionLevel === 'HIGH'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : activeLocation.congestionLevel === 'MODERATE'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {activeLocation.congestionLevel}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white tracking-tight uppercase">
                {activeLocation.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{activeLocation.area}</p>
            </div>

            {/* Metrics List matching prompt specs */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Traffic Status:</span>
                <span className="font-bold text-white font-sans">
                  {activeLocation.congestionLevel}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Vehicles:</span>
                <span className="font-bold text-white tabular-nums">
                  {activeLocation.vehicleCount.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Average Speed:</span>
                <span className="font-bold text-slate-200 tabular-nums">
                  {activeLocation.avgSpeed} km/h
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Waiting Time:</span>
                <span className="font-bold text-amber-300 tabular-nums">
                  {activeLocation.waitingTime} sec
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Congestion:</span>
                <span className="font-bold text-rose-400 tabular-nums">
                  {activeLocation.density}%
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-sans">AI Status:</span>
                <span className="font-bold text-cyan-300 font-sans">
                  {getStatusText(activeLocation.congestionLevel)}
                </span>
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                <Bot className="w-3.5 h-3.5" />
                <span>AI Recommendation</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                "{getAiRecommendationSnippet(activeLocation)}"
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleAnalyzeLocation}
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
