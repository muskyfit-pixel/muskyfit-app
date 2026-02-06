
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, UserCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { storage } from '../services/storageService';
import { User, UserRole } from '../types';
import { MuskyLogo } from '../components/MuskyLogo';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Short timeout for realistic feel
    setTimeout(() => {
      if (role === 'COACH') {
        if (email === "admin@muskyfit.com" && password === "muskyadmin") {
          const coach: User = { id: "coach-1", name: "Head Coach", email, role: "COACH" };
          onLogin(coach);
          navigate('/coach');
        } else {
          setError("Coach sign in failed. Check details.");
        }
      } else {
        const records = storage.getRecords();
        const client = records.find(r => r.email.toLowerCase() === email.toLowerCase());
        if (client && client.password === password) {
          const u: User = { id: client.id, name: client.name, email: client.email, role: 'CLIENT' };
          onLogin(u);
          navigate('/');
        } else {
          setError(client ? "Incorrect password." : "Member profile not found.");
        }
      }
      setLoading(false);
    }, 800);
  };

  const quickFill = (r: UserRole, e: string, p: string) => {
    setRole(r);
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-sm space-y-10 animate-fade">
        <div className="text-center space-y-4">
          <MuskyLogo size={64} className="mx-auto" />
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">Sign in</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Official Muskyfit Entrance</p>
        </div>

        <div className="flex p-1.5 bg-zinc-200 rounded-2xl gap-1.5">
          <button 
            onClick={() => { setRole('CLIENT'); setError(null); }}
            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${role === 'CLIENT' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <UserCircle size={16} /> Member
          </button>
          <button 
            onClick={() => { setRole('COACH'); setError(null); }}
            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${role === 'COACH' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <ShieldCheck size={16} /> Coach
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input required type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-2xl p-5 pl-12 text-zinc-900 font-bold outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-2xl p-5 pl-12 text-zinc-900 font-bold outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm" />
          </div>
          {error && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-5 bg-zinc-900 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-[32px] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-zinc-300">
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign in"}
          </button>
        </form>

        <div className="p-6 bg-white border border-zinc-200 rounded-[32px] space-y-4 shadow-sm">
           <div className="flex items-center gap-2 text-zinc-900 font-black uppercase text-[9px] tracking-widest">
             <Sparkles size={12} className="text-yellow-500" /> Quick demo access
           </div>
           <div className="grid grid-cols-2 gap-3">
              <button onClick={() => quickFill('COACH', 'admin@muskyfit.com', 'muskyadmin')} className="p-3 bg-zinc-50 hover:bg-zinc-900 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-zinc-100 transition-all">Coach mode</button>
              <button onClick={() => quickFill('CLIENT', 'jane@test.com', 'password')} className="p-3 bg-zinc-50 hover:bg-zinc-900 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-zinc-100 transition-all">Member mode</button>
           </div>
        </div>

        {role === 'CLIENT' && (
          <div className="text-center">
            <Link to="/signup" className="text-zinc-400 hover:text-zinc-900 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              New member? <span className="text-zinc-900 underline">Apply now</span> <ArrowRight size={12}/>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
