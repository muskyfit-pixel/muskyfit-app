
import React, { useState, useEffect } from 'react';
import { Play, Loader2, Clock, Save, ChevronLeft, ArrowRightLeft, Activity, Info } from 'lucide-react';
import { storage } from '../services/storageService';
import { Workout, Exercise, ClientProfile, WorkoutSession, SetLog } from '../types';

const Workouts: React.FC = () => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [sessionLogs, setSessionLogs] = useState<Record<string, SetLog[]>>({});
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    const user = storage.getAuth();
    if (user) {
      const current = storage.getProfileById(user.id);
      if (current) setProfile(current);
    }
    setLoading(false);
  }, []);

  const getLastWeight = (exerciseId: string) => {
    if (!profile?.workouts) return 0;
    for (const w of profile.workouts) {
      const match = w.exercises.find(ex => ex.exerciseId === exerciseId);
      if (match?.logs?.length) return match.logs[0].weight;
    }
    return 0;
  };

  const handleStartSession = (session: WorkoutSession) => {
    setActiveSession(session);
    const initialLogs: Record<string, SetLog[]> = {};
    session.exercises.forEach(ex => {
      const lastW = getLastWeight(ex.exerciseId);
      const targetReps = parseInt(ex.reps.split('-')[0]) || 8;
      initialLogs[ex.exerciseId] = Array(ex.sets).fill(null).map(() => ({ weight: lastW, reps: targetReps }));
    });
    setSessionLogs(initialLogs);
    setShowLogModal(true);
  };

  const handleSetChange = (exerciseId: string, idx: number, field: keyof SetLog, val: string) => {
    const num = val === "" ? 0 : parseFloat(val);
    setSessionLogs(prev => {
      const newLogs = [...prev[exerciseId]];
      newLogs[idx] = { ...newLogs[idx], [field]: num };
      return { ...prev, [exerciseId]: newLogs };
    });
  };

  const handleSave = () => {
    if (!profile || !activeSession) return;
    const workout: Workout = {
      id: Date.now().toString(),
      name: activeSession.title,
      type: 'Strength',
      duration: 60,
      date: new Date().toISOString(),
      exercises: activeSession.exercises.map(ex => ({
        ...ex,
        logs: sessionLogs[ex.exerciseId]
      }))
    };
    const updated = { ...profile, workouts: [workout, ...(profile.workouts || [])] };
    storage.saveRecord(updated);
    setProfile(updated);
    setShowLogModal(false);
    setActiveSession(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-zinc-900" size={32} /></div>;

  return (
    <div className="flex-1 flex flex-col animate-fade overflow-y-auto bg-white min-h-screen">
      <header className="px-6 py-12 lg:px-12 lg:pt-16 lg:pb-8 shrink-0">
        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none mb-4">Programme</h2>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.4em] italic">UK Standard: Upper / Lower System</p>
          <div className="h-1 w-1 rounded-full bg-zinc-200" />
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.4em] italic">60-Minute Protocol</p>
        </div>
      </header>

      <div className="flex-1 px-6 lg:px-12 pb-24 space-y-12">
        {profile?.plan ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {profile.plan.sessions.map((session, idx) => (
              <div key={idx} className="bg-zinc-50 border border-zinc-200 rounded-[56px] p-8 lg:p-12 flex flex-col transition-all hover:border-zinc-900 group min-h-[500px]">
                <div className="mb-10">
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none mb-2">{session.title}</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Protocol {idx + 1}</p>
                </div>

                <div className="flex-1 space-y-12">
                  {/* Strict Warm-up Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">1. Warm-up (Mandatory 10 Min)</p>
                    <div className="bg-white border border-zinc-100 rounded-[32px] p-6 flex items-center gap-6 shadow-sm">
                      <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-emerald-400"><Clock size={28}/></div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 italic leading-tight">{session.warmupCardio}</p>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">Light to Moderate Intensity</p>
                      </div>
                    </div>
                  </div>

                  {/* Resistance Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">2. Resistance (50 Min)</p>
                    <div className="space-y-3">
                      {session.exercises.map((ex, i) => (
                        <div key={i} className="bg-white border border-zinc-100 rounded-[24px] p-5 flex justify-between items-center shadow-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-zinc-300 italic">{i + 1}</span>
                            <div>
                              <h4 className="font-bold text-zinc-900 text-sm leading-tight">{ex.name}</h4>
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5 italic">{i < 2 ? 'Main exercise' : 'Support exercise'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-zinc-900 text-sm uppercase italic">{ex.sets} × {ex.reps}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleStartSession(session)} 
                  className="mt-12 w-full py-7 bg-zinc-900 text-white font-black uppercase text-xs tracking-[0.4em] rounded-[32px] flex items-center justify-center gap-4 shadow-2xl hover:bg-emerald-600 transition-all italic active:scale-95"
                >
                  <Play size={18} fill="currentColor" /> Initialize Protocol
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-40 border-2 border-dashed border-zinc-200 rounded-[56px] text-center">
            <p className="text-2xl font-black text-zinc-300 uppercase italic">Awaiting coach protocol activation</p>
          </div>
        )}
      </div>

      {showLogModal && activeSession && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col animate-fade">
          <header className="px-6 py-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
             <button onClick={() => setShowLogModal(false)} className="px-5 py-3 bg-white rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all font-black uppercase text-[9px] tracking-widest flex items-center gap-2">
               <ChevronLeft size={16}/> Cancel
             </button>
             <div className="text-center">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">{activeSession.title}</h3>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-1.5 italic">Active Performance Logger</p>
             </div>
             <div className="w-[100px]" />
          </header>

          <div className="flex-1 overflow-y-auto bg-zinc-50">
             <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-10 pb-48">
                {activeSession.exercises.map((ex, idx) => (
                  <div key={idx} className="bg-white rounded-[40px] border border-zinc-200 overflow-hidden shadow-sm">
                     <div className="p-8 lg:p-10 border-b border-zinc-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic">{idx < 2 ? 'Main exercise' : 'Support exercise'}</p>
                            <h4 className="font-black text-zinc-900 text-3xl uppercase italic leading-tight tracking-tight">{ex.name}</h4>
                          </div>
                          <div className="px-6 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-black italic uppercase tracking-widest">{ex.sets} Sets × {ex.reps} Reps</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                           <div className="space-y-3">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> Coach's Cues</p>
                              <p className="text-sm font-medium text-zinc-600 leading-relaxed italic border-l-2 border-zinc-200 pl-4">{ex.notes}</p>
                           </div>
                           <div className="space-y-3">
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><ArrowRightLeft size={14}/> Optional Substitute</p>
                              <button onClick={() => alert("UK Library: Substitute rules applied.")} className="w-full text-left px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-bold text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 transition-all uppercase tracking-widest italic">
                                Use alternate movement
                              </button>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 lg:p-10 space-y-4 bg-zinc-50/30">
                        {sessionLogs[ex.exerciseId]?.map((set, sIdx) => (
                           <div key={sIdx} className="grid grid-cols-12 gap-4 items-center bg-white rounded-[24px] p-5 border border-zinc-100 shadow-sm">
                              <div className="col-span-2 text-center font-black italic text-zinc-200 text-2xl">{sIdx + 1}</div>
                              <div className="col-span-5 space-y-2">
                                 <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest text-center italic">Weight (KG)</p>
                                 <input 
                                   type="number" 
                                   step="0.5" 
                                   value={set.weight || ''} 
                                   onChange={e => handleSetChange(ex.exerciseId, sIdx, 'weight', e.target.value)} 
                                   className="w-full bg-zinc-50 rounded-xl p-4 font-black text-2xl outline-none text-center focus:ring-1 focus:ring-zinc-900 transition-all" 
                                   placeholder="0" 
                                 />
                              </div>
                              <div className="col-span-5 space-y-2">
                                 <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest text-center italic">Reps Completed</p>
                                 <input 
                                   type="number" 
                                   value={set.reps || ''} 
                                   onChange={e => handleSetChange(ex.exerciseId, sIdx, 'reps', e.target.value)} 
                                   className="w-full bg-zinc-50 rounded-xl p-4 font-black text-2xl outline-none text-center focus:ring-1 focus:ring-zinc-900 transition-all" 
                                   placeholder="0" 
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <footer className="px-6 py-8 bg-white border-t border-zinc-100 fixed bottom-0 left-0 right-0 z-[210] flex justify-center">
             <button onClick={handleSave} className="w-full max-w-2xl py-7 bg-zinc-900 text-white font-black uppercase text-xs tracking-[0.4em] rounded-[36px] shadow-2xl flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all scale-105 active:scale-95 italic">
               <Save size={20} /> Complete Protocol
             </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Workouts;
