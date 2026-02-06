import { GoogleGenerativeAI } from "@google/generative-ai";
import { EXERCISE_LIBRARY } from "../constants/workoutLibrary";

/* ------------------------------------------------------------------ */
/* ENV SAFE ACCESS                                                     */
/* ------------------------------------------------------------------ */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * IMPORTANT:
 * Do NOT throw during build.
 * We guard at runtime instead.
 */
const genAI = GEMINI_API_KEY
  ? new GoogleGenerativeAI(GEMINI_API_KEY)
  : null;

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

export interface GeneratedPlan {
  programmeName: string;
  splitType: string;
  stepTarget: number;
  stepExplanation: string;
  nutritionTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  sessions: any[];
  coachAdvice: string;
}

/* ------------------------------------------------------------------ */
/* PLAN GENERATION                                                     */
/* ------------------------------------------------------------------ */

export const generatePlan = async (client: any): Promise<GeneratedPlan | null> => {
  const hasKey = !!GEMINI_API_KEY;

const requireKey = () => {
  if (!hasKey) throw new Error("VITE_GEMINI_API_KEY is missing");
};

  try {
    if (!genAI) return null;

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });


    const { bodyMeasurements, lifestyle, healthSafety } = client;
    const isMale = bodyMeasurements.gender === "Male";

    const validExercises = Object.values(EXERCISE_LIBRARY)
      .filter((ex: any) => (isMale ? ex.allowedForMen : ex.allowedForWomen))
      .map((ex: any) => `${ex.name} (ID: ${ex.id})`)
      .join("\n");

    const prompt = `
You are a UK-based lifestyle coach.

Create a 12-week training programme using plain UK English.
Avoid jargon.

CLIENT:
Gender: ${bodyMeasurements.gender}
Goal: ${lifestyle.primaryGoal}
Baseline steps: ${lifestyle.baselineSteps}
Joint pain: ${healthSafety.hasJointPain ? "Yes" : "No"}

EXERCISES:
${validExercises}

Return JSON only.
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    console.error("Plan generation failed:", err);
    return null;
  }
};

/* ------------------------------------------------------------------ */
/* IMAGE EDIT                                                          */
/* ------------------------------------------------------------------ */

export const editProgressPhoto = async (
  base64Data: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  if (!genAI) {
    console.error("Gemini API key missing at runtime");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { text: `Use UK English only. ${prompt}` },
    ]);

    const parts = result.response.candidates?.[0]?.content?.parts;
    if (!parts) return null;

    for (const part of parts) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (err) {
    console.error("Image edit failed:", err);
    return null;
  }
};
