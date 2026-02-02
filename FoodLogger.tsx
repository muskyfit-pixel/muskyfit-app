import React, { useState, useMemo } from 'react';
import { FoodItem, FoodLog } from '../types';
import Button from './Button';

interface FoodLoggerProps {
  foodDb: FoodItem[];
  logs: FoodLog[];
  setLogs: (logs: FoodLog[]) => void;
}

const FoodLogger: React.FC<FoodLoggerProps> = ({ foodDb, logs, setLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [multiplier, setMultiplier] = useState(1);

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return foodDb.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 30);
  }, [searchTerm, foodDb]);

  const handleAddFood = () => {
    if (selectedFood) {
      setLogs([...logs, { foodId: selectedFood.id, multiplier }]);
      setSearchTerm('');
      setIsSearching(false);
      setSelectedFood(null);
      setMultiplier(1);
    }
  };

  const removeRow = (index: number) => {
    setLogs(logs.filter((_, i) => i !== index));
  };

  const getFoodStats = (foodId: string, mult: number) => {
    const food = foodDb.find(f => f.id === foodId);
    if (!food) return { cals: 0, p: 0, c: 0, f: 0, name: 'Unknown' };
    return {
      name: food.name,
      portion: food.portionSize,
      cals: Math.round(food.calories * mult),
      p: Math.round(food.protein * mult),
      c: Math.round(food.carbs * mult),
      f: Math.round(food.fats * mult),
    };
  };

  return (
    <div className="space-y-8">
      {/* SEARCH INTERFACE */}
      <div className="relative">
        {!isSearching ? (
          <button 
            onClick={() => setIsSearching(true)} 
            className="w-full bg-musky-black border-2 border-white px-8 py-10 flex items-center justify-between group active:border-musky-orange"
          >
            <span className="text-white font-black uppercase tracking-[0.4em] text-sm">SEARCH {foodDb.length}+ FOODS...</span>
            <svg className="w-6 h-6 text-musky-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex gap-4 items-center">
              <input 
                autoFocus
                type="text"
                placeholder="NAME OF FOOD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-musky-black border-b-4 border-musky-orange px-0 py-6 text-white font-black uppercase tracking-widest outline-none text-2xl placeholder:text-white/20 rounded-none"
              />
              <button onClick={() => { setIsSearching(false); setSelectedFood(null); setSearchTerm(''); }} className="text-musky-orange font-black text-[11px] uppercase tracking-widest px-4 py-2 border-2 border-musky-orange/20">CANCEL</button>
            </div>

            {searchTerm && !selectedFood && (
              <div className="divide-y-2 divide-white/10 bg-white/5 border-2 border-white/10">
                {filteredResults.map(food => (
                  <button 
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className="w-full flex justify-between items-center p-6 text-left active:bg-musky-orange active:text-black transition-colors"
                  >
                    <div>
                      <p className="font-black text-white uppercase text-base tracking-tight leading-tight">{food.name}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] font-black uppercase text-musky-orange tracking-widest">{food.portionSize}</span>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-black uppercase text-white/60">P:{food.protein}</span>
                          <span className="text-[10px] font-black uppercase text-white/60">C:{food.carbs}</span>
                          <span className="text-[10px] font-black uppercase text-white/60">F:{food.fats}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-white">{food.calories} <span className="text-[10px] text-musky-orange">KCAL</span></p>
                  </button>
                ))}
                {filteredResults.length === 0 && (
                  <div className="p-10 text-center text-musky-orange text-[11px] font-black uppercase tracking-[0.3em]">NO RESULTS FOUND</div>
                )}
              </div>
            )}

            {selectedFood && (
              <div className="border-4 border-musky-orange p-8 space-y-8 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h4 className="text-3xl font-black text-white uppercase leading-tight tracking-tighter">{selectedFood.name}</h4>
                    <p className="text-[11px] text-musky-orange font-black mt-3 uppercase tracking-widest">UNIT: {selectedFood.portionSize}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-6xl font-black text-white leading-none">{Math.round(selectedFood.calories * multiplier)}</p>
                    <p className="text-[11px] text-musky-orange font-black mt-2 tracking-widest uppercase">KCAL</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 border-y-2 border-white/10 py-10">
                    <div className="text-center">
                      <p className="text-3xl font-black text-white">{Math.round(selectedFood.protein * multiplier)}G</p>
                      <p className="text-[11px] text-musky-orange font-black uppercase tracking-widest mt-2">PRO</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-white">{Math.round(selectedFood.carbs * multiplier)}G</p>
                      <p className="text-[11px] text-musky-orange font-black uppercase tracking-widest mt-2">CHO</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-white">{Math.round(selectedFood.fats * multiplier)}G</p>
                      <p className="text-[11px] text-musky-orange font-black uppercase tracking-widest mt-2">FAT</p>
                    </div>
                </div>

                <div className="space-y-6">
                   <label className="text-[11px] font-black text-musky-orange uppercase tracking-[0.4em]">ADJUST MULTIPLIER</label>
                   <div className="flex items-center gap-8">
                     <button onClick={() => setMultiplier(Math.max(0.1, multiplier - 0.1))} className="w-16 h-16 border-2 border-white/30 text-4xl font-black text-white">-</button>
                     <div className="flex-1 text-center font-black text-white text-6xl">{multiplier.toFixed(1)}</div>
                     <button onClick={() => setMultiplier(multiplier + 0.1)} className="w-16 h-16 border-2 border-white/30 text-4xl font-black text-white">+</button>
                   </div>
                </div>

                <Button fullWidth onClick={handleAddFood} className="h-24 text-xl border-musky-orange bg-musky-orange text-black">CONFIRM ENTRY</Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TODAY'S LOGGED FOODS */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-musky-orange uppercase tracking-[0.5em] pb-3 border-b-2 border-musky-orange/30">TODAY'S FUEL SYNC</h3>
        {logs.map((log, index) => {
          const stats = getFoodStats(log.foodId, log.multiplier);
          return (
            <div key={index} className="bg-white/5 p-6 flex justify-between items-center group border-l-4 border-musky-orange">
              <div className="flex-1">
                <div className="flex items-baseline gap-4">
                  <span className="font-black text-xl text-white uppercase tracking-tight">{stats.name}</span>
                  <span className="text-[11px] text-musky-orange font-black uppercase">{log.multiplier.toFixed(1)}x</span>
                </div>
                <div className="flex gap-6 mt-3">
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">P {stats.p}g</span>
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">C {stats.c}g</span>
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">F {stats.f}g</span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <p className="font-black text-3xl text-white">{stats.cals}</p>
                <button 
                  onClick={() => removeRow(index)}
                  className="text-white/20 hover:text-musky-orange transition-all"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
        
        {logs.length === 0 && !isSearching && (
          <div className="py-24 text-center border-4 border-dashed border-white/10 opacity-30">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-musky-orange">NO FUEL DATA SYNCED</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLogger;