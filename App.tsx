
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  Dumbbell, 
  Camera, 
  Users,
  Home,
  Loader2,
  Clock,
  UserCircle,
  Menu,
  X,
  Utensils
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import CoachPortal from './pages/CoachPortal';
import Workouts from './pages/Workouts';
import ProgressLab from './pages/ProgressLab';
import Nutrition from './pages/Nutrition';
import Login from './pages/Login';
import { User } from './types';
import { MuskyLogo } from './components/MuskyLogo';
import { storage } from './services/storageService';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
    <MuskyLogo size={64} className="mb-8" />
    <Loader2 className="animate-spin text-zinc-900" size={32} />
    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-4 italic">Preparing your hub...</p>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const init = useCallback(() => {
    try {
      storage.seedInitialData();
      const saved = storage.getAuth();
      if (saved) {
        setUser(saved);
      }
    } catch (e) {
      console.error("Auth init failed", e);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const handleLogin = (u: User) => {
    storage.setAuth(u);
    setUser(u);
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    storage.clearAuth();
    setUser(null);
    window.location.hash = '/login';
  };

  if (loading) return <LoadingScreen />;

  return (
    <HashRouter>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Onboarding onComplete={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <SystemLayout key={refreshKey} user={user} onLogout={handleLogout} onRefresh={() => setRefreshKey(s => s + 1)} />
      )}
    </HashRouter>
  );
};

const SystemLayout: React.FC<{ user: User, onLogout: () => void, onRefresh: () => void }> = ({ user, onLogout, onRefresh }) => {
  const profile = user.role === 'CLIENT' ? storage.getProfileById(user.id) : null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (user.role === 'CLIENT' && (!profile || !profile.intake_completed)) {
    return <Onboarding onComplete={onRefresh} />;
  }

  const isCoach = user.role === 'COACH';

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-12">
        <MuskyLogo size={32} />
        <h2 className="text-xl font-black italic tracking-tighter text-zinc-900 leading-none">
          {isCoach ? 'Coach' : 'Hub'}
        </h2>
      </div>
      
      <nav className="flex-1 space-y-2">
        {isCoach ? (
          <>
            <NavItem to="/coach" icon={<LayoutDashboard size={18}/>} label="Overview" onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/coach/pending" icon={<Clock size={18}/>} label="Applications" onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/coach/roster" icon={<Users size={18}/>} label="Member Roster" onClick={() => setMobileMenuOpen(false)} />
          </>
        ) : (
          <>
            <NavItem to="/" icon={<Home size={18}/>} label="Daily Hub" onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/training" icon={<Dumbbell size={18}/>} label="Training" onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/nutrition" icon={<Utensils size={18}/>} label="Nutrition" onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/photos" icon={<Camera size={18}/>} label="Progress Lab" onClick={() => setMobileMenuOpen(false)} />
          </>
        )}
      </nav>

      <div className="pt-6 border-t border-zinc-100 mt-auto">
        <div className="mb-6 flex items-center gap-3 px-3 py-4 bg-zinc-50 rounded-2xl">
          <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center text-white font-black italic text-[11px]">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black uppercase text-zinc-900 truncate leading-none mb-1">{user.name}</p>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest truncate">{user.role === 'COACH' ? 'Head Coach' : 'Protocol Active'}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 p-3.5 text-zinc-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-100 z-50 flex items-center justify-between px-6">
        <MuskyLogo size={28} />
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-zinc-900"><Menu size={24} /></button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-zinc-950/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-white p-8 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end mb-4">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-zinc-400"><X size={24} /></button>
            </div>
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-zinc-100 p-8 shrink-0 h-full">
        <NavContent />
      </aside>

      {/* Main Content Area - Enforcing top-aligned flex structure */}
      <main className="flex-1 overflow-y-auto relative pt-16 lg:pt-0 bg-white">
        <div className="full-viewport-content">
          <Routes>
            {isCoach ? (
              <>
                <Route path="/coach" element={<CoachPortal view="dashboard" />} />
                <Route path="/coach/pending" element={<CoachPortal view="pending" />} />
                <Route path="/coach/roster" element={<CoachPortal view="roster" />} />
                <Route path="*" element={<Navigate to="/coach" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/training" element={<Workouts />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/photos" element={<ProgressLab />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick?: () => void }) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all font-bold text-[10px] uppercase tracking-widest italic ${active ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'}`}
    >
      {icon}<span>{label}</span>
    </Link>
  );
};

export default App;
