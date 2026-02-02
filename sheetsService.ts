
import { FoodItem, WorkoutData, Client, DailyLog, ComplianceStats, IntakeData, ExerciseTarget } from '../types';
import { MOCK_FOOD_DB, MOCK_CLIENTS, MOCK_WORKOUT_DB } from '../constants';

const STORAGE_KEYS = {
  MY_DAY_HISTORY: 'muskyfit_my_day_history',
  FOOD_DB: 'muskyfit_food_db',
  LISTS: 'muskyfit_lists',
  INTAKE: 'muskyfit_parq_intake',
  PROFILE: 'muskyfit_client_profile'
};

/**
 * PRODUCTION NOTE: 
 * For a live Google Sheets backend, you would replace these localStorage calls 
 * with fetch() requests to a Google Apps Script Web App URL.
 */
class SheetsService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.FOOD_DB)) {
      localStorage.setItem(STORAGE_KEYS.FOOD_DB, JSON.stringify(MOCK_FOOD_DB));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LISTS)) {
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(MOCK_CLIENTS));
    }
  }

  async saveIntake(data: IntakeData): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.INTAKE, JSON.stringify(data));

    const weight = data.personal.weight;
    const goal = data.goals[0] as 'Weight Loss' | 'Muscle Gain' | 'Recomposition';
    const sex = data.personal.sex;
    
    let activityMultiplier = 1.1;
    if (data.lifestyle.activity === 'Active') activityMultiplier = 1.25;
    if (data.lifestyle.activity === 'Very Active') activityMultiplier = 1.4;

    let bmr = (10 * weight) + (6.25 * data.personal.height) - (5 * data.personal.age);
    bmr = sex === 'Male' ? bmr + 5 : bmr - 161;
    let tdee = bmr * activityMultiplier;
    
    let calories = goal === 'Weight Loss' ? tdee * 0.88 : goal === 'Muscle Gain' ? tdee * 1.05 : tdee;

    let protein = weight * 1.8; 
    let fats = weight * 1.1;
    const carbs = (calories - (protein * 4) - (fats * 9)) / 4;

    const client: Client = {
      id: data.personal.email,
      name: data.personal.name,
      email: data.personal.email,
      age: data.personal.age,
      onboarded: true,
      targetCalories: Math.round(calories),
      targetProtein: Math.round(protein),
      targetCarbs: Math.round(carbs),
      targetFats: Math.round(fats),
      goal,
      experience: data.experience,
      trainingDays: data.lifestyle.trainingDays,
      sex: sex,
      trainingLocation: data.lifestyle.trainingLocation,
      homeEquipment: data.lifestyle.homeEquipment,
      bodyConcern: data.lifestyle.bodyConcern,
      hasInjuries: data.parq.boneJointProblem || data.parq.heartCondition,
      workHoursType: data.personal.workHoursType,
      hasChildren: data.personal.hasChildren
    };

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(client));
  }

  async getNextWorkout(client: Client): Promise<WorkoutData> {
    const history = await this.getClientHistory(client.id);
    const lastWorkout = history.find(h => h.workoutCompleted && h.workoutId);
    
    const rotation = ['UPPER_A', 'LOWER_A', 'UPPER_B', 'LOWER_B'];
    let nextIndex = 0;

    if (lastWorkout) {
      const lastIdx = rotation.indexOf(lastWorkout.workoutId);
      nextIndex = (lastIdx + 1) % rotation.length;
    }

    const nextId = rotation[nextIndex];
    return this.generateWorkoutProtocol(nextId, client);
  }

  private generateWorkoutProtocol(id: string, client: Client): WorkoutData {
    const isMale = client.sex === 'Male';
    const isOlder = client.age >= 50;
    const hasInjury = client.hasInjuries;
    const isHome = client.trainingLocation === 'Home' || client.trainingLocation === 'Both';
    const eq = (client.homeEquipment || '').toLowerCase();
    const hasEliteMulti = eq.includes('multi') || eq.includes('belt') || eq.includes('thrust') || eq.includes('machine');
    
    let exercises: ExerciseTarget[] = [];

    if (id.startsWith('UPPER')) {
      if (isHome && hasEliteMulti) {
        exercises.push({ name: 'Machine Incline Chest Press', sets: 3, reps: '10-12', rpe: 8, notes: 'Target Upper Shelf' });
        exercises.push({ name: 'Cable Chest Fly', sets: 3, reps: '12-15', rpe: 9 });
      } else if (isMale) {
        exercises.push({ name: 'Incline DB Bench Press', sets: 3, reps: '8-10', rpe: 8, notes: 'Target Upper Shelf' });
        exercises.push({ name: 'Decline Cable Flyes', sets: 3, reps: '12-15', rpe: 9 });
      } else {
        exercises.push({ name: 'Incline DB Press', sets: 3, reps: '12-15', rpe: 7 });
      }

      exercises.push({ name: 'Lat Pulldown (Neutral Grip)', sets: 3, reps: '10-12', rpe: 8 });
      exercises.push({ name: 'Chest Supported Row (Pulley)', sets: 3, reps: '10-12', rpe: 8 });
      exercises.push({ name: 'DB Lateral Raises', sets: 4, reps: '15-20', rpe: 9, notes: 'Taper width focus' });

      if (client.bodyConcern.toLowerCase().includes('arm')) {
        exercises.push({ name: 'Tricep Pulldowns (Pulley)', sets: 3, reps: '12-15', rpe: 9 });
        exercises.push({ name: 'DB Incline Curls', sets: 3, reps: '10-12', rpe: 8 });
      }
    } else {
      if (isHome && hasEliteMulti) {
        exercises.push({ name: 'Belt Squat', sets: 3, reps: '10-12', rpe: 8, notes: 'Safe, spine-neutral loading' });
        exercises.push({ name: 'Lying Leg Curl', sets: 3, reps: '12-15', rpe: 9, notes: 'Maximum hamstring peak' });
        exercises.push({ name: 'Leg Extension', sets: 3, reps: '12-15', rpe: 9 });
        if (!isMale || client.bodyConcern.toLowerCase().includes('leg') || client.bodyConcern.toLowerCase().includes('glute')) {
          exercises.push({ name: 'Machine Hip Thrust', sets: 3, reps: '12-15', rpe: 9, notes: 'Elite glute isolation' });
        }
      } else {
        if (isOlder || hasInjury) {
          exercises.push({ name: 'Goblet Box Squats', sets: 3, reps: '12-15', rpe: 7 });
        } else {
          exercises.push({ name: 'Barbell Back Squat', sets: 3, reps: '6-8', rpe: 8 });
        }
        
        if (!isMale) {
          exercises.push({ name: 'DB Romanian Deadlift', sets: 3, reps: '12-15', rpe: 8 });
          exercises.push({ name: 'Glute Bridges', sets: 3, reps: '15-20', rpe: 9 });
        } else {
          exercises.push({ name: 'DB Stiff Leg Deadlift', sets: 3, reps: '8-10', rpe: 8 });
        }
      }

      if (client.bodyConcern.toLowerCase().includes('stomach') || client.bodyConcern.toLowerCase().includes('belly')) {
        exercises.push({ name: 'Cable Crunches', sets: 3, reps: '15-20', rpe: 8 });
        exercises.push({ name: 'Deadbugs', sets: 3, reps: '10 per side', rpe: 7 });
      }
    }

    return {
      id,
      type: id.includes('UPPER') ? 'Upper Body' : 'Lower Body',
      label: `${isHome && hasEliteMulti ? 'ELITE GARAGE' : isHome ? 'HOME' : 'GYM'} - ${id.replace('_', ' ')}`,
      exercises
    };
  }

  async getProfile(): Promise<Client | null> {
    const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return profile ? JSON.parse(profile) : null;
  }

  async getFoodDb(): Promise<FoodItem[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FOOD_DB) || '[]');
  }

  async getWorkoutDb(): Promise<WorkoutData[]> {
    return MOCK_WORKOUT_DB;
  }

  async saveDailyLog(log: DailyLog): Promise<void> {
    const history: DailyLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_DAY_HISTORY) || '[]');
    localStorage.setItem(STORAGE_KEYS.MY_DAY_HISTORY, JSON.stringify([...history, log]));
  }

  async getClientHistory(clientId: string): Promise<DailyLog[]> {
    const history: DailyLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_DAY_HISTORY) || '[]');
    return history.filter(log => log.clientId === clientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getCompliance(clientId: string): Promise<ComplianceStats> {
    const history = await this.getClientHistory(clientId);
    const last7DaysLogs = history.filter(log => {
      const logDate = new Date(log.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return logDate >= sevenDaysAgo;
    });

    return {
      compliancePercent: (last7DaysLogs.length / 7) * 100,
      avgCalories: last7DaysLogs.length > 0 ? Math.round(last7DaysLogs.reduce((acc, curr) => acc + curr.totals.calories, 0) / last7DaysLogs.length) : 0,
      avgSteps: last7DaysLogs.length > 0 ? Math.round(last7DaysLogs.reduce((acc, curr) => acc + curr.steps, 0) / last7DaysLogs.length) : 0,
      history: last7DaysLogs
    };
  }
}

export const sheetsService = new SheetsService();
