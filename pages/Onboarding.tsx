
import React, { useState, useEffect, ReactNode, Component } from 'react';
import { ArrowRight, AlertTriangle, Loader2, CheckCircle2, Heart, Activity, Utensils, Target, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storageService';
import { ClientProfile, User, HealthSafetyCheck, Lifestyle } from '../types';
import { MuskyLogo } from '../components/MuskyLogo';

interface OnboardingErrorBoundaryProps { children?: ReactNode; }
interface OnboardingErrorBoundaryState { hasError: boolean; }

// Fix: Using React.Component and explicitly typing props/state to avoid ambiguity that causes 'this.props' to be unrecognized.
class OnboardingErrorBoundary extends React.Component<OnboardingErrorBoundaryProps, OnboardingErrorBoundaryState> {
  state: OnboardingErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  
  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-8 text-center z-[9999]">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Something went wrong during setup</h2>
        <p className="text-zinc-500 text-sm mb-6">Your data is still saved. Please try refreshing.</p>
        <button onClick={() => window.location.reload()} className="px-10 py-4 bg-zinc-900 text-white font-bold rounded-2xl shadow-xl uppercase tracking-widest text-[10px]">Try again</button>
      </div>
    );
    return children;
  }
}

const OnboardingInner: React.FC<{ onComplete: (user: User) => void }> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'account' | 'health' | 'lifestyle' | 'nutrition' | 'goals'>('account');
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState<any>({
    name: '', email: '', password: '', age: '', gender: 'Male', height: '', weight: '',
    // Health
    hasHeartCondition: false, hasHighBP: false, hasDiabetes: false, hasCurrentInjuries: false,
    hasPastInjuries: false, hasHadSurgery: false, usesMedication: false, isPregnantOrPostnatal: false,
    hasJointPain: false, doctorAdvisedNoExercise: false, clearanceRequired: false,
    medicalDetails: '', injuryDetails: '',
    // Lifestyle
    occupationActivity: 'Sedentary', sleepQuality: 'Average', stressLevel: 3,
    // Nutrition
    breakfastTime: '08:00', lunchTime: '13:00', dinnerTime: '19:00', mealsPerDay: '3',
    eatingHabits: 'Mixed', dietaryPreference: 'None', religiousRestrictions: '',
    foodDislikes: '', allergies: '', refusedFoods: '',
    // Goals
    primaryGoal: 'Health', daysPerWeek: 3, consent: false
  });

  useEffect(() => {
    const draft = localStorage.getItem('signup_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setForm(parsed.form);
        setStage(parsed.stage || 'account');
      } catch (e) {}
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('signup_draft', JSON.stringify({ form, stage }));
  }, [form, stage, isLoading]);

  const handleFinalSubmit = () => {
    if (!form.consent) { alert("Please agree to the terms."); return; }
    
    const healthSafety: HealthSafetyCheck = {
      hasHeartCondition: form.hasHeartCondition, hasHighBP: form.hasHighBP, hasDiabetes: form.hasDiabetes,
      hasCurrentInjuries: form.hasCurrentInjuries, hasPastInjuries: form.hasPastInjuries, hasHadSurgery: form.hasHadSurgery,
      usesMedication: form.usesMedication, isPregnantOrPostnatal: form.isPregnantOrPostnatal, hasJointPain: form.hasJointPain,
      doctorAdvisedNoExercise: form.doctorAdvisedNoExercise, clearanceRequired: form.clearanceRequired,
      medicalDetails: form.medicalDetails, injuryDetails: form.injuryDetails
    };

    const lifestyle: Lifestyle = {
      age: parseInt(form.age) || 0, gender: form.gender, heightCm: parseInt(form.height) || 0, weightKg: parseInt(form.weight) || 0,
      occupationActivity: form.occupationActivity, sleepQuality: form.sleepQuality, stressLevel: form.stressLevel,
      breakfastTime: form.breakfastTime, lunchTime: form.lunchTime, dinnerTime: form.dinnerTime,
      mealsPerDay: form.mealsPerDay, eatingHabits: form.eatingHabits, dietaryPreference: form.dietaryPreference,
      religiousRestrictions: form.religiousRestrictions, foodDislikes: form.foodDislikes, allergies: form.allergies,
      refusedFoods: form.refusedFoods, primaryGoal: form.primaryGoal, daysPerWeek: form.daysPerWeek,
      // Fix: Added initialization for baselineSteps to satisfy the updated Lifestyle interface
      baselineSteps: 8000
    };

    const member: ClientProfile = {
      id: Date.now().toString(), name: form.name, email: form.email, password: form.password,
      status: 'Reviewing', parq_completed: true, intake_completed: true,
      healthSafety, lifestyle, foodLogs: [], workouts: [], joinedAt: new Date().toLocaleDateString('en-GB')
    };

    storage.saveRecord(member);
    localStorage.removeItem('signup_draft');
    onComplete({ id: member.id, name: member.name, email: member.email, role: 'CLIENT' });
    navigate('/', { replace: true });
  };

  const inputCls = "w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 font-medium transition-all text-sm";
  const labelCls = "text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 block";
  const checkCls = (id: string) => `flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${form[id] ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'}`;

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-zinc-900" /></div>;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-[40px] shadow-sm overflow-hidden flex flex-col min-h-[80vh]">
        <div className="p-8 md:p-12 flex-1 flex flex-col">
          <header className="text-center mb-10 shrink-0">
            <MuskyLogo size={48} className="mx-auto mb-4" />
            <h1 className="text-3xl font-black text-zinc-900 uppercase italic tracking-tighter">Production Intake</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Stage: {stage.toUpperCase()}</p>
          </header>

          <div className="flex-1">
            {stage === 'account' && (
              <div className="space-y-6 animate-fade">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><label className={labelCls}>Full Name</label><input className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ex: John Smith" /></div>
                  <div className="md:col-span-2"><label className={labelCls}>Email Address</label><input className={inputCls} value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" /></div>
                  <div className="md:col-span-2"><label className={labelCls}>Create Password</label><input type="password" className={inputCls} value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
                  <div><label className={labelCls}>Age</label><input type="number" className={inputCls} value={form.age} onChange={e => setForm({...form, age: e.target.value})} /></div>
                  <div><label className={labelCls}>Gender</label><select className={inputCls} value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div>
                </div>
                <button onClick={() => setStage('health')} className="w-full py-5 bg-zinc-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2">Health Verification <ArrowRight size={16}/></button>
              </div>
            )}

            {stage === 'health' && (
              <div className="space-y-8 animate-fade pb-10">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'hasHeartCondition', l: 'Heart conditions?' },
                    { id: 'hasHighBP', l: 'High blood pressure?' },
                    { id: 'hasDiabetes', l: 'Diabetes?' },
                    { id: 'hasCurrentInjuries', l: 'Current injuries?' },
                    { id: 'hasPastInjuries', l: 'Significant past injuries?' },
                    { id: 'isPregnantOrPostnatal', l: 'Pregnancy or Postnatal (last 6 months)?' },
                    { id: 'hasJointPain', l: 'Regular joint pain?' },
                    { id: 'clearanceRequired', l: 'GP clearance obtained?' }
                  ].map(it => (
                    <label key={it.id} className={checkCls(it.id)}>
                      <span className="text-xs font-bold uppercase italic">{it.l}</span>
                      <input type="checkbox" checked={form[it.id]} onChange={e => setForm({...form, [it.id]: e.target.checked})} className="w-5 h-5 accent-emerald-500" />
                    </label>
                  ))}
                </div>
                <div className="space-y-4">
                  <label className={labelCls}>Medical & Medication Details</label>
                  <textarea className={`${inputCls} h-24`} value={form.medicalDetails} onChange={e => setForm({...form, medicalDetails: e.target.value})} placeholder="List all details here..." />
                </div>
                <button onClick={() => setStage('lifestyle')} className="w-full py-5 bg-zinc-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl">Lifestyle Metrics</button>
              </div>
            )}

            {stage === 'lifestyle' && (
              <div className="space-y-6 animate-fade">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelCls}>Height (cm)</label><input type="number" className={inputCls} value={form.height} onChange={e => setForm({...form, height: e.target.value})} /></div>
                  <div><label className={labelCls}>Weight (kg)</label><input type="number" className={inputCls} value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} /></div>
                  <div><label className={labelCls}>Occupation Activity</label><select className={inputCls} value={form.occupationActivity} onChange={e => setForm({...form, occupationActivity: e.target.value})}><option value="Sedentary">Sedentary (Desk)</option><option value="Mixed">Mixed (On feet)</option><option value="Active">Active (Manual Labour)</option></select></div>
                  <div><label className={labelCls}>Sleep Quality</label><select className={inputCls} value={form.sleepQuality} onChange={e => setForm({...form, sleepQuality: e.target.value})}><option>Poor</option><option>Average</option><option>Good</option></select></div>
                </div>
                <button onClick={() => setStage('nutrition')} className="w-full py-5 bg-zinc-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl">Nutrition Intake</button>
              </div>
            )}

            {stage === 'nutrition' && (
              <div className="space-y-6 animate-fade pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelCls}>Meals Per Day</label><select className={inputCls} value={form.mealsPerDay} onChange={e => setForm({...form, mealsPerDay: e.target.value})}><option>2</option><option>3</option><option>4</option><option>5</option></select></div>
                  <div><label className={labelCls}>Eating Habits</label><select className={inputCls} value={form.eatingHabits} onChange={e => setForm({...form, eatingHabits: e.target.value})}><option>Home Cooked</option><option>Takeaway</option><option>Mixed</option></select></div>
                  <div><label className={labelCls}>Preference</label><select className={inputCls} value={form.dietaryPreference} onChange={e => setForm({...form, dietaryPreference: e.target.value})}><option>None</option><option>Vegetarian</option><option>Vegan</option><option>Halal</option></select></div>
                  <div><label className={labelCls}>Breakfast Time</label><input type="time" className={inputCls} value={form.breakfastTime} onChange={e => setForm({...form, breakfastTime: e.target.value})} /></div>
                  <div className="md:col-span-2"><label className={labelCls}>Religious Restrictions</label><input className={inputCls} value={form.religiousRestrictions} onChange={e => setForm({...form, religiousRestrictions: e.target.value})} placeholder="Halal, No beef, pure veg etc." /></div>
                  <div className="md:col-span-2"><label className={labelCls}>Food Refusals (Will not eat)</label><textarea className={`${inputCls} h-24`} value={form.refusedFoods} onChange={e => setForm({...form, refusedFoods: e.target.value})} placeholder="List foods you refuse to eat..." /></div>
                </div>
                <button onClick={() => setStage('goals')} className="w-full py-5 bg-zinc-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl">Final Goals</button>
              </div>
            )}

            {stage === 'goals' && (
              <div className="space-y-8 animate-fade">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelCls}>Primary Goal</label><select className={inputCls} value={form.primaryGoal} onChange={e => setForm({...form, primaryGoal: e.target.value})}><option>Fat Loss</option><option>Muscle Gain</option><option>Strength</option><option>Health</option><option>Combination</option></select></div>
                  <div><label className={labelCls}>Training Days (Target)</label><input type="number" min="1" max="7" className={inputCls} value={form.daysPerWeek} onChange={e => setForm({...form, daysPerWeek: e.target.value})} /></div>
                </div>
                <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100 text-center">
                  <h3 className="text-sm font-black uppercase italic mb-2">Final Confirmation</h3>
                  <p className="text-[10px] text-zinc-500 font-bold leading-relaxed mb-6">I confirm all health, lifestyle, and nutrition data is accurate to the best of my knowledge.</p>
                  <label className="flex items-center gap-4 cursor-pointer p-4 bg-white rounded-2xl border border-zinc-200">
                    <input type="checkbox" checked={form.consent} onChange={e => setForm({...form, consent: e.target.checked})} className="w-6 h-6 accent-zinc-900" />
                    <span className="text-[10px] font-black uppercase">Sign Agreement</span>
                  </label>
                </div>
                <button onClick={handleFinalSubmit} className="w-full py-6 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-emerald-50">Join Programme</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Onboarding: React.FC<{ onComplete: (user: User) => void }> = ({ onComplete }) => (
  <OnboardingErrorBoundary><OnboardingInner onComplete={onComplete} /></OnboardingErrorBoundary>
);
export default Onboarding;
