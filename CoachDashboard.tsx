
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Logo from './Logo';
import { sheetsService } from '../services/sheetsService';
import { ComplianceStats, Client } from '../types';
import { MOCK_CLIENTS } from '../constants';

const CoachDashboard: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client>(MOCK_CLIENTS[0]);
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const data = await sheetsService.getCompliance(selectedClient.id);
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, [selectedClient]);

  const getComplianceColor = (percent: number) => {
    if (percent >= 80) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (percent >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
      <div className="w-12 h-12 border-4 border-musky-orange/20 border-t-musky-orange rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-black uppercase tracking-widest">Accessing Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-24">
      <header className="px-2 flex items-center gap-4">
        <Logo className="w-12 h-12" glow />
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Coach Command</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">System Intelligence v1.0</p>
        </div>
      </header>

      <div className="px-2">
        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Selected Client</label>
        <select 
          className="w-full bg-musky-gray border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-musky-orange shadow-lg appearance-none"
          value={selectedClient.id}
          onChange={(e) => {
            const client = MOCK_CLIENTS.find(c => c.id === e.target.value);
            if (client) setSelectedClient(client);
          }}
        >
          {MOCK_CLIENTS.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {stats && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center py-8">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Compliance</span>
              <div className={`px-6 py-2 rounded-2xl border text-3xl font-black ${getComplianceColor(stats.compliancePercent)}`}>
                {Math.round(stats.compliancePercent)}%
              </div>
            </Card>

            <Card className="flex flex-col items-center justify-center py-8">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Avg Steps</span>
              <span className="text-3xl font-black text-white">{stats.avgSteps.toLocaleString()}</span>
            </Card>
          </div>

          <Card title="7-Day Performance Metrics">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Avg Calories</span>
                <span className="font-black text-white text-lg">{stats.avgCalories} <span className="text-[10px] text-gray-600">KCAL</span></span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Workouts</span>
                <span className="font-black text-musky-orange text-lg">{stats.history.filter(h => h.workoutCompleted).length} / 7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Check-ins</span>
                <span className="font-black text-white text-lg">{stats.history.length}</span>
              </div>
            </div>
          </Card>

          <div className="px-2">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Adherence Timeline</h3>
            <div className="space-y-3">
              {stats.history.map((log, i) => (
                <div key={i} className="bg-musky-gray p-5 rounded-2xl border border-white/5 flex items-center justify-between shadow-md">
                  <div>
                    <p className="font-black text-white uppercase text-sm tracking-tight">{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">{log.steps.toLocaleString()} STEPS • {log.workoutType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-musky-orange text-lg">{Math.round(log.totals.calories)}</p>
                    <p className="text-[9px] text-gray-600 font-black tracking-tighter uppercase">{Math.round(log.totals.protein)}P / {Math.round(log.totals.carbs)}C / {Math.round(log.totals.fats)}F</p>
                  </div>
                </div>
              ))}
              {stats.history.length === 0 && (
                <div className="py-20 text-center text-gray-700 italic border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-xs font-black uppercase tracking-widest">No Intelligence Gathered Yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
