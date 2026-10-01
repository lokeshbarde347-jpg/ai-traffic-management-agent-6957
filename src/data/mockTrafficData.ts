import {
  TrafficLocation,
  AlertItem,
  DecisionLogEntry,
  RouteComparisonPair,
  HistoricalHourlyData,
  HotspotRanking,
  AnprEvent,
  AiRecommendationResult
} from '../types/traffic';

export const INITIAL_LOCATIONS: TrafficLocation[] = [
  {
    id: 'loc-medical-square',
    name: 'Medical Square',
    area: 'Central Medical Corridor',
    lat: 21.1278,
    lng: 79.0989,
    vehicleCount: 2430,
    baselineCount: 1840,
    avgSpeed: 18,
    speedLimit: 50,
    density: 86,
    waitingTime: 94,
    capacity: 2800,
    congestionLevel: 'HIGH',
    statusText: 'Severe Inflow Congestion',
    activeCameras: 6,
    signalPhase: 'RED',
    greenSplitSec: 35,
    lastUpdated: 'Just now'
  },
  {
    id: 'loc-wardha-road',
    name: 'Wardha Road',
    area: 'South Arterial Expressway',
    lat: 21.1054,
    lng: 79.0689,
    vehicleCount: 2890,
    baselineCount: 2150,
    avgSpeed: 21,
    speedLimit: 60,
    density: 81,
    waitingTime: 82,
    capacity: 3400,
    congestionLevel: 'HIGH',
    statusText: 'Heavy Airport Corridor Queue',
    activeCameras: 8,
    signalPhase: 'GREEN',
    greenSplitSec: 50,
    lastUpdated: 'Just now'
  },
  {
    id: 'loc-variety-square',
    name: 'Variety Square',
    area: 'Sitabuldi Commercial Hub',
    lat: 21.1442,
    lng: 79.0848,
    vehicleCount: 1940,
    baselineCount: 1680,
    avgSpeed: 24,
    speedLimit: 40,
    density: 68,
    waitingTime: 58,
    capacity: 2600,
    congestionLevel: 'MODERATE',
    statusText: 'Pedestrian & Transit Delay',
    activeCameras: 6,
    signalPhase: 'YELLOW',
    greenSplitSec: 40,
    lastUpdated: 'Just now'
  },
  {
    id: 'loc-sadar',
    name: 'Sadar',
    area: 'Residency Market Zone',
    lat: 21.1625,
    lng: 79.0831,
    vehicleCount: 1520,
    baselineCount: 1450,
    avgSpeed: 28,
    speedLimit: 45,
    density: 56,
    waitingTime: 44,
    capacity: 2500,
    congestionLevel: 'MODERATE',
    statusText: 'Stable Flow with On-street Parking',
    activeCameras: 4,
    signalPhase: 'GREEN',
    greenSplitSec: 45,
    lastUpdated: 'Just now'
  },
  {
    id: 'loc-ajni-square',
    name: 'Ajni Square',
    area: 'Railway Flyover Junction',
    lat: 21.1165,
    lng: 79.0792,
    vehicleCount: 1680,
    baselineCount: 1590,
    avgSpeed: 33,
    speedLimit: 50,
    density: 52,
    waitingTime: 41,
    capacity: 3000,
    congestionLevel: 'MODERATE',
    statusText: 'Flow Managed by Overpass',
    activeCameras: 5,
    signalPhase: 'GREEN',
    greenSplitSec: 45,
    lastUpdated: 'Just now'
  },
  {
    id: 'loc-manish-nagar',
    name: 'Manish Nagar',
    area: 'Residential Crossing & Underbridge',
    lat: 21.0921,
    lng: 79.0765,
    vehicleCount: 1120,
    baselineCount: 1200,
    avgSpeed: 36,
    speedLimit: 45,
    density: 38,
    waitingTime: 28,
    capacity: 2200,
    congestionLevel: 'LOW',
    statusText: 'Unimpeded Underbridge Flow',
    activeCameras: 4,
    signalPhase: 'GREEN',
    greenSplitSec: 50,
    lastUpdated: 'Just now'
  },
  {
    id: 'loc-hingna-t-point',
    name: 'Hingna T-Point',
    area: 'Industrial Belt MIDC Link',
    lat: 21.1189,
    lng: 79.0125,
    vehicleCount: 790,
    baselineCount: 880,
    avgSpeed: 42,
    speedLimit: 60,
    density: 29,
    waitingTime: 18,
    capacity: 2600,
    congestionLevel: 'LOW',
    statusText: 'Free-flow Freight Corridor',
    activeCameras: 4,
    signalPhase: 'GREEN',
    greenSplitSec: 55,
    lastUpdated: 'Just now'
  },
  {
    id: 'loc-kamptee-road',
    name: 'Kamptee Road',
    area: 'Northern National Highway Entry',
    lat: 21.1895,
    lng: 79.1120,
    vehicleCount: 476,
    baselineCount: 520,
    avgSpeed: 48,
    speedLimit: 65,
    density: 22,
    waitingTime: 12,
    capacity: 2400,
    congestionLevel: 'LOW',
    statusText: 'Optimal Highway Conditions',
    activeCameras: 5,
    signalPhase: 'GREEN',
    greenSplitSec: 60,
    lastUpdated: 'Just now'
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-01',
    type: 'HIGH_CONGESTION',
    locationId: 'loc-medical-square',
    locationName: 'Medical Square',
    time: '08:42 AM',
    timestamp: Date.now() - 1000 * 60 * 14,
    severity: 'HIGH',
    detectedCondition: 'Vehicle volume 32% above historical baseline with severe bottleneck on south approach.',
    aiRecommendation: 'Review signal timing (+15s green phase) and monitor alternative corridor via Ajni-Manish link.',
    status: 'ACTIVE',
    metricDelta: '+32% volume'
  },
  {
    id: 'alert-02',
    type: 'ROAD_CAPACITY_EXCEEDED',
    locationId: 'loc-wardha-road',
    locationName: 'Wardha Road',
    time: '08:48 AM',
    timestamp: Date.now() - 1000 * 60 * 8,
    severity: 'HIGH',
    detectedCondition: 'Traffic volume reaches 85% of design capacity due to airport-bound peak clustering.',
    aiRecommendation: 'Activate dynamic variable message signs to divert light vehicles to Ring Road.',
    status: 'ACTIVE',
    metricDelta: '85% design load'
  },
  {
    id: 'alert-03',
    type: 'SUDDEN_TRAFFIC_INCREASE',
    locationId: 'loc-variety-square',
    locationName: 'Variety Square',
    time: '08:51 AM',
    timestamp: Date.now() - 1000 * 60 * 5,
    severity: 'MEDIUM',
    detectedCondition: 'Rapid 18% spike in two-wheeler density within 10 minutes at Sitabuldi market access.',
    aiRecommendation: 'Extend yellow clearance interval and notify metro feeder traffic marshals.',
    status: 'ACTIVE',
    metricDelta: '+18% 10m surge'
  },
  {
    id: 'alert-04',
    type: 'UNUSUAL_TRAFFIC_PATTERN',
    locationId: 'loc-sadar',
    locationName: 'Sadar',
    time: '08:54 AM',
    timestamp: Date.now() - 1000 * 60 * 2,
    severity: 'MEDIUM',
    detectedCondition: 'Speed drop from 38 km/h to 24 km/h inconsistent with typical weekday morning profile.',
    aiRecommendation: 'Verify CCTV feed for stalled freight delivery or double-parked commercial vehicle.',
    status: 'ACTIVE',
    metricDelta: '-37% avg speed'
  },
  {
    id: 'alert-05',
    type: 'HIGH_CONGESTION',
    locationId: 'loc-medical-square',
    locationName: 'Medical Square (North Gate)',
    time: '08:56 AM',
    timestamp: Date.now() - 1000 * 30,
    severity: 'HIGH',
    detectedCondition: 'Waiting time exceeded 90s threshold across 3 successive signal cycles.',
    aiRecommendation: 'Request operator approval for adaptive cycle extension of 20 seconds.',
    status: 'ACTIVE',
    metricDelta: '94s avg wait'
  }
];

