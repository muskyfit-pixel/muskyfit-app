import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const member = req.body;

  const prompt = `
You are an elite strength and lifestyle coach.

Create a ${member.daysPerWeek}-day gym training plan for:
- Name: ${member.name}
- Goal: ${member.goal}
- Age: ${member.age}
- Sex: ${member.sex}
- Weight: ${member.weightKg}kg

Include:
- Weekly split
- Exercises
- Sets & reps
- Clear formatting
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  res.status(200).json({
    plan: completion.choices[0].message.content,
  });
}
