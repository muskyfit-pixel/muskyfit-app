
import React, { useState } from 'react';
import Button from './Button';
import Logo from './Logo';
import { IntakeData } from '../types';
import { sheetsService } from '../services/sheetsService';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<IntakeData>({
    personal: { name: '', email: '', age: 30, sex: 'Male', height: 175, weight: 80, occupation: '', workHoursType: 'Standard 9-5', hasChildren: false },
    parq: { heartCondition: false, chestPain: false, dizziness: false, boneJointProblem: false, chronicCondition: false, medications: '', doctorCleared: true },
    lifestyle: { activity: 'Mainly Sitting', sleep: 7, stress: 5, alcohol: 'Low', trainingDays: 3, trainingLocation: 'Gym', homeEquipment: '', bodyConcern: '' },
    nutrition: { dietType: 'Non-Vegetarian', consumesEgg: true, religionInfluences: 'None', allergies: '', mealsPerDay: 3, weekendHabits: 'Same as weekdays', currentDietSummary: '' },
    goals: ['Weight Loss'],
    experience: 'New to this'
  });

  const WORK_OPTIONS = ['Standard 9-5', 'Shift Work', 'Night shifts', 'Flexible', 'Full-time Parent'];

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!data.personal.name || !data.personal.email) {
      alert("Please enter your name and email.");
      return;
    }
    await sheetsService.saveIntake(data);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-4xl font-black uppercase text-white tracking-tighter">ABOUT YOU</h2>
            <div className="space-y-6">
              <Input label="FULL NAME" value={data.personal.name} onChange={(v: string) => setData({...data, personal: {...data.personal, name: v}})} />
              <Input label="EMAIL" type="email" value={data.personal.email} onChange={(v: string) => setData({...data, personal: {...data.personal, email: v}})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="AGE" type="number" value={data.personal.age} onChange={(v: string) => setData({...data, personal: {...data.personal, age: parseInt(v)}})} />
                <Select label="SEX" value={data.personal.sex} options={['Male', 'Female']} onChange={(v: any) => setData({...data, personal: {...data.personal, sex: v}})} />
              </div>
            </div>
            <Button fullWidth onClick={next} className="h-20 mt-8 text-lg border-musky-orange bg-musky-orange text-black">CONTINUE</Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-4xl font-black uppercase text-white tracking-tighter">LIFESTYLE</h2>
            <div className="space-y-6">
              <Dropdown label="YOUR WORK SCHEDULE" value={data.personal.workHoursType} options={WORK_OPTIONS} onChange={(v: string) => setData({...data, personal: {...data.personal, workHoursType: v}})} />
              
              <div className="space-y-2">
                <label className="text-[11px] font-black text-musky-orange uppercase tracking-[0.3em] block">WHICH AREA OF YOUR BODY IS A CONCERN?</label>
                <textarea 
                  value={data.lifestyle.bodyConcern} 
                  onChange={e => setData({...data, lifestyle: {...data.lifestyle, bodyConcern: e.target.value}})} 
                  placeholder="e.g. My stomach area, arms, or general fitness..."
                  className="w-full bg-musky-black border-2 border-white/30 px-6 py-5 text-white font-bold text-lg focus:border-musky-orange outline-none rounded-none min-h-[120px]"
                />
              </div>

              <Toggle label="DO YOU HAVE CHILDREN?" value={data.personal.hasChildren} onToggle={(v: boolean) => setData({...data, personal: {...data.personal, hasChildren: v}})} />
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="secondary" onClick={back} className="flex-1">BACK</Button>
              <Button onClick={next} className="flex-[2] h-20 border-musky-orange bg-musky-orange text-black">CONTINUE</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-4xl font-black uppercase text-white tracking-tighter">HEALTH</h2>
            <div className="space-y-4">
              <Toggle label="ANY KNOWN HEART CONDITIONS?" value={data.parq.heartCondition} onToggle={(v: boolean) => setData({...data, parq: {...data.parq, heartCondition: v}})} />
              <Toggle label="ANY JOINT OR BONE ISSUES?" value={data.parq.boneJointProblem} onToggle={(v: boolean) => setData({...data, parq: {...data.parq, boneJointProblem: v}})} />
              <Input label="LIST ANY MEDICATIONS" value={data.parq.medications} onChange={(v: string) => setData({...data, parq: {...data.parq, medications: v}})} placeholder="WRITE 'NONE' IF EMPTY" />
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="secondary" onClick={back} className="flex-1">BACK</Button>
              <Button onClick={next} className="flex-[2] h-20 border-musky-orange bg-musky-orange text-black">CONTINUE</Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-4xl font-black uppercase text-white tracking-tighter">TRAINING</h2>
            <div className="space-y-8">
               <Select label="WHERE WILL YOU TRAIN?" value={data.lifestyle.trainingLocation} options={['Gym', 'Home', 'Both']} onChange={(v: any) => setData({...data, lifestyle: {...data.lifestyle, trainingLocation: v}})} />
               
               {(data.lifestyle.trainingLocation === 'Home' || data.lifestyle.trainingLocation === 'Both') && (
                 <Input 
                   label="WHAT EQUIPMENT DO YOU HAVE?" 
                   value={data.lifestyle.homeEquipment || ''} 
                   placeholder="e.g. Dumbbells, bands, or multi-gym"
                   onChange={(v: string) => setData({...data, lifestyle: {...data.lifestyle, homeEquipment: v}})} 
                 />
               )}

               <div className="space-y-4">
                 <label className="text-[11px] font-black text-musky-orange uppercase tracking-[0.3em] block">DAYS PER WEEK YOU CAN TRAIN</label>
                 <div className="grid grid-cols-4 gap-2">
                    {[1,2,3,4].map(d => (
                      <button key={d} onClick={() => setData({...data, lifestyle: {...data.lifestyle, trainingDays: d}})} className={`py-5 font-black border-2 ${data.lifestyle.trainingDays === d ? 'bg-white border-white text-black' : 'bg-transparent text-white border-white/20'}`}>{d}</button>
                    ))}
                 </div>
               </div>
               <Select label="EXPERIENCE LEVEL" value={data.experience} options={['New to this', 'Some experience', 'Advanced']} onChange={(v: any) => setData({...data, experience: v})} />
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="secondary" onClick={back} className="flex-1">BACK</Button>
              <Button onClick={next} className="flex-[2] h-20 border-musky-orange bg-musky-orange text-black">FINAL STEP</Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-4xl font-black uppercase text-white tracking-tighter">THE GOAL</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Weight Loss', value: 'Weight Loss' },
                { label: 'Build Strength', value: 'Muscle Gain' },
                { label: 'General Health', value: 'Recomposition' }
              ].map(goal => (
                <button
                  key={goal.value}
                  onClick={() => setData({...data, goals: [goal.value]})}
                  className={`p-8 border-2 text-left flex justify-between items-center ${data.goals[0] === goal.value ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20'}`}
                >
                  <span className="font-black uppercase tracking-[0.3em] text-sm">{goal.label}</span>
                  {data.goals[0] === goal.value && <div className="w-4 h-4 bg-black"></div>}
                </button>
              ))}
            </div>
            <div className="flex gap-4 pt-8">
              <Button variant="secondary" onClick={back} className="flex-1">BACK</Button>
              <Button onClick={handleSubmit} className="flex-[2] h-24 text-xl border-musky-orange bg-musky-orange text-black">START PROGRAMME</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-musky-black flex flex-col p-6 max-w-md mx-auto relative z-[150]">
      <header className="py-12 flex flex-col items-center">
        <Logo className="w-24 h-24 mb-10" />
        <div className="flex gap-3 mb-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-[4px] w-8 transition-all ${step >= i ? 'bg-musky-orange' : 'bg-white/20'}`}></div>
          ))}
        </div>
      </header>
      <main className="flex-1 pb-12">
        {renderStep()}
      </main>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-musky-orange uppercase tracking-[0.3em] block">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-musky-black border-2 border-white/30 px-6 py-5 text-white font-bold text-lg focus:border-musky-orange outline-none rounded-none" />
  </div>
);

const Dropdown = ({ label, value, options, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-musky-orange uppercase tracking-[0.3em] block">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-musky-black border-2 border-white/30 px-6 py-5 text-white font-bold text-lg focus:border-musky-orange outline-none rounded-none appearance-none">
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div className="space-y-3">
    <label className="text-[11px] font-black text-musky-orange uppercase tracking-[0.3em] block">{label}</label>
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt: string) => (
        <button key={opt} onClick={() => onChange(opt)} className={`py-5 border-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${value === opt ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20'}`}>{opt}</button>
      ))}
    </div>
  </div>
);

const Toggle = ({ label, value, onToggle }: any) => (
  <div onClick={() => onToggle(!value)} className={`p-6 border-2 flex items-center justify-between cursor-pointer ${value ? 'bg-white text-black border-white' : 'bg-transparent border-white/20 text-white'}`}>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    <div className={`w-8 h-8 border-2 flex items-center justify-center ${value ? 'border-black' : 'border-white/20'}`}>{value && <div className="w-4 h-4 bg-black"></div>}</div>
  </div>
);

export default OnboardingScreen;
