export type CongestionLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type AlertType =
  | 'HIGH_CONGESTION'
  | 'SUDDEN_TRAFFIC_INCREASE'
  | 'ROAD_CAPACITY_EXCEEDED'
  | 'UNUSUAL_TRAFFIC_PATTERN';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type OperatorDecisionStatus =
  | 'MONITORING'
  | 'APPROVED'
  | 'DISPATCHED'
  | 'REJECTED'
  | 'RESOLVED';

export interface TrafficLocation {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  vehicleCount: number;
  baselineCount: number;
  avgSpeed: number; // km/h
  speedLimit: number;
  density: number; // percentage 0-100
  waitingTime: number; // seconds
  capacity: number; // max design vehicles/hr
  congestionLevel: CongestionLevel;
  statusText: string;
  activeCameras: number;
  signalPhase: 'GREEN' | 'YELLOW' | 'RED';
  greenSplitSec: number;
  lastUpdated: string;
}

export interface AlertItem {
  id: string;
  type: AlertType;
  locationId: string;
  locationName: string;
  time: string;
  timestamp: number;
  severity: AlertSeverity;
  detectedCondition: string;
  aiRecommendation: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  metricDelta?: string;
}

export interface DecisionLogEntry {
  id: string;
  time: string;
  timestamp: number;
  locationId: string;
  locationName: string;
  detectedIssue: string;
  aiAnalysis: string;
  recommendation: string;
  operatorStatus: OperatorDecisionStatus;
  operatorName: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  appliedAction?: string;
}

export interface RouteOption {
  name: string;
  from: string;
  to: string;
  distanceKm: number;
  durationMin: number;
  congestion: CongestionLevel;
  via: string;
  coordinates: [number, number][];
}

export interface RouteComparisonPair {
  id: string;
  corridorTitle: string;
  currentRoute: RouteOption;
  altRoute: RouteOption;
  estimatedTimeSavedMin: number;
  aiRecommendation: string;
}

export interface HistoricalHourlyData {
  hour: string;
  volume: number;
  speed: number;
  congestionPercent: number;
  baselineVolume: number;
}

export interface HotspotRanking {
  rank: number;
  locationName: string;
  congestionScore: number;
  peakHour: string;
  avgDelayMin: number;
  frequency: string;
}

export interface AnprEvent {
  id: string;
  timestamp: string;
  locationName: string;
  plateNumber: string;
  vehicleType: 'Car' | 'Bus' | 'Truck' | 'Motorbike' | 'EV Cab';
  speedKmH: number;
  status: 'NORMAL' | 'SPEEDING' | 'CONGESTED_ZONE';
}

export interface AiRecommendationResult {
  targetLocation: string;
  detectedIssue: string;
  analysis: string;
  severity: AlertSeverity;
  recommendedActions: string[];
  confidenceScore: number;
  timestamp: string;
  baselineComparison: string;
  projectedClearanceMin: number;
  evidence: {
    inflowRatePerMin: number;
    outflowRatePerMin: number;
    bottleneckRadiusMeters: number;
    historicalDeviationPercent: number;
  };
}
