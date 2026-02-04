
import React, { useState, useEffect } from 'react';
import { Utensils, Dumbbell, ShieldCheck, LogOut, Loader2, Sparkles, ArrowRight, Plus, Footprints, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User, ClientProfile } from '../types';
import { storage } from '../services/storageService';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [totals, setTotals] = useState({ c: 0, p: 0, carb: 0, f: 0 });

  useEffect(() => {
    const current = storage.getProfileById(user.id);
    if (current) {
      setProfile(current);
      const todayStr = new Date().toDateString();
      const todayLogs = (current.foodLogs || []).filter(l => new Date(l.timestamp).toDateString() === todayStr);
      const newTotals = todayLogs.reduce((acc, l) => ({
        c: acc.c + l.calories, p: acc.p + l.protein, carb: acc.carb + l.carbs, f: acc.f + l.fats
      }), { c: 0, p: 0, carb: 0, f: 0 });
      setTotals(newTotals);
    }
  }, [user]);

  if (!profile) return <div className="h-screen flex flex-col items-center justify-center bg-white"><Loader2 className="animate-spin text-zinc-900" size={32} /></div>;

  // Handle case where coach hasn't approved yet
  if (!profile.plan) {
    return (
      <div className="flex-1 flex flex-col p-6 lg:p-12 animate-fade">
        <div className="max-w-xl">
          <header className="mb-12">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none mb-4">Awaiting Approval</h1>
            <p className="text-zinc-500 font-medium text-lg">Your application is with Head Coach. We are tailoring your 12-week programme now.</p>
          </header>

          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 p-8 rounded-[32px] flex items-center gap-6">
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500"><ShieldCheck size={32} /></div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Current Status</p>
                <p className="text-xl font-black text-zinc-900 uppercase italic">Reviewing Intake</p>
              </div>
            </div>
            
            <div className="bg-zinc-900 p-10 rounded-[40px] text-white">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">What happens next?</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold italic">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  Biometrics verified
                </li>
                <li className="flex items-center gap-3 text-sm font-bold italic opacity-50">
                  <div className="w-[18px] h-[18px] border-2 border-zinc-700 rounded-full" />
                  Protocol activation
                </li>
                <li className="flex items-center gap-3 text-sm font-bold italic opacity-50">
                  <div className="w-[18px] h-[18px] border-2 border-zinc-700 rounded-full" />
                  Access to Progress Lab
                </li>
              </ul>
            </div>
          </div>
          
          <button onClick={() => { storage.clearAuth(); window.location.reload(); }} className="mt-12 text-zinc-400 hover:text-zinc-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all">
            <LogOut size={16} /> Exit hub for now
          </button>
        </div>
      </div>
    );
  }

  const { nutritionTargets: targets, stepTarget, stepExplanation } = profile.plan;

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 animate-fade overflow-y-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">Daily Hub</h1>
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 italic">Today's protocol for {profile.name}</p>
        </div>
        <div className="flex gap-4">
          <Link to="/training" className="flex-1 md:flex-none px-8 py-5 bg-zinc-900 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 italic">
            <Dumbbell size={16} /> Open Training
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Actions Column */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Nutrition Alignment */}
          <section className="bg-white border border-zinc-200 rounded-[48px] p-8 lg:p-12 shadow-sm space-y-10">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-6">
              <h3 className="text-2xl font-black italic uppercase text-zinc-900 flex items-center gap-3 tracking-tighter">
                <Utensils size={24} className="text-emerald-500"/> Nutrition Summary
              </h3>
              <Link to="/nutrition" className="text-zinc-300 hover:text-zinc-900 transition-colors"><ArrowRight size={24} /></Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Calories', val: totals.c, target: targets.calories, color: 'bg-zinc-900', unit: '' },
                { label: 'Protein', val: totals.p, target: targets.protein, color: 'bg-emerald-500', unit: 'g' },
                { label: 'Carbs', val: totals.carb, target: targets.carbs, color: 'bg-zinc-300', unit: 'g' },
                { label: 'Fats', val: totals.f, target: targets.fats, color: 'bg-zinc-300', unit: 'g' }
              ].map(it => (
                <div key={it.label} className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{it.label}</p>
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-2xl font-black text-zinc-900 italic leading-none">{Math.round(it.val)}</span>
                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">/ {it.target}{it.unit}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div className={`h-full ${it.color} transition-all duration-1000`} style={{ width: `${Math.min(100, (it.val / it.target) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Today's Actions / Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-900 p-10 rounded-[48px] text-white flex flex-col justify-between min-h-[240px]">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Next Workout</p>
                <h4 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">
                  {profile.plan.sessions[0].title}
                </h4>
              </div>
              <Link to="/training" className="inline-flex items-center gap-2 text-emerald-400 font-black uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
                Initialize Protocol <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[48px] flex flex-col justify-between min-h-[240px]">
              <div>
                <p className="text-[10px] font-black text-emerald-800/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles size={14}/> Coach's Advice
                </p>
                <p className="text-lg font-bold text-emerald-950 italic leading-snug">
                  "{profile.plan.coachAdvice}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-10">
          {/* Steps Aligned Vertically */}
          <section className="bg-white border border-zinc-200 rounded-[48px] p-10 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <Footprints className="text-zinc-400" size={24} />
              <h4 className="text-xl font-black italic uppercase tracking-tighter text-zinc-900">Step Protocol</h4>
            </div>
            
            <div className="flex-1 space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Daily Target</p>
                <p className="text-6xl font-black text-zinc-900 italic tracking-tighter leading-none">
                  {stepTarget.toLocaleString()}
                </p>
              </div>
              
              <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
                <p className="text-xs font-medium text-zinc-500 leading-relaxed italic">
                  "{stepExplanation}"
                </p>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-zinc-100">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Weekly Consistency</p>
              <div className="flex items-end justify-between h-20 gap-2">
                {[45, 80, 60, 90, 30, 75, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-zinc-100 rounded-full relative group">
                    <div 
                      className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-700 ${h > 70 ? 'bg-emerald-500' : 'bg-zinc-900'}`} 
                      style={{ height: `${h}%` }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
