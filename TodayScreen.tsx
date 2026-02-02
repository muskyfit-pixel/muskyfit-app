
import React, { useState, useEffect, useMemo } from 'react';
import Card from './Card';
import Button from './Button';
import Logo from './Logo';
import { sheetsService } from '../services/sheetsService';
import { FoodItem, FoodLog, Client, DailyLog } from '../types';

interface TodayScreenProps {
  client: Client;
}

const TodayScreen: React.FC<TodayScreenProps> = ({ client }) => {
  const [steps, setSteps] = useState<number>(0);
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(false);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [foodDb, setFoodDb] = useState<FoodItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const db = await sheetsService.getFoodDb();
      setFoodDb(db);
      const history = await sheetsService.getClientHistory(client.id);
      const today = new Date().toISOString().split('T')[0];
      if (history.find(h => h.date === today)) setHasLoggedToday(true);
    };
    load();
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
      workoutType: 'Generated',
      workoutId: 'Generated',
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 animate-in zoom-in duration-500">
        <Logo className="w-24 h-24 mb-10" />
        <h2 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter">STANDARD MET</h2>
        <div className="h-[2px] w-12 bg-musky-orange mx-auto mb-8"></div>
        <p className="text-gray-500 max-w-[280px] mx-auto text-xs font-black uppercase tracking-widest leading-loose">
          Your metrics have been synced to the coach dashboard. 
          Focus on high-quality recovery and hydration.
        </p>
        <Button variant="secondary" className="mt-16 opacity-40 hover:opacity-100" onClick={() => setHasLoggedToday(false)}>
          EDIT RECORDS
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="px-2 mt-4 flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">CORE</h2>
          <p className="text-sm text-musky-orange font-black uppercase tracking-[0.4em] mt-4">TODAY'S METRICS</p>
        </div>
      </header>

      <div className="px-2 space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-musky-orange uppercase tracking-[0.5em]">PILLAR I: MOVEMENT</label>
          <div className="relative">
            <input 
              type="number" 
              value={steps || ''} 
              onChange={e => setSteps(parseInt(e.target.value) || 0)} 
              placeholder="0" 
              className="w-full bg-musky-black border-2 border-white/30 px-6 py-8 text-7xl font-black text-white focus:border-musky-orange transition-all"
            />
            <div className="absolute right-6 bottom-8 text-[11px] font-black text-musky-orange uppercase tracking-widest">STEPS</div>
          </div>
        </div>

        <div className="space-y-4">
           <label className="text-[10px] font-black text-musky-orange uppercase tracking-[0.5em]">PILLAR II: TRAINING</label>
           <button 
             onClick={() => setWorkoutCompleted(!workoutCompleted)}
             className={`w-full p-10 border-4 transition-all flex justify-between items-center ${workoutCompleted ? 'bg-white border-white text-black' : 'bg-transparent border-white/20 text-white'}`}
           >
             <span className="text-2xl font-black uppercase tracking-tighter">SESSION DONE</span>
             <div className={`w-10 h-10 border-4 flex items-center justify-center ${workoutCompleted ? 'border-black' : 'border-white/20'}`}>
               {workoutCompleted && <div className="w-5 h-5 bg-black"></div>}
             </div>
           </button>
        </div>

        <div className="pt-10 border-t-2 border-white/10">
          <Button 
            fullWidth 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="h-28 text-2xl border-musky-orange bg-musky-orange text-black font-black uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(228,81,46,0.3)]"
          >
            {isSubmitting ? 'SYNCING...' : 'SYNC DAY'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodayScreen;
