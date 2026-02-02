
import React, { useEffect, useState } from 'react';
import WorkoutTracker from './WorkoutTracker';
import { WorkoutData, WorkoutLogged, Client } from '../types';
import { sheetsService } from '../services/sheetsService';

interface TrainingScreenProps {
  client: Client;
  results: WorkoutLogged[];
  setResults: (r: WorkoutLogged[]) => void;
  workoutCompleted: boolean;
  setWorkoutCompleted: (b: boolean) => void;
}

const TrainingScreen: React.FC<TrainingScreenProps> = ({ client, results, setResults, workoutCompleted, setWorkoutCompleted }) => {
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      const next = await sheetsService.getNextWorkout(client);
      setWorkout(next);
      setLoading(false);
    };
    loadWorkout();
  }, [client]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-musky-orange">
      <div className="w-12 h-12 border-4 border-musky-orange/20 border-t-musky-orange animate-spin mb-6"></div>
      <p className="font-black uppercase tracking-[0.4em] text-xs">Building Session...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="px-2 mt-4 flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">IRON</h2>
          <p className="text-sm text-musky-orange font-black uppercase tracking-[0.4em] mt-4">TYPE: {workout?.type}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">TODAY'S PLAN</p>
          <p className="text-xl font-black text-white">{workout?.label}</p>
        </div>
      </div>

      <div className="px-2 space-y-10">
        <div className={`p-8 border-2 transition-all flex items-center justify-between ${workoutCompleted ? 'bg-white border-white text-black' : 'bg-transparent border-white/20 text-white'}`}>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">SESSION STATUS</p>
            <p className="text-xl font-black uppercase tracking-tight">
              {workoutCompleted ? 'LOGGED & SAVED' : 'READY TO START'}
            </p>
          </div>
          <button 
            onClick={() => setWorkoutCompleted(!workoutCompleted)}
            className={`w-14 h-14 border-2 flex items-center justify-center transition-all ${workoutCompleted ? 'bg-black border-black' : 'border-white/30'}`}
          >
            {workoutCompleted && (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        {workout && (
          <div className="border-t-2 border-white/30 pt-10">
            <div className="mb-10 bg-musky-orange/5 border border-musky-orange/20 p-6">
               <p className="text-[10px] font-black text-musky-orange uppercase tracking-widest mb-2">COACH'S NOTE</p>
               <p className="text-xs text-white/60 font-medium leading-relaxed">
                 Tailored for your focus on: <span className="text-white">{client.bodyConcern || 'General Fitness'}</span>. 
                 Move with purpose and control.
               </p>
            </div>
            <WorkoutTracker 
              workout={workout} 
              results={results}
              setResults={setResults}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingScreen;
