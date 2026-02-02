import React, { useState } from 'react';
import FoodLogger from './FoodLogger';
import { FoodItem, FoodLog, Client } from '../types';
import { GoogleGenAI } from "@google/genai";

interface NutritionScreenProps {
  foodDb: FoodItem[];
  logs: FoodLog[];
  setLogs: (l: FoodLog[]) => void;
  client: Client;
}

const NutritionScreen: React.FC<NutritionScreenProps> = ({ foodDb, logs, setLogs, client }) => {
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [blueprint, setBlueprint] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateBlueprint = async () => {
    setLoading(true);
    setShowBlueprint(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        As the MuskyFit Head Coach, create a minimal, high-performance meal blueprint.
        CLIENT TARGETS: ${client.targetCalories}kcal, ${client.targetProtein}g Protein.
        Focus on: ${client.bodyConcern || 'General Performance'}.
        Include 3 meals and 1 snack. Use a mix of Indian and Western foods. 
        Keep it matte-black, minimal, and elite in tone.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setBlueprint(response.text || "Blueprint extraction failed.");
    } catch (e) {
      setBlueprint("Intelligence offline. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 p-2 animate-in slide-in-from-bottom-4 duration-700 pb-32">
      <header className="mt-8 flex justify-between items-end">
        <div>
          <h2 className="text-7xl font-black text-white uppercase tracking-tighter leading-none">FUEL</h2>
          <p className="text-sm text-musky-orange font-black uppercase tracking-[0.5em] mt-6">NOURISHMENT SYNC</p>
        </div>
        <button 
          onClick={generateBlueprint}
          className="mb-2 bg-white/5 border border-musky-orange px-6 py-3 text-[10px] font-black text-musky-orange uppercase tracking-widest active:bg-musky-orange active:text-black transition-colors"
        >
          GET AI BLUEPRINT
        </button>
      </header>
      
      {showBlueprint && (
        <div className="bg-musky-orange/5 border-2 border-musky-orange p-8 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center border-b border-musky-orange/20 pb-4">
            <h4 className="text-[11px] font-black text-musky-orange uppercase tracking-[0.4em]">STRATEGIC BLUEPRINT</h4>
            <button onClick={() => setShowBlueprint(false)} className="text-white/30 text-[9px] font-black uppercase hover:text-white transition-colors">DISMISS</button>
          </div>
          {loading ? (
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-musky-orange animate-pulse"></div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">CALCULATING FUEL MATRIX...</p>
            </div>
          ) : (
            <div className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-medium">
              {blueprint}
            </div>
          )}
        </div>
      )}

      <div className="border-t-2 border-white/10 pt-12">
        <FoodLogger 
          foodDb={foodDb} 
          logs={logs} 
          setLogs={setLogs} 
        />
      </div>
    </div>
  );
};

export default NutritionScreen;