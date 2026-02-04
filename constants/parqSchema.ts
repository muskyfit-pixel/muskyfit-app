
export interface PARQQuestion {
  id: string;
  question: string;
}

export const PARQ_SCHEMA: PARQQuestion[] = [
  { id: 'hasHeartCondition', question: 'Do you have any heart problems?' },
  { id: 'hasHighBP', question: 'Do you have high blood pressure?' },
  { id: 'hasChestPainExercise', question: 'Do you ever get chest pain when you are active?' },
  { id: 'hasChestPainRest', question: 'Do you ever get chest pain when you are resting?' },
  { id: 'hasDizziness', question: 'Do you ever feel dizzy or faint?' },
  { id: 'hasJointProblems', question: 'Do you have any bone or joint pain that makes it hard to move?' },
  { id: 'hasCurrentInjuries', question: 'Do you have any current injuries or pain?' },
  { id: 'hasHadSurgery', question: 'Have you had an operation in the last year?' },
  { id: 'hasAsthma', question: 'Do you have asthma or any trouble breathing?' },
  { id: 'hasDiabetes', question: 'Do you have diabetes?' },
  { id: 'usesMedication', question: 'Are you taking any medicine or using an inhaler?' },
  { id: 'doctorAdvisedNoExercise', question: 'Has a doctor ever told you not to exercise?' },
  { id: 'otherMedicalCondition', question: 'Is there any other health reason why you should not exercise?' },
];

// Runtime validation to prevent regression
if (PARQ_SCHEMA.length !== 13) {
  throw new Error("CRITICAL: PAR-Q schema modified. Expected 13 questions.");
}
