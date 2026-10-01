import React, { useState } from 'react';
import {
  ClipboardList,
  Filter,
  Download,
  Search,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useTraffic } from '../context/TrafficContext';
import { OperatorDecisionStatus, DecisionLogEntry } from '../types/traffic';

export const DecisionLogView: React.FC = () => {
  const { decisionLogs, updateDecisionStatus, locations } = useTraffic();

  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OperatorDecisionStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = decisionLogs.filter(entry => {
    const matchesLoc = locationFilter === 'ALL' || entry.locationName.includes(locationFilter);
    const matchesStatus = statusFilter === 'ALL' || entry.operatorStatus === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || entry.priority === priorityFilter;
    const matchesSearch =
      entry.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.detectedIssue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.recommendation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLoc && matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusBadge = (status: OperatorDecisionStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'DISPATCHED':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'MONITORING':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'REJECTED':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'RESOLVED':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleExportCsv = () => {
    const headers = ['Time', 'Location', 'Detected Issue', 'AI Analysis', 'Recommendation', 'Operator Status', 'Operator'];
    const rows = filteredLogs.map(l => [
      `"${l.time}"`,
      `"${l.locationName}"`,
      `"${l.detectedIssue}"`,
      `"${l.aiAnalysis}"`,
      `"${l.recommendation}"`,
      `"${l.operatorStatus}"`,
      `"${l.operatorName}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `traffic_decision_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Supervisory Governance
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400">Immutable Audit Trail</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Decision Log</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational authorizations, signal timing overrides, and operator accountability log
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Location Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Location:</span>
            <select
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Locations</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Operator Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="MONITORING">Monitoring</option>
              <option value="APPROVED">Approved</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Quick Search */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search decisions..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Table (strictly adhering to prompt columns: Time, Location, Detected Issue, AI Analysis, Recommendation, Operator Status) */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Detected Issue</th>
                <th className="py-3.5 px-4">AI Analysis</th>
                <th className="py-3.5 px-4">Recommendation</th>
                <th className="py-3.5 px-4">Operator Status</th>
                <th className="py-3.5 px-4 text-center">Modify State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-sans">
                    No decision records match the active criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Time */}
                    <td className="py-3.5 px-4 text-slate-300 font-bold whitespace-nowrap">
                      {entry.time}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 font-sans font-bold text-white whitespace-nowrap">
                      {entry.locationName}
                    </td>

                    {/* Detected Issue */}
                    <td className="py-3.5 px-4 font-sans text-rose-300 font-semibold whitespace-nowrap">
                      {entry.detectedIssue}
                    </td>

                    {/* AI Analysis */}
                    <td className="py-3.5 px-4 font-sans text-slate-300 max-w-xs text-[11px] leading-relaxed">
                      {entry.aiAnalysis}
                    </td>

                    {/* Recommendation */}
                    <td className="py-3.5 px-4 font-sans text-cyan-300 max-w-xs text-[11px] leading-relaxed">
                      {entry.recommendation}
                    </td>

                    {/* Operator Status */}
                    <td className="py-3.5 px-4 font-sans whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          entry.operatorStatus
                        )}`}
                      >
                        {entry.operatorStatus}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                        {entry.operatorName}
                      </span>
                    </td>

                    {/* Operator Status Switcher inline */}
                    <td className="py-3.5 px-4 text-center font-sans">
                      <select
                        value={entry.operatorStatus}
                        onChange={e =>
                          updateDecisionStatus(entry.id, e.target.value as OperatorDecisionStatus)
                        }
                        className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-cyan-500"
                      >
                        <option value="MONITORING">Monitoring</option>
                        <option value="APPROVED">Approved</option>
                        <option value="DISPATCHED">Dispatched</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
