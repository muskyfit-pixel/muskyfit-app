
export type UserRole = 'COACH' | 'CLIENT';
export type ClientStatus = 'New' | 'Reviewing' | 'Active';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
  portion_unit: string;
  quantity: number;
}

export interface SetLog {
  weight: number;
  reps: number;
}

export interface Exercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
  logs?: SetLog[];
  substituteId?: string;
}

export interface WorkoutSession {
  title: string;
  warmupCardio: string; // Mandatory 10 min
  exercises: Exercise[];
  cooldown: string;
}

export interface FitnessPlan {
  programmeName: string;
  splitType: 'Upper Body' | 'Lower Body' | 'Full Body';
  nutritionTargets: NutritionTargets;
  sessions: WorkoutSession[];
  coachAdvice: string;
  stepTarget: number;
  stepExplanation: string;
}

export interface Workout {
  id: string;
  name: string;
  type: 'Strength' | 'Cardio';
  duration: number;
  date: string;
  exercises: Exercise[];
}

// types.ts (future tidy-up)
export interface HealthSafetyCheck {
  hasHeartCondition: boolean;
  hasHighBP: boolean;
  hasDiabetes: boolean;
  hasCurrentInjuries: boolean;
  hasPastInjuries: boolean;
  usesMedication: boolean;
  isPregnantOrPostnatal: boolean;
  doctorAdvisedNoExercise: boolean;
  clearanceRequired: boolean;
  medicalDetails?: string;
  injuryDetails?: string;
}

export interface Lifestyle {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  heightCm: number;
  weightKg: number;
  occupationActivity: 'Sedentary' | 'Mixed' | 'Active';
  sleepQuality: 'Poor' | 'Average' | 'Good';
  stressLevel: number; // 1-5
  // Nutrition
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  mealsPerDay: '2' | '3' | '4' | '5';
  eatingHabits: 'Home Cooked' | 'Takeaway' | 'Mixed';
  dietaryPreference: 'None' | 'Vegetarian' | 'Vegan' | 'Halal';
  religiousRestrictions: string;
  foodDislikes: string;
  allergies: string;
  refusedFoods: string;
  // Goals
  primaryGoal: 'Fat Loss' | 'Muscle Gain' | 'Strength' | 'Health' | 'Combination';
  daysPerWeek: number;
  // Fix: Added missing baselineSteps property used in services and mock data
  baselineSteps: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  status: ClientStatus;
  parq_completed: boolean;
  intake_completed: boolean;
  healthSafety: HealthSafetyCheck;
  lifestyle: Lifestyle;
  plan?: FitnessPlan;
  draftPlan?: FitnessPlan;
  foodLogs: FoodLog[];
  workouts: Workout[];
  joinedAt: string;
}
