
import React, { useMemo, useState } from 'react';
import Button from './Button';
import { FoodLog, FoodItem, Client, DailyLog } from '../types';
import { sheetsService } from '../services/sheetsService';

interface DashboardProps {
  client: Client;
  steps: number;
  setSteps: (s: number) => void;
  foodLogs: FoodLog[];
  workoutCompleted: boolean;
  setWorkoutCompleted: (b: boolean) => void;
  foodDb: FoodItem[];
}

const DashboardScreen: React.FC<DashboardProps> = ({ client, steps, setSteps, foodLogs, workoutCompleted, setWorkoutCompleted, foodDb }) => {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

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

  const calorieTarget = client.targetCalories || 2000; 
  const caloriePercent = Math.min(100, (totals.calories / calorieTarget) * 100);
  const stepTarget = 10000;
  const stepPercent = Math.min(100, (steps / stepTarget) * 100);

  const handleSync = async () => {
    setSyncing(true);
    const log: DailyLog = {
      date: new Date().toISOString().split('T')[0],
      clientId: client.id,
      steps,
      workoutCompleted,
      workoutType: 'Programme Session',
      workoutId: 'Generated',
      foodLogs,
      workoutResults: [],
      totals
    };
    await sheetsService.saveDailyLog(log);
    setSyncing(false);
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32">
      {/* SYSTEM STATUS HUD */}
      <div className="grid grid-cols-3 gap-[1px] bg-white/10 border-y-2 border-white/10">
        <StatusBox label="FUEL" active={foodLogs.length > 0} />
        <StatusBox label="IRON" active={workoutCompleted} />
        <StatusBox label="MVMT" active={steps >= stepTarget} />
      </div>

      <div className="px-2 mt-4 text-center">
        <h2 className="text-sm text-musky-orange font-black uppercase tracking-[0.5em] mb-4">DAILY STATUS</h2>
        <div className="relative inline-block">
          <svg className="w-72 h-72 -rotate-90">
            <circle cx="144" cy="144" r="130" fill="transparent" stroke="#111" strokeWidth="4" />
            <circle cx="144" cy="144" r="130" fill="transparent" stroke="#E4512E" strokeWidth="12" 
              strokeDasharray={`${2 * Math.PI * 130}`} 
              strokeDashoffset={`${2 * Math.PI * 130 * (1 - caloriePercent/100)}`}
              strokeLinecap="square"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-8xl font-black text-white leading-none tracking-tighter">{Math.round(totals.calories)}</span>
            <span className="text-[10px] text-musky-orange font-black uppercase tracking-[0.6em] mt-4 opacity-60">ENERGY USED</span>
            <div className="h-[2px] w-8 bg-white/20 mt-6"></div>
            <span className="text-xs text-white/40 font-black uppercase tracking-[0.2em] mt-4">TARGET: {calorieTarget} KCAL</span>
          </div>
        </div>
      </div>

      <div className="px-2 grid grid-cols-3 gap-4">
        <FuelHUD label="BUILD" actual={totals.protein} target={client.targetProtein} color="text-white" />
        <FuelHUD label="ENERGY" actual={totals.carbs} target={client.targetCarbs} color="text-white" />
        <FuelHUD label="VITALITY" actual={totals.fats} target={client.targetFats} color="text-white" />
      </div>

      <div className="px-2 space-y-6">
        <div className="flex justify-between items-end">
          <label className="text-[10px] font-black text-musky-orange uppercase tracking-[0.5em]">MOVEMENT TARGET</label>
          <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">{Math.round(stepPercent)}% COMPLETE</span>
        </div>
        <div className="relative group">
          <input 
            type="number" 
            value={steps || ''} 
            onChange={(e) => setSteps(parseInt(e.target.value) || 0)} 
            placeholder="0" 
            className="w-full bg-black border-2 border-white/20 px-8 py-10 text-7xl font-black text-white focus:border-musky-orange transition-all placeholder:text-white/10 rounded-none"
          />
          <div className="absolute right-8 bottom-10 pointer-events-none flex flex-col items-end">
            <span className="text-musky-orange font-black text-xs tracking-[0.3em] uppercase">STEPS TODAY</span>
          </div>
          <div className="absolute left-0 bottom-0 h-1 bg-musky-orange transition-all duration-500" style={{ width: `${stepPercent}%` }}></div>
        </div>
      </div>

      <div className="px-2 pt-10">
        <Button 
          fullWidth 
          onClick={handleSync}
          disabled={syncing || synced}
          className={`h-28 border-4 text-2xl transition-all relative overflow-hidden ${synced ? 'bg-white text-black border-white' : 'bg-musky-orange text-black border-musky-orange'}`}
        >
          {syncing && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
          <span className="relative z-10 font-black tracking-[0.3em]">{syncing ? 'UPDATING...' : synced ? 'SECURED' : 'SEND TO COACH'}</span>
        </Button>
      </div>
    </div>
  );
};

const StatusBox = ({ label, active }: { label: string, active: boolean }) => (
  <div className={`py-4 text-center transition-all ${active ? 'bg-musky-orange/10' : 'bg-transparent'}`}>
    <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${active ? 'text-musky-orange' : 'text-white/20'}`}>{label}</p>
    <div className={`h-1 w-4 mx-auto mt-2 ${active ? 'bg-musky-orange' : 'bg-white/10'}`}></div>
  </div>
);

const FuelHUD = ({ label, actual, target, color }: any) => (
  <div className="bg-white/5 border border-white/10 p-4 text-center">
    <p className="text-[9px] font-black text-musky-orange uppercase tracking-widest mb-2">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{Math.round(actual)}</p>
    <div className="w-full h-[1px] bg-white/10 my-2"></div>
    <p className="text-[9px] font-black text-white/30 uppercase">{target}G</p>
  </div>
);

export default DashboardScreen;
