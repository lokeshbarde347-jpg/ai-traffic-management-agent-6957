import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrafficLocation,
  AlertItem,
  DecisionLogEntry,
  RouteComparisonPair,
  AnprEvent,
  AiRecommendationResult,
  OperatorDecisionStatus,
  CongestionLevel
} from '../types/traffic';
import {
  INITIAL_LOCATIONS,
  INITIAL_ALERTS,
  INITIAL_DECISION_LOGS,
  ROUTE_COMPARISONS,
  INITIAL_ANPR_EVENTS,
  DEFAULT_AI_ANALYSIS
} from '../data/mockTrafficData';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'ai' | 'route' | 'system';
  timestamp: string;
  read: boolean;
}

export type NavTab =
  | 'dashboard'
  | 'live'
  | 'map'
  | 'ai-agent'
  | 'routes'
  | 'historical'
  | 'alerts'
  | 'decisions'
  | 'architecture'
  | 'settings';

interface TrafficContextType {
  locations: TrafficLocation[];
  alerts: AlertItem[];
  decisionLogs: DecisionLogEntry[];
  routeComparisons: RouteComparisonPair[];
  anprEvents: AnprEvent[];
  aiAnalysis: AiRecommendationResult;
  isAnalyzing: boolean;
  isSimulating: boolean;
  simulationSpeed: 1 | 2 | 5;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedLocationId: string | null;
  selectedLocation: TrafficLocation | null;
  selectLocation: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setSimulationSpeed: (speed: 1 | 2 | 5) => void;
  triggerAiAnalysis: (targetLocId?: string) => Promise<void>;
  generateNewRecommendation: (targetLocId?: string) => void;
  approveAiRecommendation: (actionTaken?: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  updateDecisionStatus: (id: string, status: OperatorDecisionStatus, notes?: string) => void;
  injectScenario: (scenario: 'medical-surge' | 'rush-hour' | 'clear-corridors') => void;
  totalVehicles: number;
  highCongestionCount: number;
  averageSpeed: number;
  averageWaitingTime: number;
}

const TrafficContext = createContext<TrafficContextType | undefined>(undefined);

export const TrafficProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<TrafficLocation[]>(INITIAL_LOCATIONS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [decisionLogs, setDecisionLogs] = useState<DecisionLogEntry[]>(INITIAL_DECISION_LOGS);
  const [anprEvents, setAnprEvents] = useState<AnprEvent[]>(INITIAL_ANPR_EVENTS);
  const [aiAnalysis, setAiAnalysis] = useState<AiRecommendationResult>(DEFAULT_AI_ANALYSIS);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<1 | 2 | 5>(1);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>('loc-medical-square');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'High Congestion Alert',
      message: 'High congestion detected at Medical Square (+32% above baseline).',
      type: 'alert',
      timestamp: '08:42 AM',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Alternative Route Available',
      message: 'Alternative route via Manish Nagar saves 8 min compared to Wardha Road.',
      type: 'route',
      timestamp: '08:45 AM',
      read: false
    },
    {
      id: 'notif-3',
      title: 'AI Signal Timing Advisory',
      message: 'Recommended +15s green phase extension generated for Wardha Rd corridor.',
      type: 'ai',
      timestamp: '08:46 AM',
      read: false
    }
  ]);

  const selectedLocation = useMemo(() => {
    return locations.find(loc => loc.id === selectedLocationId) || locations[0];
  }, [locations, selectedLocationId]);

  // Key KPI aggregate metrics
  const totalVehicles = useMemo(() => {
    return locations.reduce((sum, l) => sum + l.vehicleCount, 0);
  }, [locations]);

  const highCongestionCount = useMemo(() => {
    return locations.filter(l => l.congestionLevel === 'HIGH' || l.congestionLevel === 'CRITICAL').length;
  }, [locations]);

  const averageSpeed = useMemo(() => {
    const total = locations.reduce((sum, l) => sum + l.avgSpeed, 0);
    return Math.round(total / (locations.length || 1));
  }, [locations]);

  const averageWaitingTime = useMemo(() => {
    const total = locations.reduce((sum, l) => sum + l.waitingTime, 0);
    return Math.round(total / (locations.length || 1));
  }, [locations]);

  // Simulation tick loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalMs = 3000 / simulationSpeed;
    const interval = setInterval(() => {
      setLocations(prevLocations => {
        return prevLocations.map(loc => {
          // Subtle realistic fluctuation
          const delta = Math.floor((Math.random() * 21 - 9) * (simulationSpeed === 1 ? 1 : 1.5));
          const newCount = Math.max(200, Math.min(loc.capacity + 250, loc.vehicleCount + delta));
          const rawDensity = Math.round((newCount / loc.capacity) * 100);
          const density = Math.min(99, Math.max(10, rawDensity));

          // Inverse speed calculation with noise
          let speed = Math.round(loc.speedLimit * (1 - (density / 130)) + (Math.random() * 4 - 2));
          speed = Math.max(12, Math.min(loc.speedLimit, speed));

          // Waiting time based on density
          let wait = Math.round((density / 100) * 110 + (Math.random() * 6 - 3));
          wait = Math.max(8, wait);

          let congestionLevel: CongestionLevel = 'LOW';
          let statusText = 'Optimal Free Flow';

          if (density >= 85) {
            congestionLevel = 'CRITICAL';
            statusText = 'Critical Gridlock Risk';
          } else if (density >= 70) {
            congestionLevel = 'HIGH';
            statusText = 'Heavy Inflow Congestion';
          } else if (density >= 45) {
            congestionLevel = 'MODERATE';
            statusText = 'Moderate Traffic Volume';
          }

          // Cycle traffic signal phase occasionally
          const phases: ('GREEN' | 'YELLOW' | 'RED')[] = ['GREEN', 'GREEN', 'YELLOW', 'RED'];
          const signalPhase = Math.random() > 0.8 ? phases[Math.floor(Math.random() * phases.length)] : loc.signalPhase;

          return {
            ...loc,
            vehicleCount: newCount,
            density,
            avgSpeed: speed,
            waitingTime: wait,
            congestionLevel,
            statusText,
            signalPhase,
            lastUpdated: '1s ago'
          };
        });
      });

      // Stream occasional ANPR event
      if (Math.random() > 0.5) {
        const sampleVehicles: ('Car' | 'Bus' | 'Truck' | 'Motorbike' | 'EV Cab')[] = [
          'Car', 'EV Cab', 'Motorbike', 'Bus', 'Truck'
        ];
        const randomLoc = INITIAL_LOCATIONS[Math.floor(Math.random() * INITIAL_LOCATIONS.length)];
        const randomPlate = `MH-31-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const randomSpeed = Math.floor(15 + Math.random() * 45);

        const newEvent: AnprEvent = {
          id: `anpr-${Date.now()}`,
          timestamp: timeStr,
          locationName: `${randomLoc.name} Cam #${Math.floor(1 + Math.random() * 4)}`,
          plateNumber: randomPlate,
          vehicleType: sampleVehicles[Math.floor(Math.random() * sampleVehicles.length)],
          speedKmH: randomSpeed,
          status: randomSpeed > 55 ? 'SPEEDING' : randomSpeed < 20 ? 'CONGESTED_ZONE' : 'NORMAL'
        };

        setAnprEvents(prev => [newEvent, ...prev.slice(0, 14)]);
      }

      // 10% chance to trigger realistic operational alert notification
      if (Math.random() > 0.85) {
        const notifTypes: { title: string; message: string; type: NotificationItem['type'] }[] = [
          {
            title: 'High Congestion Alert',
            message: 'Vehicle volume increased by 28% at Wardha Road corridor.',
            type: 'alert'
          },
          {
            title: 'Alternative Route Identified',
            message: 'Manish Nagar to Ajni link currently displays 8-min transit clearance.',
            type: 'route'
          },
          {
            title: 'Road Capacity Exceeded',
            message: 'Medical Square approach volume exceeded 85% safe lane saturation.',
            type: 'alert'
          },
          {
            title: 'Recurring Pattern Detected',
            message: 'Historical baseline match: Sitabuldi peak dispersal active.',
            type: 'ai'
          }
        ];
        const pick = notifTypes[Math.floor(Math.random() * notifTypes.length)];
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} AM`;
        
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: pick.title,
          message: pick.message,
          type: pick.type,
          timestamp: timeStr,
          read: false
        };
        setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  const selectLocation = useCallback((id: string | null) => {
    setSelectedLocationId(id);
  }, []);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const resetSimulation = useCallback(() => {
    setLocations(INITIAL_LOCATIONS);
    setAlerts(INITIAL_ALERTS);
    setDecisionLogs(INITIAL_DECISION_LOGS);
    setAnprEvents(INITIAL_ANPR_EVENTS);
    setAiAnalysis(DEFAULT_AI_ANALYSIS);
    setIsSimulating(true);
    setSimulationSpeed(1);
  }, []);

  // AI Analysis Generation
  const triggerAiAnalysis = useCallback(async (targetLocId?: string) => {
    setIsAnalyzing(true);
    const locId = targetLocId || selectedLocationId || 'loc-medical-square';
    const loc = locations.find(l => l.id === locId) || locations[0];

    // Simulate 1.1s neural processing
    await new Promise(resolve => setTimeout(resolve, 1100));

    const isHigh = loc.density >= 70;
    const isModerate = loc.density >= 45 && loc.density < 70;
    const deviationPercent = Math.round(((loc.vehicleCount - loc.baselineCount) / loc.baselineCount) * 100);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} AM`;

    const newResult: AiRecommendationResult = {
      targetLocation: loc.name,
      detectedIssue: isHigh
        ? `High congestion detected at ${loc.name}.`
        : isModerate
        ? `Moderate queue accumulation at ${loc.name}.`
        : `Normal operating flow verified at ${loc.name}.`,
      analysis: `Vehicle volume is ${Math.abs(deviationPercent)}% ${
        deviationPercent >= 0 ? 'above' : 'below'
      } the historical baseline (${loc.baselineCount.toLocaleString()} veh/hr baseline vs ${loc.vehicleCount.toLocaleString()} current). Density is ${loc.density}%.`,
      severity: isHigh ? 'HIGH' : isModerate ? 'MEDIUM' : 'LOW',
      confidenceScore: +(92 + Math.random() * 6).toFixed(1),
      timestamp: timeStr,
      baselineComparison: `${deviationPercent >= 0 ? '+' : ''}${deviationPercent}% deviation from historical average for this time period`,
      projectedClearanceMin: isHigh ? 18 : isModerate ? 10 : 4,
      recommendedActions: isHigh
        ? [
            `Review signal timing (+15s green split on primary ${loc.area} approach)`,
            `Monitor traffic buildup at secondary spillover feeder nodes`,
            `Consider broadcasting alternative diversion advisory via VMS`,
            `Continue monitoring for 15 minutes before implementing irreversible interventions`
          ]
        : isModerate
        ? [
            `Maintain current 90s signal cycle with balanced phase distribution`,
            `Monitor corridor inflow rate from adjacent sectors`,
            `Prepare standby timing plan B-04 if density breaches 70% threshold`
          ]
        : [
            `Maintain green-wave synchronization across ${loc.area}`,
            `Standard automated baseline monitoring; no human intervention needed`
          ],
      evidence: {
        inflowRatePerMin: Math.round(loc.vehicleCount / 45),
        outflowRatePerMin: Math.round((loc.vehicleCount * (loc.avgSpeed / 45)) / 45),
        bottleneckRadiusMeters: Math.round(loc.density * 4.2),
        historicalDeviationPercent: deviationPercent
      }
    };

    setAiAnalysis(newResult);
    setIsAnalyzing(false);

    // Also inject a notification
    setNotifications(prev => [
      {
        id: `notif-ai-${Date.now()}`,
        title: `AI Analysis Complete: ${loc.name}`,
        message: newResult.detectedIssue,
        type: 'ai',
        timestamp: timeStr,
        read: false
      },
      ...prev.slice(0, 19)
    ]);
  }, [locations, selectedLocationId]);

  const generateNewRecommendation = useCallback((targetLocId?: string) => {
    triggerAiAnalysis(targetLocId);
  }, [triggerAiAnalysis]);

  const approveAiRecommendation = useCallback((actionTaken?: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} AM`;

    const newLog: DecisionLogEntry = {
      id: `dec-${Date.now()}`,
      time: timeStr,
      timestamp: Date.now(),
      locationId: selectedLocationId || 'loc-medical-square',
      locationName: aiAnalysis.targetLocation,
      detectedIssue: aiAnalysis.detectedIssue,
      aiAnalysis: aiAnalysis.analysis,
      recommendation: aiAnalysis.recommendedActions[0] || 'Adaptive signal coordination',
      operatorStatus: 'APPROVED',
      operatorName: 'Cmdr. A. Sharma',
      priority: aiAnalysis.severity === 'HIGH' ? 'HIGH' : 'MEDIUM',
      appliedAction: actionTaken || 'Operator approved AI recommendation. Signal timing plan executed on SCATS controller.'
    };

    setDecisionLogs(prev => [newLog, ...prev]);

    // Also acknowledge related alert if present
    setAlerts(prev =>
      prev.map(a =>
        a.locationName.includes(aiAnalysis.targetLocation)
          ? { ...a, status: 'ACKNOWLEDGED' }
          : a
      )
    );

    // Toast notification
    setNotifications(prev => [
      {
        id: `notif-dec-${Date.now()}`,
        title: 'Decision Logged & Approved',
        message: `Action confirmed for ${aiAnalysis.targetLocation}: ${newLog.recommendation}`,
        type: 'system',
        timestamp: timeStr,
        read: false
      },
      ...prev.slice(0, 19)
    ]);
  }, [aiAnalysis, selectedLocationId]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'RESOLVED' } : a))
    );
  }, []);

  const updateDecisionStatus = useCallback(
    (id: string, status: OperatorDecisionStatus, notes?: string) => {
      setDecisionLogs(prev =>
        prev.map(entry =>
          entry.id === id
            ? {
                ...entry,
                operatorStatus: status,
                appliedAction: notes || entry.appliedAction
              }
            : entry
        )
      );
    },
    []
  );

  const injectScenario = useCallback((scenario: 'medical-surge' | 'rush-hour' | 'clear-corridors') => {
    if (scenario === 'medical-surge') {
      setLocations(prev =>
        prev.map(l =>
          l.id === 'loc-medical-square'
            ? {
                ...l,
                vehicleCount: 2790,
                density: 95,
                avgSpeed: 13,
                waitingTime: 118,
                congestionLevel: 'CRITICAL',
                statusText: 'Emergency Inflow Jam / Critical Bottleneck'
              }
            : l.id === 'loc-wardha-road'
            ? {
                ...l,
                vehicleCount: 3120,
                density: 89,
                avgSpeed: 17,
                waitingTime: 98,
                congestionLevel: 'HIGH',
                statusText: 'Airport Approach Severe Spillage'
              }
            : l
        )
      );
      triggerAiAnalysis('loc-medical-square');
    } else if (scenario === 'rush-hour') {
      setLocations(prev =>
        prev.map(l => {
          const surgeCount = Math.round(l.capacity * 0.88);
          return {
            ...l,
            vehicleCount: surgeCount,
            density: 88,
            avgSpeed: 18,
            waitingTime: 85,
            congestionLevel: 'HIGH',
            statusText: 'Citywide Peak Rush Convergence'
          };
        })
      );
    } else if (scenario === 'clear-corridors') {
      setLocations(prev =>
        prev.map(l => ({
          ...l,
          vehicleCount: Math.round(l.baselineCount * 0.75),
          density: 35,
          avgSpeed: l.speedLimit - 6,
          waitingTime: 22,
          congestionLevel: 'LOW',
          statusText: 'Corridors Stabilized / Free Flow'
        }))
      );
    }
  }, [triggerAiAnalysis]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <TrafficContext.Provider
      value={{
        locations,
        alerts,
        decisionLogs,
        routeComparisons: ROUTE_COMPARISONS,
        anprEvents,
        aiAnalysis,
        isAnalyzing,
        isSimulating,
        simulationSpeed,
        activeTab,
        setActiveTab,
        selectedLocationId,
        selectedLocation,
        selectLocation,
        searchQuery,
        setSearchQuery,
        notifications,
        dismissNotification,
        markAllNotificationsRead,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        setSimulationSpeed,
        triggerAiAnalysis,
        generateNewRecommendation,
        approveAiRecommendation,
        acknowledgeAlert,
        resolveAlert,
        updateDecisionStatus,
        injectScenario,
        totalVehicles,
        highCongestionCount,
        averageSpeed,
        averageWaitingTime
      }}
    >
      {children}
    </TrafficContext.Provider>
  );
};

export const useTraffic = () => {
  const context = useContext(TrafficContext);
  if (!context) {
    throw new Error('useTraffic must be used within a TrafficProvider');
  }
  return context;
};
