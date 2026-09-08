// Comprehensive Physical Activity Readiness Questionnaire (PAR-Q) Structure for FitStart
export const parqTemplate = {
  title: "Physical Activity Readiness Questionnaire & Member Context (PAR-Q)",
  description: "Before interpreting your FitMao assessment, this questionnaire helps identify your exercise safety, goals, activity profile, and lifestyle habits.",
  sections: [
    {
      id: 'safety',
      title: '1. Safety & Health Screening',
      subtitle: 'Standard medical pre-exercise readiness questions.',
      questions: [
        {
          id: 'heart_condition',
          field: 'hasHeartCondition',
          question: 'Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?',
          type: 'yesno'
        },
        {
          id: 'chest_pain_activity',
          field: 'hasChestPainActivity',
          question: 'Do you feel pain in your chest when you perform physical activity?',
          type: 'yesno'
        },
        {
          id: 'chest_pain_rest',
          field: 'hasChestPainRest',
          question: 'In the past month, have you had chest pain when you were not doing physical activity?',
          type: 'yesno'
        },
        {
          id: 'dizziness_balance',
          field: 'hasDizziness',
          question: 'Do you lose your balance because of dizziness or do you ever lose consciousness?',
          type: 'yesno'
        },
        {
          id: 'bone_joint',
          field: 'hasBoneJointProblem',
          question: 'Do you have a bone or joint problem (e.g. back, knee, or hip) that could be made worse by a change in your physical activity?',
          type: 'yesno'
        },
        {
          id: 'blood_pressure_meds',
          field: 'hasMedications',
          question: 'Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?',
          type: 'yesno'
        },
        {
          id: 'other_reason',
          field: 'hasOtherMedicalReason',
          question: 'Do you know of any other reason why you should not do physical activity?',
          type: 'yesno'
        }
      ]
    },
    {
      id: 'goals',
      title: '2. Fitness Objectives',
      subtitle: 'Specify your main and secondary focus areas to prioritize your starting points.',
      type: 'objectives_split',
      primaryField: 'primaryGoal',
      secondaryField: 'secondaryGoal',
      options: [
        { id: 'fat_loss', label: 'Lose Body Fat & Weight Management', desc: 'Reduce visceral & overall body fat while preserving lean tissue' },
        { id: 'muscle_gain', label: 'Build Muscle & Increase Strength', desc: 'Increase skeletal muscle mass and functional physical power' },
        { id: 'health_longevity', label: 'Cardiovascular & General Health', desc: 'Improve heart health, stamina, and vital organ wellness' },
        { id: 'athletic_performance', label: 'Athletic Conditioning & Agility', desc: 'Enhance speed, reaction, balance, and sports capability' },
        { id: 'posture_mobility', label: 'Posture, Joint Health & Mobility', desc: 'Counteract desk posture, relieve stiffness, and improve flexibility' }
      ]
    },
    {
      id: 'activity_profile',
      title: '3. Main Activity Style',
      subtitle: 'Which single exercise style best matches your routine at KSYN Fitness? (Choose 1)',
      field: 'activityCategory',
      type: 'singleselect',
      options: [
        { id: 'aerobic', label: 'Cardio & Fat-Burn', desc: 'Treadmill intervals, stationary bike, elliptical, incline cardio' },
        { id: 'strength', label: 'Strength & Weight Training', desc: 'Gym machines, free weights, dumbbells, barbells, cables' },
        { id: 'cardio_conditioning', label: 'Heart Health & Stamina', desc: 'Endurance cardio, brisk incline walking, swimming laps' },
        { id: 'athletic_agility', label: 'Sports & Agility Drills', desc: 'Basketball, badminton, plyometrics, speed and reaction work' },
        { id: 'mobility_flexibility', label: 'Stretching & Joint Mobility', desc: 'Yoga, pilates, foam rolling, desk posture correction exercises' }
      ]
    },
    {
      id: 'lifestyle_schedule',
      title: '4. Training Schedule & Lifestyle',
      subtitle: 'Realistic commitments to ensure your starting points are sustainable.',
      questions: [
        {
          id: 'availability',
          field: 'availability',
          question: 'How many days per week can you realistically dedicate to training?',
          type: 'single',
          options: [
            { id: '1-2', label: '1–2 days per week (Focused efficiency)' },
            { id: '3-4', label: '3–4 days per week (Optimal balance)' },
            { id: '5+', label: '5+ days per week (High frequency)' }
          ]
        },
        {
          id: 'sessionDuration',
          field: 'sessionDuration',
          question: 'What is your preferred session duration?',
          type: 'single',
          options: [
            { id: '30_45', label: '30–45 minutes (Concise)' },
            { id: '45_60', label: '45–60 minutes (Standard workout)' },
            { id: '60_plus', label: '60+ minutes (Comprehensive)' }
          ]
        },
        {
          id: 'dailyStyle',
          field: 'dailyStyle',
          question: 'What is your typical daily occupational activity level?',
          type: 'single',
          options: [
            { id: 'desk', label: 'Mostly seated / Desk work (>6 hours sitting)' },
            { id: 'moderate', label: 'Lightly active / Periodically on feet' },
            { id: 'physical', label: 'Heavy physical work / Constantly moving' }
          ]
        }
      ]
    },
    {
      id: 'nutrition_hydration',
      title: '5. Nutrition & Hydration Context',
      subtitle: 'Helps FitStart evaluate whether your BMR and Body Water need priority.',
      questions: [
        {
          id: 'nutritionPattern',
          field: 'nutritionPattern',
          question: 'How would you describe your current daily eating pattern?',
          type: 'single',
          options: [
            { id: 'balanced', label: 'Balanced Home-Cooked Meals', desc: 'Consistent meals with whole foods, veggies, and lean protein' },
            { id: 'irregular', label: 'Irregular / Rushed Schedule', desc: 'Frequently skipping breakfast or lunch, dining on the run' },
            { id: 'high_protein', label: 'Protein-Conscious / Fitness Diet', desc: 'Actively tracking protein intake and workout nutrition' },
            { id: 'dining_out', label: 'Frequent Dining Out & Fast Food', desc: 'Convenience-focused, social meals, or higher sodium' },
            { id: 'low_calorie', label: 'Calorie-Restricted / Cutting', desc: 'Eating in an aggressive deficit to lose weight rapidly' }
          ]
        },
        {
          id: 'waterIntake',
          field: 'waterIntake',
          question: 'What is your typical daily fluid/water intake?',
          type: 'single',
          options: [
            { id: 'low', label: 'Under 1.5 Liters per day (Mild dehydration indicator)' },
            { id: 'moderate', label: '1.5 to 2.5 Liters per day (Standard hydration)' },
            { id: 'optimal', label: '2.5 Liters or more per day (Well hydrated)' }
          ]
        }
      ]
    },
    {
      id: 'obstacles_guidance',
      title: '6. Obstacles & Guidance Preferences',
      subtitle: 'Tell us about potential challenges so the interpretation can reflect your situation.',
      questions: [
        {
          id: 'barriers',
          field: 'barriers',
          question: 'What do you consider your biggest challenge right now?',
          type: 'single',
          options: [
            { id: 'time', label: 'Limited time & busy work schedule' },
            { id: 'motivation', label: 'Staying consistent & motivated' },
            { id: 'injury', label: 'Past joint sensitivity or prior injury' },
            { id: 'confusion', label: 'Not knowing where or how to start' },
            { id: 'none', label: 'None / Feeling motivated and ready' }
          ]
        },
        {
          id: 'guidanceStyle',
          field: 'guidanceStyle',
          question: 'How do you prefer to navigate your fitness plan?',
          type: 'single',
          options: [
            { id: 'trainer', label: 'Coach guidance & form walkthrough' },
            { id: 'self', label: 'Self-guided with clear metric benchmarks' },
            { id: 'checklist', label: 'Structured weekly checklist' }
          ]
        }
      ]
    }
  ]
};
