
export interface LibraryExercise {
  id: string;
  name: string;
  pattern: 'Push' | 'Pull' | 'Hinge' | 'Squat' | 'Lunge' | 'Isolation' | 'Cardio';
  equipment: 'Barbell' | 'Dumbbell' | 'Machine' | 'Cable' | 'Bodyweight';
  allowedForMen: boolean;
  allowedForWomen: boolean;
  substitutes: {
    machine?: string;
    dumbbell?: string;
    bodyweight?: string;
  };
}

export const EXERCISE_LIBRARY: Record<string, LibraryExercise> = {
  'inc_db_press': {
    id: 'inc_db_press',
    name: 'Incline Dumbbell Press',
    pattern: 'Push',
    equipment: 'Dumbbell',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'inc_mach_press',
      dumbbell: 'flat_db_press',
      bodyweight: 'pushup_feet_elevated'
    }
  },
  'inc_bb_press': {
    id: 'inc_bb_press',
    name: 'Incline Barbell Press',
    pattern: 'Push',
    equipment: 'Barbell',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'inc_mach_press',
      dumbbell: 'inc_db_press',
      bodyweight: 'pushup_feet_elevated'
    }
  },
  'inc_mach_press': {
    id: 'inc_mach_press',
    name: 'Incline Machine Press',
    pattern: 'Push',
    equipment: 'Machine',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'chest_press_mach',
      dumbbell: 'inc_db_press',
      bodyweight: 'pushup_feet_elevated'
    }
  },
  'flat_db_press': {
    id: 'flat_db_press',
    name: 'Flat Dumbbell Press',
    pattern: 'Push',
    equipment: 'Dumbbell',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'chest_press_mach',
      dumbbell: 'floor_db_press',
      bodyweight: 'pushup'
    }
  },
  'pushup': {
    id: 'pushup',
    name: 'Pushup',
    pattern: 'Push',
    equipment: 'Bodyweight',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'chest_press_mach',
      dumbbell: 'flat_db_press',
      bodyweight: 'knee_pushup'
    }
  },
  'weighted_pullup': {
    id: 'weighted_pullup',
    name: 'Pull-Up',
    pattern: 'Pull',
    equipment: 'Bodyweight',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'lat_pulldown',
      dumbbell: 'db_row',
      bodyweight: 'inverted_row'
    }
  },
  'lat_pulldown': {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    pattern: 'Pull',
    equipment: 'Machine',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'seated_row_mach',
      dumbbell: 'db_row',
      bodyweight: 'inverted_row'
    }
  },
  'seal_row': {
    id: 'seal_row',
    name: 'Seal Row',
    pattern: 'Pull',
    equipment: 'Barbell',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'chest_supported_row',
      dumbbell: 'db_row',
      bodyweight: 'inverted_row'
    }
  },
  'hack_squat': {
    id: 'hack_squat',
    name: 'Hack Squat',
    pattern: 'Squat',
    equipment: 'Machine',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'leg_press',
      dumbbell: 'goblet_squat',
      bodyweight: 'bodyweight_squat'
    }
  },
  'leg_press': {
    id: 'leg_press',
    name: 'Leg Press',
    pattern: 'Squat',
    equipment: 'Machine',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'hack_squat',
      dumbbell: 'goblet_squat',
      bodyweight: 'bodyweight_squat'
    }
  },
  'bb_rdl': {
    id: 'bb_rdl',
    name: 'Barbell Romanian Deadlift',
    pattern: 'Hinge',
    equipment: 'Barbell',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'seated_leg_curl',
      dumbbell: 'db_rdl',
      bodyweight: 'glute_bridge'
    }
  },
  'db_rdl': {
    id: 'db_rdl',
    name: 'Dumbbell Romanian Deadlift',
    pattern: 'Hinge',
    equipment: 'Dumbbell',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'seated_leg_curl',
      dumbbell: 'bb_rdl',
      bodyweight: 'glute_bridge'
    }
  },
  'glute_bridge': {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    pattern: 'Hinge',
    equipment: 'Bodyweight',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'mach_hip_thrust',
      dumbbell: 'db_hip_thrust',
      bodyweight: 'single_leg_glute_bridge'
    }
  },
  'lat_raise': {
    id: 'lat_raise',
    name: 'Lateral Raise',
    pattern: 'Isolation',
    equipment: 'Dumbbell',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'mach_lat_raise',
      dumbbell: 'plate_lat_raise',
      bodyweight: 'isometric_wall_push'
    }
  },
  'db_row': {
    id: 'db_row',
    name: 'Dumbbell Row',
    pattern: 'Pull',
    equipment: 'Dumbbell',
    allowedForMen: true,
    allowedForWomen: true,
    substitutes: {
      machine: 'seated_row_mach',
      dumbbell: 'bent_over_bb_row',
      bodyweight: 'inverted_row'
    }
  }
};
