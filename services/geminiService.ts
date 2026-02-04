
import { GoogleGenAI, Type } from "@google/genai";
import { EXERCISE_LIBRARY } from "../constants/workoutLibrary";

/**
 * Generates a high-density, high-volume DRAFT plan.
 * Strictly adheres to 60-minute time blocks (10 min cardio warm-up, 50 min resistance).
 */
export const generatePlan = async (client: any): Promise<any> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const { bodyMeasurements, lifestyle, healthSafety } = client;
    const isMale = bodyMeasurements.gender === 'Male';

    const validExercises = Object.values(EXERCISE_LIBRARY)
      .filter(ex => isMale ? ex.allowedForMen : ex.allowedForWomen)
      .map(ex => `${ex.name} (ID: ${ex.id}, Pattern: ${ex.pattern})`)
      .join("\n");

    const prompt = `You are a world-class Lifestyle Coach based in the UK.
      
      TASK: Create a 12-week Training Plan using UK English ONLY. Use plain language for everyday clients (21-65 years old).
      
      STRICT LANGUAGE RULES:
      - Use "Main exercise" or "Support exercise" instead of Tiers or Jargon.
      - Use UK spellings: programme, personalised, centre, colour, organise, behaviour.
      - Do NOT use technical jargon like "hypertrophy", "volume", or "stimulus".
      
      CLIENT DATA:
      - Gender: ${bodyMeasurements.gender}
      - Goal: ${lifestyle.goal}
      - Activity Level: ${lifestyle.occupationActivity}
      - Daily Baseline Steps: ${lifestyle.baselineSteps}
      - Joint Issues: ${healthSafety.hasJointProblems ? 'Yes' : 'No'}

      SESSION STRUCTURE (60-MINUTE TOTAL):
      1. WARM-UP CARDIO (10 MINS): Treadmill, bike, or rower. Be specific.
      2. MAIN EXERCISES: 2 exercises. 4 sets EACH. 120s rest.
      3. SUPPORT EXERCISES: 2-3 exercises. 3 sets EACH. 90s rest.
      4. FINISHING EXERCISES: 1-2 exercises. 2-3 sets EACH. 60s rest.

      STEP TARGET LOGIC (UK LIFESTYLE):
      - Low activity: 5,000–7,000
      - Moderate activity: 7,000–9,000
      - Active: 9,000–11,000
      Explain the target clearly in 'stepExplanation' using UK English.

      EXERCISE POOL (USE THESE IDS ONLY):
      ${validExercises}

      RESPONSE FORMAT: JSON ONLY. Use KG/KM. Ensure 'exerciseId' is included for every exercise.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [{ text: prompt }] },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            programmeName: { type: Type.STRING },
            splitType: { type: Type.STRING },
            stepTarget: { type: Type.NUMBER },
            stepExplanation: { type: Type.STRING },
            nutritionTargets: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER }, 
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER }, 
                fats: { type: Type.NUMBER }
              },
              required: ["calories", "protein", "carbs", "fats"]
            },
            sessions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  warmupCardio: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        exerciseId: { type: Type.STRING },
                        name: { type: Type.STRING },
                        sets: { type: Type.NUMBER },
                        reps: { type: Type.STRING },
                        rest: { type: Type.STRING },
                        notes: { type: Type.STRING }
                      },
                      required: ["exerciseId", "name", "sets", "reps", "rest", "notes"]
                    }
                  },
                  cooldown: { type: Type.STRING }
                },
                required: ["title", "warmupCardio", "exercises", "cooldown"]
              }
            },
            coachAdvice: { type: Type.STRING }
          },
          required: ["programmeName", "splitType", "nutritionTargets", "sessions", "coachAdvice", "stepTarget", "stepExplanation"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("AI Plan Generation Failure:", e);
    return null;
  }
};

export const editProgressPhoto = async (base64Data: string, mimeType: string, prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `UK English Rule: Use plain language and UK spellings. Prompt: ${prompt}`,
          },
        ],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (e) {
    console.error("AI Photo Edit Failure:", e);
    return null;
  }
};
