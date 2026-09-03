// Shared Glossary Dataset: FitMao Body Composition Terms
export const GLOSSARY_TERMS = [
  {
    id: 'bodyFatPercentage',
    term: 'Body Fat % (Body Fat Percentage)',
    shortLabel: 'Body Fat %',
    category: 'Body Composition',
    definition: 'The proportion of your total body weight that is composed of fat tissue compared to lean mass (muscle, bone, water).',
    whyItMatters: 'Tracking body fat percentage tells you whether weight loss is coming from actual fat rather than valuable muscle tissue.',
    healthyRange: 'Men: 10% – 20% | Women: 18% – 28%'
  },
  {
    id: 'skeletalMuscleMass',
    term: 'Skeletal Muscle Mass (SMM)',
    shortLabel: 'Skeletal Muscle Mass',
    category: 'Muscle & Strength',
    definition: 'The total weight of the voluntary muscles attached to your skeleton that you can actively train and grow through resistance exercise.',
    whyItMatters: 'Muscle tissue elevates your resting metabolism, stabilizes joints, improves insulin sensitivity, and supports daily physical energy.',
    healthyRange: 'Varies by height and build; higher ratio relative to body weight is generally optimal.'
  },
  {
    id: 'visceralFat',
    term: 'Visceral Fat Level',
    shortLabel: 'Visceral Fat',
    category: 'Cardiovascular & Internal Health',
    definition: 'Fat stored deep within the abdominal cavity, surrounding internal organs such as the liver, stomach, and intestines.',
    whyItMatters: 'Unlike subcutaneous fat under the skin, excessive visceral fat is closely linked to cardiovascular disease, insulin resistance, and systemic inflammation.',
    healthyRange: 'Level 1 – 9: Healthy / Low Risk | Level 10 – 14: Elevated | Level 15+: High Risk'
  },
  {
    id: 'bodyWater',
    term: 'Total Body Water (TBW)',
    shortLabel: 'Body Water',
    category: 'Hydration & Recovery',
    definition: 'The total volume of fluids inside and outside your cells, making up the majority of muscle and lean tissues.',
    whyItMatters: 'Muscle tissue is over 70% water. Good cellular hydration is vital for workout stamina, nutrient transport, joint lubrication, and scan measurement accuracy.',
    healthyRange: 'Men: ~50% – 65% of body weight | Women: ~45% – 60% of body weight'
  },
  {
    id: 'bmr',
    term: 'Basal Metabolic Rate (BMR)',
    shortLabel: 'BMR',
    category: 'Energy & Metabolism',
    definition: 'The minimum number of calories your body burns in 24 hours at complete rest just to keep vital organs functioning.',
    whyItMatters: 'Your BMR is your caloric baseline floor. Eating below your BMR triggers fatigue, metabolic adaptation, and muscle loss.',
    healthyRange: 'Determined by total lean muscle mass, age, sex, and height.'
  },
  {
    id: 'bmi',
    term: 'Body Mass Index (BMI)',
    shortLabel: 'BMI',
    category: 'General Baseline',
    definition: 'A simple mathematical ratio comparing your total weight against your height squared (kg/m²).',
    whyItMatters: 'Provides a quick screening baseline, but cannot distinguish between dense muscle and fat. Best interpreted alongside Body Fat % and Muscle Mass.',
    healthyRange: '18.5 – 24.9: Normal weight | 25.0 – 29.9: Overweight | 30.0+: Obese'
  },
  {
    id: 'targetWeight',
    term: 'Target Weight & Body Control Values',
    shortLabel: 'Target & Control',
    category: 'Recomposition Guidance',
    definition: 'FitMao-calculated suggestions for target weight, fat mass adjustment (Fat Control), and muscle mass increase (Muscle Control) to reach recommended ranges.',
    whyItMatters: 'Clarifies whether body recomposition should focus on losing fat mass, building lean muscle mass, or maintaining current numbers.',
    healthyRange: 'Personalized based on individual height, current body fat %, and skeletal muscle mass.'
  }
];
