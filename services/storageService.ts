
import { ClientProfile, User, FitnessPlan, Workout } from '../types';

const RECORDS_KEY = 'musky_records_v4';
const AUTH_KEY = 'musky_auth_v4';

const MOCK_PLAN: FitnessPlan = {
  programmeName: "12 Week Physique Reset",
  // Fixed type mismatch
  splitType: "Upper Body",
  // Fixed missing required property and property name mismatch
  stepTarget: 10000,
  stepExplanation: "Consistent movement is key for metabolic health.",
  nutritionTargets: { calories: 2400, protein: 180, carbs: 220, fats: 80 },
  coachAdvice: "Focus on slow eccentrics and high protein intake. Keep steps above 10k daily.",
  sessions: [
    {
      title: "Upper Body A (Power)",
      // Fixed incorrect property name 'warmup' to 'warmupCardio'
      warmupCardio: "10 mins Incline Treadmill Walk + Band Pull-aparts",
      exercises: [
        { exerciseId: "inc_db_press", name: "Incline DB Press", sets: 4, reps: "8-10", rest: "120s", notes: "Focus on upper chest stretch" },
        { exerciseId: "weighted_pullup", name: "Weighted Pull Ups", sets: 4, reps: "6-8", rest: "120s", notes: "Add weight if possible" },
        { exerciseId: "seal_row", name: "Barbell Seal Row", sets: 3, reps: "10-12", rest: "90s", notes: "Squeeze shoulder blades" },
        { exerciseId: "weighted_dip", name: "Weighted Chest Dips", sets: 3, reps: "10-12", rest: "90s", notes: "Lean forward for chest bias" },
        { exerciseId: "lat_raise", name: "Dumbbell Lateral Raises", sets: 3, reps: "12-15", rest: "60s", notes: "Keep tension on side delts" },
        { exerciseId: "cable_lat_raise", name: "Behind-Back Cable Lateral Raise", sets: 3, reps: "15-20", rest: "60s", notes: "Constant tension" }
      ], 
      cooldown: "5 mins Light Stretching"
    },
    {
      title: "Lower Body A (Strength)",
      // Fixed incorrect property name 'warmup' to 'warmupCardio'
      warmupCardio: "5 mins Rower + Dynamic Leg Swings",
      exercises: [
        { exerciseId: "hack_squat", name: "Hack Squat (Quad Bias)", sets: 4, reps: "8-10", rest: "180s", notes: "Maintain depth" },
        { exerciseId: "bb_rdl", name: "Barbell Romanian Deadlift", sets: 4, reps: "10-12", rest: "120s", notes: "Hinge at the hips" },
        { exerciseId: "glute_bridge", name: "Barbell Hip Thrust", sets: 3, reps: "10-12", rest: "120s", notes: "Hold peak contraction" },
        { exerciseId: "leg_press", name: "Leg Press", sets: 3, reps: "12-15", rest: "90s", notes: "Controlled eccentric" },
        { exerciseId: "calf_raise", name: "Standing Calf Raises", sets: 3, reps: "15-20", rest: "60s", notes: "Full range" },
        { exerciseId: "core_comp", name: "Core Compression", sets: 3, reps: "15", rest: "60s", notes: "Breathe through movement" }
      ], 
      cooldown: "5 mins Foam Rolling"
    }
  ]
};

