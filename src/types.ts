// src/types.ts

export type ActivityLevel = "Low" | "Moderate" | "Active";

export interface HealthSafety {
  hasHeartCondition: boolean;
  hasHighBP: boolean;
  hasDiabetes: boolean;
  usesMedication: boolean;
  doctorAdvisedNoExercise: boolean;
  hasCurrentInjuries: boolean;
  hasPastInjuries: boolean;
  hasHadSurgery: boolean;
  isPregnantOrPostnatal: boolean;
  hasJointPain: boolean;
  clearanceRequired: boolean;
  medicalDetails: string;
  injuryDetails: string;
}

export interface Lifestyle {
  age: number;
  gender: "Male" | "Female";
  heightCm: number;
  weightKg: number;
  primaryGoal: string;
  daysPerWeek: number;
  occupationActivity: ActivityLevel;
  sleepQuality: string;
  stressLevel: number;
  mealsPerDay: string;
  eatingHabits: string;
  dietaryPreference: string;
  baselineSteps: number;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  allergies: string;
  refusedFoods: string;
  religiousRestrictions: string;
  foodDislikes: string;
}

export interface ExerciseLog {
  weight: number;
  reps: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  logs?: ExerciseLog[];
}

export interface WorkoutSession {
  id?: string;
  name: string;
  date: string;
  type: string;
  duration: number;
  exercises: WorkoutExercise[];
}

export interface TrainingSession {
  title: string;
  warmupCardio: string;
  exercises: WorkoutExercise[];
  cooldown: string;
}

export interface FitnessPlan {
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
  coachAdvice: string;
  sessions: TrainingSession[];
}

export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: number;
  portion_unit: string;
  timestamp: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  status: "Active" | "Reviewing";
  parq_completed: boolean;
  intake_completed: boolean;
  joinedAt: string;
  healthSafety: HealthSafety;
  lifestyle: Lifestyle;
  plan?: FitnessPlan;
  workouts: WorkoutSession[];
  foodLogs: FoodLog[];
}

export interface User {
  id: string;
  email: string;
  role: "coach" | "client";
}
