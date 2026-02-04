
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, CheckCircle2, Stethoscope, 
  Utensils, Dumbbell, ArrowLeft, Loader2, Sparkles,
  Info, MapPin, User, Activity, Ruler
} from 'lucide-react';
/* Fix: Changed ClientRecord to ClientProfile to match types.ts */
import { ClientProfile } from '../types';
import { generatePlan } from '../services/geminiService';
import { MuskyLogo } from '../components/MuskyLogo';

const RECORDS_KEY = 'musky_records_v4';

const ClientManagement: React.FC<{ view: 'onboarding' | 'coach' }> = ({ view }) => {
  /* Fix: Changed ClientRecord to ClientProfile to resolve import error */
  const [records, setRecords] = useState<ClientProfile[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState<string | null>(null);
  /* Fix: Changed ClientRecord to ClientProfile to resolve import error */
  const [selected, setSelected] = useState<ClientProfile | null>(null);

  const [form, setForm] = useState({
    name: '', email: '', age: '', gender: 'Male', 
    heightCm: '', weightKg: '', activity: 'Moderate',
    religion: 'None', restrictions: '', goal: 'Fat Loss', frequency: 3, location: 'Gym'
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
    setRecords(saved);
  }, []);

  /* Fix: Changed ClientRecord to ClientProfile parameter type */
  const save = (updated: ClientProfile[]) => {
    setRecords(updated);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(updated));
  };

  const submitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    /* Fix: Changed ClientRecord variable type to ClientProfile */
    const newClient: ClientProfile = {
      id: Date.now().toString(),
      name: form.name, 
      email: form.email, 
      status: 'Reviewing',
      parq_completed: true,
      intake_completed: true,
      // Fixed: healthSafety properties updated to match interface in types.ts
      healthSafety: {
        hasHeartCondition: false,
        hasHighBP: false,
        hasDiabetes: false,
        hasCurrentInjuries: false,
        hasPastInjuries: false,
        hasHadSurgery: false,
        usesMedication: false,
        isPregnantOrPostnatal: false,
        hasJointPain: false,
        doctorAdvisedNoExercise: false,
        clearanceRequired: false,
        medicalDetails: '',
        injuryDetails: ''
      },
      // Added missing baselineSteps property to satisfy the Lifestyle interface
      lifestyle: {
        age: parseInt(form.age) || 0,
        gender: form.gender as any,
        heightCm: parseInt(form.heightCm) || 0,
        weightKg: parseInt(form.weightKg) || 0,
        primaryGoal: form.goal as any,
        daysPerWeek: form.frequency,
        occupationActivity: form.activity as any,
        sleepQuality: 'Average',
        stressLevel: 3,
        breakfastTime: '08:00',
        lunchTime: '13:00',
        dinnerTime: '19:00',
        mealsPerDay: '3',
        eatingHabits: 'Mixed',
        // Fixed: changed from 'Omnivore' to 'None' to match enum
        dietaryPreference: 'None',
        religiousRestrictions: form.religion,
        foodDislikes: form.restrictions,
        allergies: '',
        refusedFoods: '',
        baselineSteps: 5000
      },
      foodLogs: [], 
      workouts: [],
      joinedAt: new Date().toLocaleDateString('en-GB')
    };
    save([newClient, ...records]);
    setStep(4);
  };

  const approve = (id: string) => {
    const pw = 'musky' + Math.floor(1000 + Math.random() * 9000);
    const updated = records.map(r => r.id === id ? { ...r, status: 'Active', password: pw } : r);
    /* Fix: Updated type casting to ClientProfile[] */
    save(updated as ClientProfile[]);
    if (selected?.id === id) setSelected(updated.find(u => u.id === id) as ClientProfile);
    alert(`Client Approved. Password: ${pw}`);
  };

  const createPlan = async (id: string) => {
    setLoading(id);
    const c = records.find(r => r.id === id);
    if (c) {
      const plan = await generatePlan(c);
      if (plan) {
        const updated = records.map(r => r.id === id ? { ...r, plan } : r);
        /* Fix: Updated type casting to ClientProfile[] */
        save(updated as ClientProfile[]);
        if (selected?.id === id) setSelected(updated.find(u => u.id === id) as ClientProfile);
      }
    }
    setLoading(null);
  };

  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-[40px] shadow-2xl space-y-10">
          {step < 4 && (
            <div className="text-center space-y-4">
               <MuskyLogo size={64} className="mx-auto" />
               <h1 className="text-3xl font-black italic uppercase tracking-tighter">Client Intake</h1>
               <div className="flex justify-center gap-2">
                 {[1, 2, 3].map(s => <div key={s} className={`h-1.5 w-12 rounded-full ${s <= step ? 'bg-white' : 'bg-zinc-800'}`} />)}
               </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest px-2">1. Biometrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <input className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" placeholder="Age" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
                <select className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
                <input className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" placeholder="Height (cm)" type="number" value={form.heightCm} onChange={e => setForm({...form, heightCm: e.target.value})} />
                <input className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" placeholder="Weight (kg)" type="number" value={form.weightKg} onChange={e => setForm({...form, weightKg: e.target.value})} />
              </div>
              <button onClick={() => setStep(2)} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl">Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest px-2">2. Nutrition & Culture</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Religion / Dietary Base</label>
                   <select className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" value={form.religion} onChange={e => setForm({...form, religion: e.target.value})}>
                     <option>None</option><option>Hindu</option><option>Muslim</option><option>Sikh</option><option>Christian</option><option>Jewish</option><option>Other</option>
                   </select>
                </div>
                <textarea className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white h-32" placeholder="Dietary laws or preferences (e.g. Pure Veg, Halal, No Beef, Jain, Fasting days)" value={form.restrictions} onChange={e => setForm({...form, restrictions: e.target.value})} />
                <select className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" value={form.activity} onChange={e => setForm({...form, activity: e.target.value})}>
                  <option>Sedentary</option><option>Moderate</option><option>Active</option><option>Heavy Labour</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-5 border border-zinc-700 text-zinc-400 font-black uppercase tracking-widest rounded-2xl">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl">Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest px-2">3. Training Focus</h2>
              <div className="space-y-4">
                <input className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" placeholder="Primary Goal (e.g. Fat Loss / Hypertrophy)" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Days / Week</label>
                     <input type="number" className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" value={form.frequency} onChange={e => setForm({...form, frequency: parseInt(e.target.value)})} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Location</label>
                     <select className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-5 text-white" value={form.location} onChange={e => setForm({...form, location: e.target.value})}>
                        <option>Gym</option><option>Home</option>
                     </select>
                   </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-5 border border-zinc-700 text-zinc-400 font-black uppercase tracking-widest rounded-2xl">Back</button>
                <button onClick={submitEnquiry} className="flex-1 py-5 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl">Enquire Now</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-20 space-y-8 animate-in zoom-in">
               <CheckCircle2 size={80} className="text-emerald-500 mx-auto" />
               <div className="space-y-2">
                 <h1 className="text-4xl font-black italic uppercase tracking-tighter">Application Sent</h1>
                 <p className="text-zinc-500 max-w-xs mx-auto text-sm">Coach Musky will review your biometrics and religious dietary needs to build your bespoke programme.</p>
               </div>
               <Link to="/" className="inline-block px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-white/5">Return Home</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // COACH VIEW
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in">
      {!selected ? (
        <div className="space-y-10">
           <header>
             <h1 className="text-5xl font-black italic uppercase tracking-tighter">Client Roster</h1>
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Manage Active Protocols</p>
           </header>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" /> New Applications
                 </h3>
                 <div className="space-y-3">
                   {records.filter(r => r.status === 'Reviewing').map(r => (
                     <button key={r.id} onClick={() => setSelected(r)} className="w-full text-left p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] flex justify-between items-center group hover:border-orange-500/50 transition-all">
                       <div>
                         <p className="text-xl font-black text-white italic uppercase tracking-tight">{r.name}</p>
                         <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{r.lifestyle.religiousRestrictions} • {r.lifestyle.primaryGoal}</p>
                       </div>
                       <ChevronRight className="text-zinc-800 group-hover:text-orange-500" size={24} />
                     </button>
                   ))}
                   {records.filter(r => r.status === 'Reviewing').length === 0 && <p className="p-12 text-center text-zinc-700 italic border border-dashed border-zinc-800 rounded-3xl">No pending reviews.</p>}
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Active Roster
                 </h3>
                 <div className="space-y-3">
                   {records.filter(r => r.status === 'Active').map(r => (
                     <button key={r.id} onClick={() => setSelected(r)} className="w-full text-left p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] flex justify-between items-center group hover:border-emerald-500/50 transition-all">
                       <div>
                         <p className="text-xl font-black text-white italic uppercase tracking-tight">{r.name}</p>
                         <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{r.lifestyle.daysPerWeek} Days/Week</p>
                       </div>
                       <ChevronRight className="text-zinc-800 group-hover:text-emerald-500" size={24} />
                     </button>
                   ))}
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-10">
           <button onClick={() => setSelected(null)} className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 font-black uppercase text-[10px] tracking-widest transition-all px-4 group">
             <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to List
           </button>

           <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] overflow-hidden">
              <div className="p-12 border-b border-zinc-800 bg-zinc-950/40 flex flex-col md:flex-row justify-between items-start gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <h2 className="text-5xl font-black italic uppercase tracking-tighter">{selected.name}</h2>
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${selected.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                         {selected.status}
                       </span>
                    </div>
                    <div className="flex flex-wrap gap-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                       <span className="flex items-center gap-2"><User size={14}/> {selected.lifestyle.gender} • {selected.lifestyle.age}y</span>
                       <span className="flex items-center gap-2"><MapPin size={14}/> Joined {selected.joinedAt}</span>
                       <span className="text-zinc-300 font-black">{selected.email}</span>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    {selected.status === 'Reviewing' && (
                      <button onClick={() => approve(selected.id)} className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 shadow-xl shadow-white/5">Accept Client</button>
                    )}
                    <button onClick={() => createPlan(selected.id)} disabled={loading === selected.id} className="px-10 py-5 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-emerald-500 shadow-xl shadow-emerald-500/10">
                       {loading === selected.id ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                       Generate Protocol
                    </button>
                 </div>
              </div>

              <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-16">
                 <div className="space-y-8">
                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2"><Stethoscope size={16} className="text-red-500"/> Clinical Profile</h4>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 text-center">
                          <Ruler size={24} className="mx-auto text-zinc-800 mb-2" />
                          <p className="text-xl font-black">{selected.lifestyle.heightCm}cm</p>
                          <p className="text-[8px] font-black text-zinc-700 uppercase">Height</p>
                       </div>
                       <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 text-center">
                          <Activity size={24} className="mx-auto text-zinc-800 mb-2" />
                          <p className="text-xl font-black">{selected.lifestyle.weightKg}kg</p>
                          <p className="text-[8px] font-black text-zinc-700 uppercase">Weight</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2"><Utensils size={16} className="text-emerald-500"/> Culture & Nutrition</h4>
                    <div className="bg-zinc-950 p-8 rounded-[32px] border border-zinc-800 space-y-4">
                       <div>
                          <p className="text-[10px] font-black text-zinc-700 uppercase mb-1">Religious Context</p>
                          <p className="text-lg font-bold text-white">{selected.lifestyle.religiousRestrictions}</p>
                       </div>
                       <div className="pt-4 border-t border-zinc-900">
                          <p className="text-[10px] font-black text-zinc-700 uppercase mb-1">Strict Restrictions</p>
                          <p className="text-sm text-zinc-300 font-bold italic leading-relaxed">"{selected.lifestyle.foodDislikes || 'None Specified'}"</p>
                       </div>
                    </div>
                 </div>

                 {selected.plan && (
                   <div className="md:col-span-2 space-y-8 pt-8 border-t border-zinc-800">
                      <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2"><Dumbbell size={16} className="text-white"/> Active Protocol</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                          { l: 'Daily Calories', v: selected.plan.nutritionTargets.calories },
                          { l: 'Protein Goal', v: selected.plan.nutritionTargets.protein + 'g' },
                          { l: 'Split System', v: selected.plan.splitType },
                          { l: 'Step Target', v: selected.plan.stepTarget.toLocaleString() }
                        ].map(it => (
                          <div key={it.l} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
                            <p className="text-[8px] font-black text-zinc-700 uppercase mb-1">{it.l}</p>
                            <p className="text-xl font-black text-white italic">{it.v}</p>
                          </div>
                        ))}
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