export const INITIAL_DECISION_LOGS: DecisionLogEntry[] = [
  {
    id: 'dec-101',
    time: '08:42 AM',
    timestamp: Date.now() - 1000 * 60 * 14,
    locationId: 'loc-medical-square',
    locationName: 'Medical Square',
    detectedIssue: 'High Congestion',
    aiAnalysis: 'Volume 32% above baseline; queues propagating toward Untkhana road.',
    recommendation: 'Review signal timing (+15s green split) & monitor Manish Nagar alternative route.',
    operatorStatus: 'MONITORING',
    operatorName: 'Cmdr. A. Sharma',
    priority: 'HIGH',
    appliedAction: 'Phase cycle lengthened to 110s; secondary ward marshals alerted.'
  },
  {
    id: 'dec-102',
    time: '08:35 AM',
    timestamp: Date.now() - 1000 * 60 * 21,
    locationId: 'loc-wardha-road',
    locationName: 'Wardha Road',
    detectedIssue: 'Capacity Approaching Limit',
    aiAnalysis: 'Airport corridor volume reached 2,820 veh/hr; speed reduced by 22%.',
    recommendation: 'Broadcast VMS diversion advice toward Outer Ring Road.',
    operatorStatus: 'APPROVED',
    operatorName: 'Cmdr. A. Sharma',
    priority: 'HIGH',
    appliedAction: 'VMS Board #4 and #7 active with advisory notice.'
  },
  {
    id: 'dec-103',
    time: '08:18 AM',
    timestamp: Date.now() - 1000 * 60 * 38,
    locationId: 'loc-variety-square',
    locationName: 'Variety Square',
    detectedIssue: 'Pedestrian Flow Spillover',
    aiAnalysis: 'Metro station morning disembarkation causing 60s vehicle tailbacks.',
    recommendation: 'Adjust pedestrian crossing sequence to 25s window every 90s.',
    operatorStatus: 'RESOLVED',
    operatorName: 'Analyst K. Verma',
    priority: 'MEDIUM',
    appliedAction: 'Pedestrian signal adjusted; traffic cleared back to 28 km/h.'
  },
  {
    id: 'dec-104',
    time: '08:02 AM',
    timestamp: Date.now() - 1000 * 60 * 54,
    locationId: 'loc-sadar',
    locationName: 'Sadar Residency',
    detectedIssue: 'Slow Moving Commercial Van',
    aiAnalysis: 'Single-lane obstruction detected by camera node 02.',
    recommendation: 'Dispatch local patrol unit for vehicle clearing.',
    operatorStatus: 'DISPATCHED',
    operatorName: 'Analyst K. Verma',
    priority: 'LOW',
    appliedAction: 'Patrol Car #12 cleared vehicle to side bay.'
  }
];