const MOCK_RECORDS: ClientProfile[] = [
  {
    id: "test-active-1",
    name: "Jane Member",
    email: "jane@test.com",
    password: "password",
    status: "Active",
    parq_completed: true,
    intake_completed: true,
    joinedAt: "01/01/2024",
    // Fixed: healthSafety properties updated to match interface in types.ts
    healthSafety: {
      hasHeartCondition: false, hasHighBP: false,
      hasDiabetes: false, usesMedication: false, doctorAdvisedNoExercise: false,
      hasCurrentInjuries: false, hasPastInjuries: false, hasHadSurgery: false,
      isPregnantOrPostnatal: false, hasJointPain: false, clearanceRequired: false,
      medicalDetails: '', injuryDetails: ''
    },
    lifestyle: { 
      age: 28, gender: "Female", heightCm: 165, weightKg: 62,
      primaryGoal: "Health", daysPerWeek: 4, 
      // Fix: Changed 'Moderate' to 'Mixed' to satisfy occupationActivity type constraint
      occupationActivity: 'Mixed', 
      sleepQuality: 'Good', stressLevel: 3,
      mealsPerDay: '3', eatingHabits: 'Home Cooked', dietaryPreference: 'None',
      baselineSteps: 10000, breakfastTime: '08:00', lunchTime: '13:00', dinnerTime: '19:00',
      allergies: '', refusedFoods: '', religiousRestrictions: '', foodDislikes: ''
    },
    plan: MOCK_PLAN,
    workouts: [
      {
        id: "prev-1",
        name: "Upper Body A (Power)",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        type: "Strength",
        duration: 60,
        // Fixed: removed 'calories' as it's not in Workout type
        exercises: [
          { exerciseId: "inc_db_press", name: "Incline DB Press", sets: 4, reps: "10", rest: "120s", notes: "Good set", logs: [{ weight: 22, reps: 10 }, { weight: 22, reps: 10 }, { weight: 20, reps: 10 }, { weight: 20, reps: 8 }] },
          { exerciseId: "weighted_pullup", name: "Weighted Pull Ups", sets: 4, reps: "8", rest: "120s", notes: "", logs: [{ weight: 5, reps: 8 }, { weight: 5, reps: 8 }, { weight: 5, reps: 6 }, { weight: 0, reps: 8 }] }
        ]
      }
    ],
    foodLogs: [
      // Fixed: added missing portion_unit
      { id: "f1", name: "Oatmeal with Berries", calories: 350, protein: 12, carbs: 55, fats: 8, timestamp: new Date().toISOString(), quantity: 1, portion_unit: "1 bowl" }
    ]
  },
  {
    id: "test-pending-1",
    name: "Sam Applicant",
    email: "sam@test.com",
    password: "password",
    status: "Reviewing",
    parq_completed: true,
    intake_completed: true,
    joinedAt: new Date().toLocaleDateString('en-GB'),
    // Fixed: healthSafety properties updated to match interface in types.ts
    healthSafety: {
      hasHeartCondition: false, hasHighBP: true,
      hasDiabetes: false, usesMedication: false, doctorAdvisedNoExercise: false,
      hasCurrentInjuries: false, hasPastInjuries: false, hasHadSurgery: false,
      isPregnantOrPostnatal: false, hasJointPain: true, clearanceRequired: false,
      medicalDetails: '', injuryDetails: ''
    },
    lifestyle: { 
      age: 34, gender: "Male", heightCm: 182, weightKg: 95,
      primaryGoal: "Fat Loss", daysPerWeek: 3, occupationActivity: 'Sedentary',
      sleepQuality: 'Average', stressLevel: 4,
      mealsPerDay: '2', eatingHabits: 'Mixed', dietaryPreference: 'None',
      baselineSteps: 7000, breakfastTime: '08:00', lunchTime: '13:00', dinnerTime: '19:00',
      allergies: '', refusedFoods: '', religiousRestrictions: '', foodDislikes: ''
    },
    workouts: [],
    foodLogs: []
  }
];

export const storage = {
  seedInitialData: () => {
    const records = storage.getRecords();
    if (records.length === 0) {
      storage.saveAllRecords(MOCK_RECORDS);
      console.log("Muskyfit: Seeded initial test data.");
    }
  },

  getRecords: (): ClientProfile[] => {
    try {
      const data = localStorage.getItem(RECORDS_KEY);
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  getProfileByEmail: (email: string): ClientProfile | undefined => {
    const records = storage.getRecords();
    return records.find(r => r.email.toLowerCase() === email.toLowerCase());
  },

  getProfileById: (id: string): ClientProfile | undefined => {
    const records = storage.getRecords();
    return records.find(r => r.id === id);
  },

  saveRecord: (client: ClientProfile) => {
    const records = storage.getRecords();
    const exists = records.findIndex(r => r.id === client.id || r.email.toLowerCase() === client.email.toLowerCase());
    let updated;
    
    if (exists > -1) {
      updated = [...records];
      updated[exists] = { ...records[exists], ...client };
    } else {
      updated = [client, ...records];
    }
    
    localStorage.setItem(RECORDS_KEY, JSON.stringify(updated));
    return updated;
  },

  saveAllRecords: (records: ClientProfile[]) => {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  },

  getAuth: (): User | null => {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setAuth: (user: User | null) => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  clearAuth: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};
