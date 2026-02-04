
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Users, ArrowRight, ShieldCheck, Sparkles, Activity, Target, CheckCircle2, Utensils } from 'lucide-react';
import { storage } from '../services/storageService';
import { ClientProfile } from '../types';
import { generatePlan } from '../services/geminiService';

const CoachPortal: React.FC = () => {
  const [records, setRecords] = useState<ClientProfile[]>([]);
  const [selected, setSelected] = useState<ClientProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { setRecords(storage.getRecords()); }, []);

  const handleApprove = async (id: string) => {
    setIsGenerating(true);
    const client = records.find(r => r.id === id);
    if (client) {
      const plan = await generatePlan(client);
      if (plan) {
        const updated = records.map(r => r.id === id ? { ...r, status: 'Active' as const, plan } : r);
        storage.saveAllRecords(updated);
        setRecords(updated);
        setSelected(updated.find(u => u.id === id) || null);
        alert("Client Activated. Programme Online.");
      }
    }
    setIsGenerating(false);
  };

  const labelCls = "text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 block";

  if (selected) {
    return (
      <div className="animate-fade p-10 max-w-7xl mx-auto space-y-12 pb-40">
         <button onClick={() => setSelected(null)} className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 font-black uppercase text-xs tracking-widest group"><ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Member Database</button>
         
         <div className="bg-white border border-zinc-200 rounded-[56px] overflow-hidden shadow-2xl">
            <div className="p-12 md:p-16 border-b border-zinc-100 bg-zinc-50/50 flex flex-col lg:flex-row justify-between items-start gap-10">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-6xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">{selected.name}</h2>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selected.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>{selected.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-8 text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">
                    <span>{selected.lifestyle.gender} • {selected.lifestyle.age}y • {selected.lifestyle.weightKg}kg</span>
                    <span className="text-zinc-300">{selected.email}</span>
                  </div>
               </div>
               {selected.status !== 'Active' && (
                 <button onClick={() => handleApprove(selected.id)} disabled={isGenerating} className="px-12 py-7 bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.4em] rounded-[32px] flex items-center justify-center gap-4 shadow-2xl hover:bg-emerald-500 transition-all scale-110 active:scale-95">
                    {isGenerating ? <Loader2 className="animate-spin" size={24}/> : <ShieldCheck size={24}/>}
                    Activate & Build Protocol
                 </button>
               )}
            </div>

            <div className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16">
               <div className="space-y-10">
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] italic text-zinc-900 border-b border-zinc-100 pb-4 flex items-center gap-3"><Activity size={20} className="text-orange-500"/> Clinical Analysis</h4>
                  <div className="space-y-4">
                    {[
                      { l: 'Heart Condition', v: selected.healthSafety.hasHeartCondition },
                      { l: 'High Blood Pressure', v: selected.healthSafety.hasHighBP },
                      { l: 'Current Injuries', v: selected.healthSafety.hasCurrentInjuries },
                      { l: 'Past Surgeries', v: selected.healthSafety.hasHadSurgery },
                      { l: 'Medications', v: selected.healthSafety.usesMedication },
                      { l: 'Pregnancy Status', v: selected.healthSafety.isPregnantOrPostnatal }
                    ].map(it => (
                      <div key={it.l} className="flex justify-between p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <span className="text-[10px] font-black uppercase text-zinc-400">{it.l}</span>
                        <span className={`text-[10px] font-black uppercase ${it.v ? 'text-red-500' : 'text-emerald-500'}`}>{it.v ? 'Alert' : 'None'}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="space-y-10">
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] italic text-zinc-900 border-b border-zinc-100 pb-4 flex items-center gap-3"><Utensils size={20} className="text-emerald-500"/> Nutrition Intake</h4>
                  <div className="bg-zinc-50 p-10 rounded-[40px] border border-zinc-100 space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <div><p className={labelCls}>Daily Meals</p><p className="text-lg font-black italic">{selected.lifestyle.mealsPerDay}</p></div>
                        <div><p className={labelCls}>Preference</p><p className="text-lg font-black italic">{selected.lifestyle.dietaryPreference}</p></div>
                     </div>
                     <div><p className={labelCls}>Religious Restrictions</p><p className="text-sm font-bold italic">"{selected.lifestyle.religiousRestrictions || 'None'}"</p></div>
                     <div className="pt-6 border-t border-zinc-200"><p className={labelCls}>Refused Foods</p><p className="text-xs font-medium text-zinc-500 leading-relaxed italic">"{selected.lifestyle.refusedFoods || 'No exclusions'}"</p></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade p-10">
      <header className="space-y-2">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">Coach Hub</h1>
        <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.6em]">System Inventory: {records.length} Members</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {records.map(r => (
           <button key={r.id} onClick={() => setSelected(r)} className="bg-white border border-zinc-200 p-10 rounded-[48px] text-left hover:border-zinc-900 transition-all shadow-sm group relative overflow-hidden">
              <div className="mb-10 flex justify-between items-start">
                 <div className="w-16 h-16 rounded-3xl bg-zinc-900 flex items-center justify-center text-white font-black italic text-2xl group-hover:bg-emerald-600 transition-all">{r.name.charAt(0)}</div>
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>{r.status}</span>
              </div>
              <p className="text-3xl font-black uppercase italic text-zinc-900 leading-none mb-2">{r.name}</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{r.lifestyle.primaryGoal} • {r.lifestyle.daysPerWeek} Days/Week</p>
           </button>
        ))}
      </div>
    </div>
  );
};

export default CoachPortal;