export const ROUTE_COMPARISONS: RouteComparisonPair[] = [
  {
    id: 'corridor-south-central',
    corridorTitle: 'South Arterial to Central Healthcare Hub',
    currentRoute: {
      name: 'Current Route (Wardha Road → Medical Square)',
      from: 'Wardha Road (Airport Crossing)',
      to: 'Medical Square (Healthcare Hub)',
      distanceKm: 8.4,
      durationMin: 28,
      congestion: 'HIGH',
      via: 'Direct via Wardha Main & Untkhana flyover ramp',
      coordinates: [
        [21.1054, 79.0689],
        [21.1140, 79.0760],
        [21.1210, 79.0880],
        [21.1278, 79.0989]
      ]
    },
    altRoute: {
      name: 'Alternative Route (Manish Nagar → Ajni Square)',
      from: 'Manish Nagar Junction',
      to: 'Ajni Square (via Railway Overpass Link)',
      distanceKm: 9.1,
      durationMin: 20,
      congestion: 'MODERATE',
      via: 'Besa-Manish Link & Ajni Overpass Corridor',
      coordinates: [
        [21.0921, 79.0765],
        [21.1040, 79.0820],
        [21.1165, 79.0792],
        [21.1278, 79.0989]
      ]
    },
    estimatedTimeSavedMin: 8,
    aiRecommendation:
      'Alternative route may reduce estimated travel time based on current simulated traffic conditions. Lower density along the Manish Nagar underpass bypasses the heavy bottleneck around Medical Square south gate.'
  },
  {
    id: 'corridor-north-central',
    corridorTitle: 'North National Entry to Sitabuldi Core',
    currentRoute: {
      name: 'Direct Highway Corridor (Kamptee Road → Variety Square)',
      from: 'Kamptee Road Entry',
      to: 'Variety Square Sitabuldi',
      distanceKm: 9.6,
      durationMin: 26,
      congestion: 'HIGH',
      via: 'Automotive Square & Lic Square Core',
      coordinates: [
        [21.1895, 79.1120],
        [21.1720, 79.0980],
        [21.1550, 79.0890],
        [21.1442, 79.0848]
      ]
    },
    altRoute: {
      name: 'Outer Ring Bypass (Kamptee → Sadar Bypass → Variety)',
      from: 'Kamptee Road Entry',
      to: 'Variety Square via Civil Lines',
      distanceKm: 11.2,
      durationMin: 19,
      congestion: 'LOW',
      via: 'Koradi Link & Palm Road Civil Lines',
      coordinates: [
        [21.1895, 79.1120],
        [21.1780, 79.0720],
        [21.1580, 79.0680],
        [21.1442, 79.0848]
      ]
    },
    estimatedTimeSavedMin: 7,
    aiRecommendation:
      'Civil Lines ring corridor displays 38% less vehicle clustering. Despite 1.6 km longer route, uninterrupted signal progression saves 7 minutes.'
  }
];

