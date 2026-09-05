// Demo Assessment Presets & Payloads for FitStart
// Contains standardized clinical profiles for evaluation and testing.

export const DEFAULT_EXTRACTED = {
  // Member Demographics & Scanner Details
  memberName: 'Alex Rivera',
  gender: 'Male',
  age: 28,
  height: 175,
  testDate: '2026-09-05',
  testTime: '10:30 AM',
  scannerDevice: 'FitMao 3D Scanner Pro',
  gymLocation: 'KSYN Fitness Alabang',
  healthScore: 74,
  bodyType: 'Standard Overweight',
  bodyAge: 31,
  
  // Body Composition (Raw Numerics)
  weight: 78.0,
  targetWeight: 72.0,
  weightControl: -6.0,
  bodyFatPercentage: 24.5,
  fatMass: 19.1,
  fatFreeMass: 58.9,
  skeletalMuscleMass: 32.1,
  muscleMass: 55.4,
  fatControl: -6.0,
  muscleControl: 0.0,

  // Health & Body Indices
  bmi: 25.4,
  visceralFat: 11,
  bmr: 1650,
  bodyWater: 42.3,
  bodyWaterRatio: 54.2,
  proteinMass: 12.8,
  boneMineralContent: 3.8,
  waistToHipRatio: 0.88
};

export const ATHLETIC_EXTRACTED = {
  // Member Demographics & Scanner Details
  memberName: 'Jordan Cruz',
  gender: 'Female',
  age: 25,
  height: 168,
  testDate: '2026-09-05',
  testTime: '02:15 PM',
  scannerDevice: 'FitMao 3D Scanner Pro',
  gymLocation: 'KSYN Fitness Alabang',
  healthScore: 89,
  bodyType: 'Athletic Muscular',
  bodyAge: 22,

  // Body Composition (Raw Numerics)
  weight: 71.5,
  targetWeight: 76.0,
  weightControl: 4.5,
  bodyFatPercentage: 14.8,
  fatMass: 10.6,
  fatFreeMass: 60.9,
  skeletalMuscleMass: 34.8,
  muscleMass: 57.8,
  fatControl: 0.0,
  muscleControl: 4.5,

  // Health & Body Indices
  bmi: 22.8,
  visceralFat: 4,
  bmr: 1820,
  bodyWater: 47.1,
  bodyWaterRatio: 65.8,
  proteinMass: 14.2,
  boneMineralContent: 4.1,
  waistToHipRatio: 0.74
};

export const METABOLIC_EXTRACTED = {
  // Member Demographics & Scanner Details
  memberName: 'Marcus Vance',
  gender: 'Male',
  age: 38,
  height: 172,
  testDate: '2026-09-05',
  testTime: '04:45 PM',
  scannerDevice: 'FitMao 3D Scanner Pro',
  gymLocation: 'KSYN Fitness Alabang',
  healthScore: 62,
  bodyType: 'Hidden Obese',
  bodyAge: 44,

  // Body Composition (Raw Numerics)
  weight: 82.4,
  targetWeight: 70.0,
  weightControl: -12.4,
  bodyFatPercentage: 28.2,
  fatMass: 23.2,
  fatFreeMass: 59.2,
  skeletalMuscleMass: 29.8,
  muscleMass: 54.1,
  fatControl: -9.5,
  muscleControl: 2.9,

  // Health & Body Indices
  bmi: 27.9,
  visceralFat: 14,
  bmr: 1580,
  bodyWater: 40.8,
  bodyWaterRatio: 49.5,
  proteinMass: 11.9,
  boneMineralContent: 3.6,
  waistToHipRatio: 0.94
};

export const DEMO_PRESETS = [
  {
    id: 'standard',
    label: 'Sample 1',
    name: 'Alex (24.5% Fat)',
    tag: 'Standard/Overwt',
    tagColor: 'text-amber-600 dark:text-amber-400',
    data: DEFAULT_EXTRACTED
  },
  {
    id: 'athletic',
    label: 'Sample 2',
    name: 'Jordan (34.8kg SMM)',
    tag: 'Athletic/Muscle',
    tagColor: 'text-brand-600 dark:text-brand-400',
    data: ATHLETIC_EXTRACTED
  },
  {
    id: 'metabolic',
    label: 'Sample 3',
    name: 'Marcus (Level 14 VF)',
    tag: 'Visceral/Metabolic',
    tagColor: 'text-rose-600 dark:text-rose-400',
    data: METABOLIC_EXTRACTED
  }
];

export const DEMO_TEST_PAYLOADS = [
  {
    label: 'Elena (JSON)',
    payload: '{"memberName":"Elena Reyes","gender":"Female","age":29,"height":165,"weight":63.5,"bodyFatPercentage":21.2,"skeletalMuscleMass":28.4,"visceralFat":6,"bmr":1480,"healthScore":84,"bodyType":"Balanced Standard"}'
  },
  {
    label: 'David (URL Query)',
    payload: 'https://fitmao.com/report?name=David+Santos&gender=Male&age=33&h=178&w=88.5&pbf=31.2&smm=33.0&vfat=15&bmr=1720&score=58'
  }
];
