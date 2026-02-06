// src/services/storageService.ts

import type { ClientProfile, FitnessPlan, User } from "../types";
import { normaliseActivityLevel } from "./normalise";

const RECORDS_KEY = "musky_records_v4";
const AUTH_KEY = "musky_auth_v4";

const MOCK_PLAN: FitnessPlan = {
  programmeName: "12 Week Physique Reset",
  splitType: "Upper / Lower",
  stepTarget: 10000,
  stepExplanation: "Daily movement supports fat loss and recovery.",
  nutritionTargets: {
    calories: 2400,
    protein: 180,
    carbs: 220,
    fats: 80,
  },
  coachAdvice: "Train consistently, hit protein, keep steps high.",
  sessions: [],
};

const MOCK_RECORDS: ClientProfile[] = [
  {
    id: "client-001",
    name: "Jane Member",
    email: "jane@test.com",
    password: "password",
    status: "Active",
    parq_completed: true,
    intake_completed: true,
    joinedAt: "01/01/2024",
    healthSafety: {
      hasHeartCondition: false,
      hasHighBP: false,
      hasDiabetes: false,
      usesMedication: false,
      doctorAdvisedNoExercise: false,
      hasCurrentInjuries: false,
      hasPastInjuries: false,
      hasHadSurgery: false,
      isPregnantOrPostnatal: false,
      hasJointPain: false,
      clearanceRequired: false,
      medicalDetails: "",
      injuryDetails: "",
    },
    lifestyle: {
      age: 28,
      gender: "Female",
      heightCm: 165,
      weightKg: 62,
      primaryGoal: "Health",
      daysPerWeek: 4,
      occupationActivity: normaliseActivityLevel("Mixed"),
      sleepQuality: "Good",
      stressLevel: 3,
      mealsPerDay: "3",
      eatingHabits: "Home Cooked",
      dietaryPreference: "None",
      baselineSteps: 10000,
      breakfastTime: "08:00",
      lunchTime: "13:00",
      dinnerTime: "19:00",
      allergies: "",
      refusedFoods: "",
      religiousRestrictions: "",
      foodDislikes: "",
    },
    plan: MOCK_PLAN,
    workouts: [],
    foodLogs: [],
  },
];

export const storage = {
  seedInitialData() {
    if (this.getRecords().length === 0) {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(MOCK_RECORDS));
    }
  },

  getRecords(): ClientProfile[] {
    try {
      const raw = localStorage.getItem(RECORDS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveAllRecords(records: ClientProfile[]) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  },

  getProfileByEmail(email: string) {
    return this.getRecords().find(
      r => r.email.toLowerCase() === email.toLowerCase()
    );
  },

  getProfileById(id: string) {
    return this.getRecords().find(r => r.id === id);
  },

  saveRecord(profile: ClientProfile) {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === profile.id);

    if (index >= 0) {
      records[index] = profile;
    } else {
      records.push(profile);
    }

    this.saveAllRecords(records);
  },

  getAuth(): User | null {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setAuth(user: User | null) {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  clearAuth() {
    localStorage.removeItem(AUTH_KEY);
  },
};