export const HISTORICAL_HOURLY_DATA: Record<'today' | '7days' | '30days', HistoricalHourlyData[]> = {
  today: [
    { hour: '00:00', volume: 820, speed: 48, congestionPercent: 12, baselineVolume: 780 },
    { hour: '02:00', volume: 440, speed: 52, congestionPercent: 8, baselineVolume: 420 },
    { hour: '04:00', volume: 610, speed: 50, congestionPercent: 10, baselineVolume: 580 },
    { hour: '06:00', volume: 1420, speed: 42, congestionPercent: 24, baselineVolume: 1350 },
    { hour: '07:00', volume: 2950, speed: 34, congestionPercent: 48, baselineVolume: 2700 },
    { hour: '08:00', volume: 4890, speed: 22, congestionPercent: 82, baselineVolume: 3900 },
    { hour: '09:00', volume: 5640, speed: 18, congestionPercent: 88, baselineVolume: 4300 },
    { hour: '10:00', volume: 4920, speed: 23, congestionPercent: 74, baselineVolume: 4100 },
    { hour: '11:00', volume: 3810, speed: 30, congestionPercent: 55, baselineVolume: 3600 },
    { hour: '12:00', volume: 3420, speed: 32, congestionPercent: 49, baselineVolume: 3300 },
    { hour: '13:00', volume: 3280, speed: 33, congestionPercent: 46, baselineVolume: 3200 },
    { hour: '14:00', volume: 3510, speed: 31, congestionPercent: 50, baselineVolume: 3400 },
    { hour: '15:00', volume: 3980, speed: 29, congestionPercent: 57, baselineVolume: 3750 },
    { hour: '16:00', volume: 4620, speed: 25, congestionPercent: 68, baselineVolume: 4100 },
    { hour: '17:00', volume: 5510, speed: 20, congestionPercent: 84, baselineVolume: 4700 },
    { hour: '18:00', volume: 6120, speed: 17, congestionPercent: 91, baselineVolume: 5100 },
    { hour: '19:00', volume: 5890, speed: 19, congestionPercent: 86, baselineVolume: 4950 },
    { hour: '20:00', volume: 4730, speed: 24, congestionPercent: 69, baselineVolume: 4200 },
    { hour: '21:00', volume: 3610, speed: 32, congestionPercent: 45, baselineVolume: 3400 },
    { hour: '22:00', volume: 2410, speed: 39, congestionPercent: 28, baselineVolume: 2300 },
    { hour: '23:00', volume: 1540, speed: 44, congestionPercent: 18, baselineVolume: 1500 }
  ],
  '7days': [
    { hour: 'Mon', volume: 4820, speed: 24, congestionPercent: 78, baselineVolume: 4600 },
    { hour: 'Tue', volume: 4950, speed: 23, congestionPercent: 80, baselineVolume: 4700 },
    { hour: 'Wed', volume: 5210, speed: 21, congestionPercent: 85, baselineVolume: 4800 },
    { hour: 'Thu', volume: 5080, speed: 22, congestionPercent: 81, baselineVolume: 4750 },
    { hour: 'Fri', volume: 5640, speed: 19, congestionPercent: 89, baselineVolume: 5050 },
    { hour: 'Sat', volume: 4320, speed: 28, congestionPercent: 62, baselineVolume: 4200 },
    { hour: 'Sun', volume: 3410, speed: 35, congestionPercent: 42, baselineVolume: 3500 }
  ],
  '30days': [
    { hour: 'Week 1', volume: 4890, speed: 24, congestionPercent: 76, baselineVolume: 4700 },
    { hour: 'Week 2', volume: 5120, speed: 22, congestionPercent: 81, baselineVolume: 4850 },
    { hour: 'Week 3', volume: 5410, speed: 20, congestionPercent: 85, baselineVolume: 4900 },
    { hour: 'Week 4', volume: 5290, speed: 21, congestionPercent: 83, baselineVolume: 4800 }
  ]
};

