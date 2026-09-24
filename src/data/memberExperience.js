export const REFERENCE_MEMBER = {
  firstName: 'Raymund',
  lastName: 'Santos',
  fullName: 'Raymund Santos',
  age: '23 years old',
  biologicalSex: 'Male',
  height: '170 cm',
  gym: 'FitZone Batangas',
  memberSince: 'August 2026',
  primaryGoal: 'Build Muscle',
  activityStyle: 'Strength & Weight Training',
  lastAssessmentDate: 'Sep 5, 2026'
};

export const REFERENCE_ASSESSMENTS = [
  {
    id: 'reference-current',
    assessed_date: '2026-09-05T09:00:00.000Z',
    status: 'CURRENT',
    goalLabel: 'Build Muscle',
    fitMao_report_data: {
      memberName: 'Raymund Santos',
      gender: 'Male',
      age: '23 yrs',
      height: '170 cm',
      testDate: '2026-09-05',
      testTime: '09:00 AM',
      scannerDevice: 'FitMao 3D Scanner Pro',
      gymLocation: 'FitZone Batangas',
      healthScore: '84 / 100',
      bodyType: 'Athletic Standard',
      bodyAge: '22 yrs',
      weight: '63.7 kg',
      targetWeight: '63.5 kg',
      weightControl: '-0.2 kg',
      bodyFatPercentage: '24.8%',
      fatMass: '15.8 kg',
      fatFreeMass: '47.9 kg',
      skeletalMuscleMass: '32.4 kg',
      muscleMass: '45.8 kg',
      fatControl: '-0.8 kg',
      muscleControl: '+0.6 kg',
      bmi: '22.0',
      visceralFat: 'Level 7',
      bmr: '1,620 kcal',
      bodyWater: '34.9 L',
      bodyWaterRatio: '54.8%',
      proteinMass: '10.4 kg',
      boneMineralContent: '3.1 kg',
      waistToHipRatio: '0.82',
      // Demonstration-only review categories and supporting-field decisions.
      // They are not extracted FitMao reference ranges or validated expert rules.
      referenceCategoriesSource: 'Illustrative prototype categories',
      referenceCategories: {
        bodyFatPercentage: 'outside', skeletalMuscleMass: 'boundary', visceralFat: 'within',
        bmi: 'within', bodyWater: 'boundary', waistToHipRatio: 'within'
      },
      corroboratingEvidence: {
        bodyFat: ['fatMass', 'waistToHipRatio'], muscleMass: ['muscleControl'],
        visceralFat: ['waistToHipRatio'], bmi: [], bodyWater: [], waistHipRatio: []
      },
      dataSource: 'Demo assessment data',
      correctedFields: []
    },
    parq_answers: {
      goal: 'muscle_gain',
      goals: ['muscle_gain'],
      activityCategories: ['strength'],
      availability: '3-4',
      nutritionPattern: 'high_protein',
      waterIntake: 'optimal',
      barriers: 'none'
    }
  },
  {
    id: 'reference-previous',
    assessed_date: '2026-08-02T09:00:00.000Z',
    status: 'PREVIOUS',
    goalLabel: 'Lose Body Fat',
    fitMao_report_data: {
      memberName: 'Raymund Santos',
      gender: 'Male',
      age: '23 yrs',
      height: '170 cm',
      testDate: '2026-08-02',
      testTime: '09:00 AM',
      scannerDevice: 'FitMao 3D Scanner Pro',
      gymLocation: 'FitZone Batangas',
      healthScore: '78 / 100',
      bodyType: 'Standard',
      bodyAge: '24 yrs',
      weight: '64.5 kg',
      targetWeight: '62.5 kg',
      weightControl: '-2.0 kg',
      bodyFatPercentage: '25.6%',
      fatMass: '16.5 kg',
      fatFreeMass: '48.0 kg',
      skeletalMuscleMass: '31.8 kg',
      muscleMass: '45.2 kg',
      fatControl: '-1.5 kg',
      muscleControl: '+0.0 kg',
      bmi: '22.3',
      visceralFat: 'Level 8',
      bmr: '1,602 kcal',
      bodyWater: '34.5 L',
      bodyWaterRatio: '53.5%',
      proteinMass: '10.2 kg',
      boneMineralContent: '3.0 kg',
      waistToHipRatio: '0.84',
      referenceCategoriesSource: 'Illustrative prototype categories',
      referenceCategories: {
        bodyFatPercentage: 'outside', skeletalMuscleMass: 'boundary', visceralFat: 'within',
        bmi: 'within', bodyWater: 'boundary', waistToHipRatio: 'within'
      },
      corroboratingEvidence: {
        bodyFat: ['fatMass', 'waistToHipRatio'], muscleMass: ['muscleControl'],
        visceralFat: ['waistToHipRatio'], bmi: [], bodyWater: [], waistHipRatio: []
      },
      dataSource: 'Demo assessment data',
      correctedFields: []
    },
    parq_answers: {
      goal: 'fat_loss',
      goals: ['fat_loss'],
      activityCategories: ['strength'],
      availability: '3-4',
      nutritionPattern: 'balanced',
      waterIntake: 'optimal',
      barriers: 'none'
    }
  }
];

export function formatAssessmentDate(value) {
  if (!value) return 'Recent scan';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function isReferenceAssessment(assessment) {
  return String(assessment?.id || '').startsWith('reference-');
}
