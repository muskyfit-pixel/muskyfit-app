import React, { useState, useEffect } from 'react';
import DashboardScreen from './components/DashboardScreen';
import NutritionScreen from './components/NutritionScreen';
import TrainingScreen from './components/TrainingScreen';
import CoachAI from './components/CoachAI';
import CoachDashboard from './components/CoachDashboard';
import OnboardingScreen from './components/OnboardingScreen';
import Logo from './components/Logo';
import { sheetsService } from './services/sheetsService';
import { FoodItem, WorkoutData, FoodLog, WorkoutLogged, Client, ComplianceStats } from './types';

type MainTab = 'dashboard' | 'nutrition' | 'training' | 'coach' | 'admin';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<Client | null>(null);
  const [complianceStats, setComplianceStats] = useState<ComplianceStats | null>(null);
  
  const [steps, setSteps] = useState<number>(0);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [workoutResults, setWorkoutResults] = useState<WorkoutLogged[]>([]);
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(false);
  
  const [foodDb, setFoodDb] = useState<FoodItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Parallel load of essential data
        const [f, profile] = await Promise.all([
          sheetsService.getFoodDb(),
          sheetsService.getProfile()
        ]);
        
        setFoodDb(f);
        
        if (profile) {
          setCurrentUser(profile);
          setNeedsOnboarding(false);
          const stats = await sheetsService.getCompliance(profile.id);
          setComplianceStats(stats);
        } else {
          setNeedsOnboarding(true);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setNeedsOnboarding(true);
      } finally {
        // Artificial delay for branding splash and ensuring state consistency
        setTimeout(() => setIsInitializing(false), 2000);
      }
    };
    load();
  }, []);

  const handleOnboardingComplete = async () => {
    setIsInitializing(true);
    const profile = await sheetsService.getProfile();
    if (profile) {
      setCurrentUser(profile);
      setNeedsOnboarding(false);
      const stats = await sheetsService.getCompliance(profile.id);
      setComplianceStats(stats);
    }
    setTimeout(() => setIsInitializing(false), 1000);
  };

  // This renders the Splash Screen while initializing
  if (isInitializing || needsOnboarding === null) {
    return (
      <div className="fixed inset-0 bg-musky-black z-[200] flex flex-col items-center justify-center p-6 overflow-hidden">
        <Logo className="w-48 h-48 mb-16 scale-110" />
        <div className="text-center space-y-6">
          <h1 className="text-white text-3xl font-black tracking-[0.4em] uppercase">MUSKYFIT</h1>
          <div className="h-[2px] w-12 bg-musky-orange mx-auto opacity-50"></div>
          <p className="text-musky-orange text-[10px] font-black tracking-[0.6em] uppercase animate-pulse">SYSTEM INITIALIZING</p>
        </div>
        {/* CRT Scanline Overlay Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[201] bg-[length:100%_2px,3px_100%]"></div>
      </div>
    );
  }

  // Handle Onboarding Flow
  if (needsOnboarding === true) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen 
          client={currentUser} 
          steps={steps} 
          setSteps={setSteps} 
          foodLogs={foodLogs} 
          workoutCompleted={workoutCompleted} 
          setWorkoutCompleted={setWorkoutCompleted} 
          foodDb={foodDb} 
        />;
      case 'nutrition':
        return <NutritionScreen 
          foodDb={foodDb} 
          logs={foodLogs} 
          setLogs={setFoodLogs} 
          client={currentUser} 
        />;
      case 'training':
        return <TrainingScreen 
          client={currentUser} 
          results={workoutResults} 
          setResults={setWorkoutResults} 
          workoutCompleted={workoutCompleted} 
          setWorkoutCompleted={setWorkoutCompleted} 
        />;
      case 'coach':
        return <CoachAI 
          client={currentUser} 
          stats={complianceStats} 
        />;
      case 'admin':
        return <CoachDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-musky-black flex flex-col">
      <main className="flex-1 w-full max-w-md mx-auto pb-32">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-musky-black border-t-2 border-white/10 z-[100] h-24">
        <div className="max-w-md mx-auto grid grid-cols-5 h-full">
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="CORE" />
          <TabButton active={activeTab === 'nutrition'} onClick={() => setActiveTab('nutrition')} label="FOOD" />
          <TabButton active={activeTab === 'training'} onClick={() => setActiveTab('training')} label="IRON" />
          <TabButton active={activeTab === 'coach'} onClick={() => setActiveTab('coach')} label="COACH" />
          <TabButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} label="CMD" />
        </div>
      </nav>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 transition-all ${active ? 'text-musky-orange' : 'text-white/30'}`}
  >
    <div className={`h-[2px] w-4 transition-all ${active ? 'bg-musky-orange' : 'bg-transparent'}`}></div>
    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default App;