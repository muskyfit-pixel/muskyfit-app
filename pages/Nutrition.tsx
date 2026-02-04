
import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Utensils, Flame, Sparkles, Loader2, Clock, CheckCircle2, ChevronRight, Scale } from 'lucide-react';
import { storage } from '../services/storageService';
import { FoodLog, ClientProfile } from '../types';
import { searchFoodCsv, FoodDatabaseItem } from '../services/foodService';

const Nutrition: React.FC = () => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<FoodDatabaseItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodDatabaseItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = storage.getAuth();
    if (user) {
      const current = storage.getProfileById(user.id);
      if (current) setProfile(current);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) setResults(searchFoodCsv(searchTerm));
    else setResults([]);
  }, [searchTerm]);

  const handleAddFood = () => {
    if (!selectedFood || !profile) return;
    const newLog: FoodLog = {
      id: Date.now().toString(),
      name: selectedFood.display_name,
      calories: Math.round(selectedFood.calories * quantity),
      protein: Math.round(selectedFood.protein * quantity),
      carbs: Math.round(selectedFood.carbs * quantity),
      fats: Math.round(selectedFood.fats * quantity),
      portion_unit: selectedFood.portion_unit,
      quantity,
      timestamp: new Date().toISOString()
    };
    const updated = { ...profile, foodLogs: [newLog, ...(profile.foodLogs || [])] };
    storage.saveRecord(updated);
    setProfile(updated);
    setSelectedFood(null);
    setSearchTerm("");
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-zinc-900" size={32} /></div>;

  const todayStr = new Date().toDateString();
  const todayLogs = (profile?.foodLogs || []).filter(l => new Date(l.timestamp).toDateString() === todayStr);
  const totals = todayLogs.reduce((acc, l) => ({
    c: acc.c + l.calories, p: acc.p + l.protein, carb: acc.carb + l.carbs, f: acc.f + l.fats
  }), { c: 0, p: 0, carb: 0, f: 0 });
  const targets = profile?.plan?.nutritionTargets || { calories: 2000, protein: 150, carbs: 200, fats: 70 };

  return (
    <div className="min-h-screen flex flex-col space-y-12 animate-fade pb-32 max-w-7xl mx-auto w-full px-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pt-8">
        <div>
          <h2 className="text-6xl font-black text-zinc-900 italic uppercase tracking-tighter leading-none">Nutrition Hub</h2>
          <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest mt-2 italic">Greedy Search Database • MyFitnessPal Protocol</p>
        </div>
        <div className="flex items-center gap-6 bg-zinc-900 p-4 pl-8 rounded-[32px] shadow-2xl">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Energy Balance</p>
           <div className="px-8 py-4 bg-zinc-800 rounded-2xl text-white font-black italic text-xl">
             {Math.round(totals.c)} <span className="text-zinc-500 text-xs font-bold uppercase">/ {targets.calories} KCAL</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <div className="relative group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={28} />
              <input 
                placeholder="Search database (Ex: 'eggs', 'salmon', 'chicken')..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border-2 border-zinc-100 rounded-[40px] p-10 pl-20 text-2xl font-black uppercase italic outline-none focus:border-zinc-900 transition-all shadow-sm placeholder:text-zinc-200"
              />
              {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-6 bg-white border border-zinc-200 rounded-[40px] shadow-2xl z-[100] overflow-hidden max-h-[500px] overflow-y-auto animate-fade">
                   {results.map(item => (
                     <button key={item.id} onClick={() => { setSelectedFood(item); setQuantity(1); }} className="w-full p-8 text-left hover:bg-zinc-50 flex items-center justify-between group border-b border-zinc-50 last:border-0 transition-colors">
                        <div>
                          <p className="text-xl font-black text-zinc-900 uppercase italic group-hover:text-emerald-600 transition-colors">{item.display_name}</p>
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">{item.portion_unit} • {item.calories} KCAL • P: {item.protein}g</p>
                        </div>
                        <Plus size={24} className="text-zinc-200 group-hover:text-zinc-900" />
                     </button>
                   ))}
                </div>
              )}
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-4 px-6">
                 <Clock size={20} className="text-emerald-500" />
                 <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest italic">Logged Today</h3>
              </div>
              <div className="space-y-4">
                 {todayLogs.map(log => (
                   <div key={log.id} className="bg-white border border-zinc-100 p-8 rounded-[40px] flex items-center justify-between group shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all"><Utensils size={32} /></div>
                        <div>
                          <p className="text-2xl font-black text-zinc-900 uppercase italic leading-none">{log.name}</p>
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-2">{log.quantity} × {log.portion_unit} • {log.calories} KCAL</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <div className="hidden sm:flex gap-8">
                            <div className="text-center"><p className="text-[10px] font-black text-zinc-300 uppercase">P</p><p className="text-lg font-black">{log.protein}g</p></div>
                            <div className="text-center"><p className="text-[10px] font-black text-zinc-300 uppercase">C</p><p className="text-lg font-black">{log.carbs}g</p></div>
                            <div className="text-center"><p className="text-[10px] font-black text-zinc-300 uppercase">F</p><p className="text-lg font-black">{log.fats}g</p></div>
                         </div>
                         <button onClick={() => storage.saveRecord({ ...profile!, foodLogs: profile!.foodLogs.filter(l => l.id !== log.id) })} className="p-4 text-zinc-200 hover:text-red-500 transition-colors"><X size={24}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <aside className="space-y-10">
           <div className="bg-white border border-zinc-200 p-12 rounded-[56px] space-y-12 shadow-sm">
              <h4 className="text-xl font-black text-zinc-900 uppercase tracking-widest italic border-b border-zinc-100 pb-4">Daily Targets</h4>
              <div className="space-y-10">
                 {[
                   { label: 'Protein', cur: totals.p, tar: targets.protein, col: 'bg-emerald-500' },
                   { label: 'Carbs', cur: totals.carb, tar: targets.carbs, col: 'bg-zinc-900' },
                   { label: 'Fats', cur: totals.f, tar: targets.fats, col: 'bg-zinc-900' }
                 ].map(m => (
                   <div key={m.label} className="space-y-4">
                      <div className="flex justify-between items-baseline px-1">
                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">{m.label}</p>
                        <p className="text-lg font-black italic">{Math.round(m.cur)}g <span className="text-xs text-zinc-300 uppercase tracking-widest">/ {m.tar}g</span></p>
                      </div>
                      <div className="h-2.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                        <div className={`h-full ${m.col} transition-all duration-1000`} style={{ width: `${Math.min(100, (m.cur / m.tar) * 100)}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </aside>
      </div>

      {selectedFood && (
        <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-2xl z-[200] flex items-center justify-center p-8 animate-fade">
          <div className="bg-white w-full max-w-2xl p-12 md:p-20 rounded-[64px] shadow-2xl relative">
            <header className="text-center space-y-6 mb-12">
               <h3 className="text-5xl font-black italic uppercase text-zinc-900 tracking-tighter leading-none">{selectedFood.display_name}</h3>
               <p className="text-xs font-black text-zinc-300 uppercase tracking-[0.4em]">Scale Your Portion</p>
            </header>
            <div className="flex flex-col items-center gap-12 mb-12">
               <div className="flex items-center gap-8">
                  <button onClick={() => setQuantity(Math.max(0.1, quantity - 0.5))} className="w-20 h-20 rounded-3xl bg-zinc-50 border border-zinc-100 font-black text-4xl hover:bg-zinc-100 transition-all">-</button>
                  <div className="text-center min-w-[120px]"><span className="text-7xl font-black italic">{quantity}</span><p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">{selectedFood.portion_unit}</p></div>
                  <button onClick={() => setQuantity(quantity + 0.5)} className="w-20 h-20 rounded-3xl bg-zinc-50 border border-zinc-100 font-black text-4xl hover:bg-zinc-100 transition-all">+</button>
               </div>
               <div className="w-full grid grid-cols-4 gap-4 p-8 bg-zinc-50 rounded-[40px] border border-zinc-100">
                  <div className="text-center space-y-1"><p className="text-[9px] font-black text-zinc-400 uppercase">KCAL</p><p className="text-xl font-black italic">{Math.round(selectedFood.calories * quantity)}</p></div>
                  <div className="text-center space-y-1"><p className="text-[9px] font-black text-zinc-400 uppercase">P</p><p className="text-xl font-black italic">{Math.round(selectedFood.protein * quantity)}g</p></div>
                  <div className="text-center space-y-1"><p className="text-[9px] font-black text-zinc-400 uppercase">C</p><p className="text-xl font-black italic">{Math.round(selectedFood.carbs * quantity)}g</p></div>
                  <div className="text-center space-y-1"><p className="text-[9px] font-black text-zinc-400 uppercase">F</p><p className="text-xl font-black italic">{Math.round(selectedFood.fats * quantity)}g</p></div>
               </div>
            </div>
            <div className="flex gap-6">
              <button onClick={() => setSelectedFood(null)} className="flex-1 py-7 bg-zinc-50 text-zinc-400 font-black uppercase text-xs tracking-widest rounded-3xl hover:bg-zinc-100 transition-all">Cancel</button>
              <button onClick={handleAddFood} className="flex-[2] py-7 premium-gradient text-white font-black uppercase text-xs tracking-[0.3em] rounded-3xl shadow-2xl hover:scale-105 transition-all">Confirm Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
