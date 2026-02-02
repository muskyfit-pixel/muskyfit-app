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
        Create a simple, realistic "Meal Example Plan" for a client in the UK. 
        Targets:
        - Daily Energy: ${client.targetCalories} kcal
        - Build Fuel: ${client.targetProtein}g
        - Vitality Fuel: ${client.targetFats}g
        
        RULES:
        1. Use UK English (e.g., Yoghurt, Savoury, Grill, Programme).
        2. ABSOLUTELY NO FITNESS JARGON. Use terms like "Filling meals", "Energy levels", "Body fuel".
        3. Provide a mix of Indian and Western options.
        4. Structure: 3 Main Meals and 1 Simple Snack.
        5. Include one "Quick Cooking Tip" for someone with a busy lifestyle.
        6. Keep the tone premium, minimal, and supportive.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setBlueprint(response.text || "Problem connecting to the reference system.");
    } catch (e) {
      setBlueprint("System offline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="px-2 mt-4 flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">FUEL</h2>
          <p className="text-sm text-musky-orange font-black uppercase tracking-[0.4em] mt-4">DAILY NOURISHMENT</p>
        </div>
        <button 
          onClick={generateBlueprint}
          className="bg-white/5 border border-musky-orange px-4 py-2 text-[10px] font-black text-musky-orange uppercase tracking-widest"
        >
          GET EXAMPLE PLAN
        </button>
      </div>
      
      {showBlueprint && (
        <div className="px-2">
          <div className="bg-musky-orange/5 border-2 border-musky-orange p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-musky-orange/20 pb-4">
              <h4 className="text-xs font-black text-musky-orange uppercase tracking-widest">EXAMPLE MEALS</h4>
              <button onClick={() => setShowBlueprint(false)} className="text-white/40 text-[10px] font-black uppercase">CLOSE</button>
            </div>
            {loading ? (
              <p className="text-[10px] font-black animate-pulse text-white/40 uppercase tracking-widest">CREATING PLAN...</p>
            ) : (
              <div className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-medium">
                {blueprint}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-2 border-t-2 border-white/30 pt-10">
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