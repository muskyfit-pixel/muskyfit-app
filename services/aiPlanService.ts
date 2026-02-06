export async function generateTrainingPlan(member: any) {
  const response = await fetch("/api/generate-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  });

  if (!response.ok) {
    throw new Error("AI plan generation failed");
  }

  return response.json();
}