export const HOTSPOT_RANKINGS: HotspotRanking[] = [
  {
    rank: 1,
    locationName: 'Medical Square',
    congestionScore: 92,
    peakHour: '08:30 - 10:30 & 17:30 - 20:00',
    avgDelayMin: 14.2,
    frequency: 'Recurring daily (Hospital transit & south hub)'
  },
  {
    rank: 2,
    locationName: 'Wardha Road',
    congestionScore: 88,
    peakHour: '08:45 - 10:15 & 18:00 - 20:30',
    avgDelayMin: 12.5,
    frequency: 'Recurring daily (Expressway convergence)'
  },
  {
    rank: 3,
    locationName: 'Sadar',
    congestionScore: 74,
    peakHour: '12:30 - 14:00 & 18:30 - 21:00',
    avgDelayMin: 8.8,
    frequency: 'Recurring 5 days/wk (Commercial & dining peak)'
  },
  {
    rank: 4,
    locationName: 'Variety Square',
    congestionScore: 71,
    peakHour: '17:00 - 20:30',
    avgDelayMin: 7.6,
    frequency: 'Recurring 6 days/wk (Metro & market access)'
  }
];

export const INITIAL_ANPR_EVENTS: AnprEvent[] = [
  {
    id: 'anpr-01',
    timestamp: '08:58:12',
    locationName: 'Medical Square Camera #2',
    plateNumber: 'MH-31-EQ-4819',
    vehicleType: 'Car',
    speedKmH: 14,
    status: 'CONGESTED_ZONE'
  },
  {
    id: 'anpr-02',
    timestamp: '08:58:05',
    locationName: 'Wardha Road Camera #4',
    plateNumber: 'MH-31-BZ-8092',
    vehicleType: 'EV Cab',
    speedKmH: 19,
    status: 'CONGESTED_ZONE'
  },
  {
    id: 'anpr-03',
    timestamp: '08:57:48',
    locationName: 'Kamptee Road Camera #1',
    plateNumber: 'MH-40-TC-3312',
    vehicleType: 'Truck',
    speedKmH: 52,
    status: 'NORMAL'
  },
  {
    id: 'anpr-04',
    timestamp: '08:57:30',
    locationName: 'Ajni Square Camera #3',
    plateNumber: 'MH-31-DS-1004',
    vehicleType: 'Motorbike',
    speedKmH: 31,
    status: 'NORMAL'
  },
  {
    id: 'anpr-05',
    timestamp: '08:57:12',
    locationName: 'Hingna T-Point Camera #2',
    plateNumber: 'MH-31-AR-9941',
    vehicleType: 'Bus',
    speedKmH: 44,
    status: 'NORMAL'
  }
];

export const DEFAULT_AI_ANALYSIS: AiRecommendationResult = {
  targetLocation: 'Medical Square',
  detectedIssue: 'High congestion detected at Medical Square.',
  analysis: 'Vehicle volume is 32% above the historical baseline.',
  severity: 'HIGH',
  recommendedActions: [
    'Review signal timing (extend green split on Wardha approach by +15s)',
    'Monitor traffic buildup at secondary spillover nodes (Untkhana)',
    'Consider alternative route recommendation via Manish Nagar underpass',
    'Continue monitoring for 15 minutes before executing downstream phase changes'
  ],
  confidenceScore: 94.6,
  timestamp: '08:42 AM',
  baselineComparison: '+32% above typical morning baseline (1,840 veh/hr baseline vs 2,430 veh/hr current)',
  projectedClearanceMin: 18,
  evidence: {
    inflowRatePerMin: 54,
    outflowRatePerMin: 39,
    bottleneckRadiusMeters: 380,
    historicalDeviationPercent: 32.1
  }
};
