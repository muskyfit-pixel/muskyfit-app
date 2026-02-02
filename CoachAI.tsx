
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Button from './Button';
import Card from './Card';
import { Client, ComplianceStats } from '../types';
import Logo from './Logo';
import { sheetsService } from '../services/sheetsService';

interface CoachAIProps {
  client: Client;
  stats: ComplianceStats | null;
}

const CoachAI: React.FC<CoachAIProps> = ({ client }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [localStats, setLocalStats] = useState<ComplianceStats | null>(null);

  useEffect(() => {
    const load = async () => {
      const s = await sheetsService.getCompliance(client.id);
      setLocalStats(s);
    };
    load();
  }, [client.id]);

  const generateFeedback = async () => {
    if (!localStats || localStats.history.length === 0) {
      setFeedback("I need a few days of data to provide a strategic review. Keep logging your food and movement, and I'll be able to help you soon.");
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are the Head Coach at MuskyFit. Review this client's lifestyle data and provide a supportive, clear coaching summary.
        
        CLIENT PROFILE:
        - Name: ${client.name}
        - Goal: ${client.goal}
        - Main Body Concern: ${client.bodyConcern}
        - Target Energy (kcal): ${client.targetCalories}
        
        LAST 7 DAYS DATA:
        - Adherence Score: ${Math.round(localStats.compliancePercent)}%
        - Average Movement: ${localStats.avgSteps} steps
        - Average Energy Intake: ${localStats.avgCalories} kcal
        - Session Compliance: ${localStats.history.filter(h => h.workoutCompleted).length} done
        
        RULES:
        1. Use UK English (e.g., Programme, Yoghurt, Savoury, Centre).
        2. NO FITNESS JARGON. Use "Energy" for calories and "Movement" for steps.
        3. Tone: Matte-black, minimal, high-performance but realistic.
        4. Focus on their body concern: ${client.bodyConcern}.
        5. Structure: Status Update, Intake Review, and 2 Simple Next Steps.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setFeedback(response.text || "Unable to generate review at this time.");
    } catch (error) {
      setFeedback("Connection error with Coaching Intelligence. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-musky-black rounded-none p-8 border-2 border-white/10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-5 rotate-12 pointer-events-none">
          <Logo className="w-40 h-40" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">COACH REVIEW</h2>
          <p className="text-[10px] text-musky-orange font-black uppercase tracking-[0.25em]">Personalised insight into your progress</p>
          
          <div className="mt-8">
            {loading ? (
              <div className="py-12 flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-musky-orange/20 border-t-musky-orange rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">GATHERING INTELLIGENCE...</p>
              </div>
            ) : feedback ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="bg-white/5 rounded-none p-6 border border-white/10 whitespace-pre-wrap font-medium text-white/80 leading-relaxed text-xs">
                  {feedback}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setFeedback('')} 
                  className="mt-6 text-[10px] uppercase font-black tracking-widest opacity-40 hover:opacity-100"
                >
                  REFRESH REVIEW
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xs text-white/40 mb-10 max-w-[240px] mx-auto leading-relaxed">Request your weekly strategic review based on your fuel and movement history.</p>
                <Button 
                  onClick={generateFeedback} 
                  className="shadow-[0_0_40px_rgba(228,81,46,0.1)] h-20 px-10 border-musky-orange bg-musky-orange text-black font-black uppercase tracking-widest"
                >
                  GET COACH REVIEW
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {localStats && (
        <Card title="WEEKLY SUMMARY" subtitle="Recorded performance over the last 7 days.">
          <div className="space-y-4">
             <MetricRow label="ADHERENCE" value={`${Math.round(localStats.compliancePercent)}%`} />
             <MetricRow label="AVG ENERGY" value={`${localStats.avgCalories} KCAL`} />
             <MetricRow label="AVG MOVEMENT" value={`${localStats.avgSteps} STEPS`} />
          </div>
        </Card>
      )}
    </div>
  );
};

const MetricRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
    <span className="text-[10px] font-black text-musky-orange uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-white">{value}</span>
  </div>
);

export default CoachAI;
