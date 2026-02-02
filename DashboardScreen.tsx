import React, { useState, useEffect, useMemo } from 'react';
import { sheetsService } from '../services/sheetsService';
import { FoodItem, FoodLog, Client, DailyLog } from '../types';
import Button from './Button';
import Logo from './Logo';

interface DashboardScreenProps {
  client: Client;
  steps: number;
  setSteps: (n: number) => void;
  foodLogs: FoodLog[];
  workoutCompleted: boolean;
  setWorkoutCompleted: (b: boolean) => void;
  foodDb: FoodItem[];
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  client, 
  steps, 
  setSteps, 
  foodLogs, 
  workoutCompleted, 
  setWorkoutCompleted,
  foodDb
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  useEffect(() => {
    const checkToday = async () => {
      const history = await sheetsService.getClientHistory(client.id);
      const today = new Date().toISOString().split('T')[0];
      if (history.find(h => h.date === today)) {
        setHasLoggedToday(true);
      }
    };
    checkToday();
  }, [client.id]);

  const totals = useMemo(() => {
    return foodLogs.reduce((acc, log) => {
      const food = foodDb.find(f => f.id === log.foodId);
      if (!food) return acc;
      return {
        calories: acc.calories + (food.calories * log.multiplier),
        protein: acc.protein + (food.protein * log.multiplier),
        carbs: acc.carbs + (food.carbs * log.multiplier),
        fats: acc.fats + (food.fats * log.multiplier),
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }, [foodLogs, foodDb]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const log: DailyLog = {
      date: new Date().toISOString().split('T')[0],
      clientId: client.id,
      steps,
      workoutCompleted,
      workoutType: 'Tracked',
      workoutId: 'GEN',
      foodLogs,
      workoutResults: [],
      totals
    };
    await sheetsService.saveDailyLog(log);
    setHasLoggedToday(true);
    setIsSubmitting(false);
  };

  if (hasLoggedToday) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 animate-in zoom-in duration-500">
        <Logo className="w-24 h-24 mb-10" glow={false} />
        <h2 className="text-5xl font-black mb-6 text-white uppercase tracking-tighter leading-none">SYSTEM SYNCED</h2>
        <div className="h-[2px] w-16 bg-musky-orange mx-auto mb-10"></div>
        <p className="text-white/40 max-w-[300px] mx-auto text-[11px] font-black uppercase tracking-[0.4em] leading-loose">
          Target parameters achieved. Data transmitted to coaching command.
        </p>
        <button 
          className="mt-20 text-musky-orange text-[10px] font-black uppercase tracking-[0.6em] border-b border-musky-orange/30 pb-2"
          onClick={() => setHasLoggedToday(false)}
        >
          ADJUST RECORDS
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-16 p-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mt-8">
        <h2 className="text-7xl font-black text-white uppercase tracking-tighter leading-none">CORE</h2>
        <p className="text-sm text-musky-orange font-black uppercase tracking-[0.5em] mt-6">DAILY PARAMETERS</p>
      </header>

      <div className="space-y-14">
        {/* STEPS TRACKER */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em]">PILLAR I: MOVEMENT</label>
          <div className="relative border-b-4 border-white/10 focus-within:border-musky-orange transition-all">
            <input 
              type="number" 
              value={steps || ''} 
              onChange={e => setSteps(parseInt(e.target.value) || 0)} 
              placeholder="00000" 
              className="w-full bg-transparent py-10 text-8xl font-black text-white outline-none placeholder:text-white/5"
            />
            <div className="absolute right-0 bottom-4 text-[11px] font-black text-musky-orange uppercase tracking-[0.4em]">STEPS COMPLETED</div>
          </div>
        </div>

        {/* WORKOUT TOGGLE */}
        <div className="space-y-6">
           <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em]">PILLAR II: TRAINING</label>
           <button 
             onClick={() => setWorkoutCompleted(!workoutCompleted)}
             className={`w-full p-12 border-2 transition-all duration-300 flex justify-between items-center ${workoutCompleted ? 'bg-white border-white text-black' : 'bg-transparent border-white/20 text-white'}`}
           >
             <span className="text-3xl font-black uppercase tracking-tighter">IRON PROTOCOL</span>
             <div className={`w-12 h-12 border-4 flex items-center justify-center ${workoutCompleted ? 'border-black' : 'border-white/20'}`}>
               {workoutCompleted && <div className="w-6 h-6 bg-black"></div>}
             </div>
           </button>
        </div>

        {/* SUMMARY SECTION */}
        <div className="pt-10 border-t-2 border-white/10">
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white/5 p-6 border border-white/10">
               <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">TOTAL ENERGY</p>
               <p className="text-3xl font-black text-white">{Math.round(totals.calories)} <span className="text-xs text-musky-orange">KCAL</span></p>
            </div>
            <div className="bg-white/5 p-6 border border-white/10">
               <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">TOTAL PROTEIN</p>
               <p className="text-3xl font-black text-white">{Math.round(totals.protein)} <span className="text-xs text-musky-orange">G</span></p>
            </div>
          </div>

          <Button 
            fullWidth 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="h-28 text-2xl border-musky-orange bg-musky-orange text-black font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(228,81,46,0.2)]"
          >
            {isSubmitting ? 'SYNCING...' : 'SYNC DAY'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;