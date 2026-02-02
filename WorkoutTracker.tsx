
import React from 'react';
import { WorkoutData, WorkoutLogged } from '../types';

interface WorkoutTrackerProps {
  workout: WorkoutData;
  results: WorkoutLogged[];
  setResults: (results: WorkoutLogged[]) => void;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ workout, results, setResults }) => {
  const handleUpdate = (exerciseName: string, field: keyof WorkoutLogged, value: any) => {
    const existingIndex = results.findIndex(r => r.exerciseName === exerciseName);
    const newResults = [...results];
    
    if (existingIndex > -1) {
      newResults[existingIndex] = { ...newResults[existingIndex], [field]: value };
    } else {
      newResults.push({
        exerciseName,
        weight: 0,
        reps: 0,
        notes: '',
        [field]: value
      });
    }
    setResults(newResults);
  };

  const getResult = (name: string) => results.find(r => r.exerciseName === name) || { weight: '', reps: '', notes: '' };

  if (!workout || workout.type === 'Rest' || workout.exercises.length === 0) {
    return (
      <div className="text-center py-24 border-4 border-white/10 mt-10">
        <p className="text-white font-black text-3xl uppercase tracking-[0.4em]">RECOVERY</p>
        <p className="text-musky-orange text-xs mt-6 uppercase tracking-[0.5em] font-black">SYSTEM REBOOT IN PROGRESS</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 mt-12">
      {workout.exercises.map((ex, idx) => {
        const res = getResult(ex.name);
        return (
          <div key={idx} className="border-t-2 border-white/20 pt-10 first:border-t-0 first:pt-0">
            <div className="flex justify-between items-baseline mb-8">
              <h5 className="font-black text-2xl text-white uppercase tracking-tight">{ex.name}</h5>
              <span className="text-xs font-black text-musky-orange uppercase tracking-[0.3em] border-b-2 border-musky-orange pb-2">RPE {ex.rpe}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="text-[11px] text-musky-orange font-black uppercase tracking-widest opacity-80">TARGET PROTOCOL</p>
                <p className="text-3xl font-black text-white">{ex.sets} × {ex.reps}</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[11px] text-musky-orange font-black uppercase tracking-widest opacity-80">LOAD (KG)</p>
                  <input 
                    type="number"
                    placeholder="0"
                    value={res.weight}
                    onChange={(e) => handleUpdate(ex.name, 'weight', parseFloat(e.target.value))}
                    className="w-full bg-musky-black border-b-4 border-white/30 px-0 py-4 text-3xl font-black text-white focus:border-musky-orange outline-none transition-all rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-musky-orange font-black uppercase tracking-widest opacity-80">REPS PERFORMED</p>
                  <input 
                    type="number"
                    placeholder="0"
                    value={res.reps}
                    onChange={(e) => handleUpdate(ex.name, 'reps', parseInt(e.target.value))}
                    className="w-full bg-musky-black border-b-4 border-white/30 px-0 py-4 text-3xl font-black text-white focus:border-musky-orange outline-none transition-all rounded-none"
                  />
                </div>
              </div>
            </div>
            
            <input 
              type="text"
              placeholder="NOTES..."
              value={res.notes}
              onChange={(e) => handleUpdate(ex.name, 'notes', e.target.value)}
              className="w-full bg-musky-black border-b-2 border-white/10 py-6 text-xs font-black text-white placeholder:text-white/20 outline-none focus:border-musky-orange transition-all uppercase tracking-[0.2em] mt-8 rounded-none"
            />
          </div>
        );
      })}
    </div>
  );
};

export default WorkoutTracker;
