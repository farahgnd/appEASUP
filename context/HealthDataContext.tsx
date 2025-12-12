
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { HealthData, Meal, Activity, Group, Condition, Post, MiniProgram, WaterLog, GlucoseLog, WeightLog } from '../types';

const initialHealthData: HealthData = {
  auraScore: 78,
  goals: {
    calories: 2500,
    protein: 150,
    activity: 60,
  },
  dailySummary: {
    calories: 1800,
    protein: 110,
    activity: 45,
    water: 1250,
  },
  currentWeight: 75,
  meals: [
    {
      id: 'm1',
      name: 'Protein Oatmeal',
      calories: 450,
      nutrients: { protein: 35, carbs: 55, fat: 10 },
      timestamp: new Date(),
      imageUrl: `https://picsum.photos/seed/oatmeal/400/200`
    },
  ],
  activities: [
    {
      id: 'a1',
      type: 'Weight Training',
      duration: 45,
      caloriesBurned: 350,
      timestamp: new Date(),
    }
  ],
  moods: [
    { id: 'md1', mood: 'Charged', timestamp: new Date() }
  ],
  waterLogs: [],
  weightLogs: [],
  glucoseLogs: [],
  activeProgram: {
    id: 'prog1',
    title: 'Hydration Hero',
    type: 'hydration',
    description: 'Drink 2.5L of water daily for 7 days.',
    totalDays: 7,
    currentDay: 3,
    isJoined: true,
    isCompletedToday: false
  }
};

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: 'u2',
    authorName: 'CyberRunner',
    authorAvatar: 'https://picsum.photos/seed/runner/200',
    content: 'Just crushed a 10k run! The energy levels are peaking. 🏃‍♂️💨',
    timestamp: new Date(Date.now() - 3600000),
    likes: 5,
    type: 'manual'
  },
  {
    id: 'p2',
    authorId: 'u3',
    authorName: 'VitaGlow',
    authorAvatar: 'https://picsum.photos/seed/glow/200',
    content: 'Completed Day 4 of the "Mindful Week" program.',
    timestamp: new Date(Date.now() - 7200000),
    likes: 8,
    type: 'auto_achievement'
  }
];

interface HealthDataContextType {
  healthData: HealthData;
  addMeal: (meal: Omit<Meal, 'id' | 'timestamp'>) => void;
  updateMealAnalysis: (mealId: string, analysis: string) => void;
  logWater: (amount: number) => void;
  logWeight: (weight: number) => void;
  logGlucose: (level: number, context: 'fasting' | 'after_meal' | 'random') => void;
  logMood: (mood: any) => void;
  checkInProgram: () => void;
  group: Group | null;
  setGroup: (group: Group | null) => void;
  addPost: (content: string) => void;
  condition: Condition | null;
  setCondition: (condition: Condition) => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [group, setGroupState] = useState<Group | null>(null);
  const [condition, setConditionState] = useState<Condition | null>(() => localStorage.getItem('easup_condition') as Condition | null);

  const setGroup = (newGroup: Group | null) => {
    if (newGroup && !newGroup.feed) {
        newGroup.feed = MOCK_POSTS;
    }
    setGroupState(newGroup);
  }

  const addMeal = useCallback((mealData: Omit<Meal, 'id' | 'timestamp'>) => {
    setHealthData(prevData => {
      const newMeal: Meal = {
        ...mealData,
        id: `m${Date.now()}`,
        timestamp: new Date(),
      };
      const newCalories = prevData.dailySummary.calories + newMeal.calories;
      const newProtein = prevData.dailySummary.protein + newMeal.nutrients.protein;
      const newAuraScore = Math.min(100, prevData.auraScore + 2);

      return {
        ...prevData,
        meals: [newMeal, ...prevData.meals],
        dailySummary: {
          ...prevData.dailySummary,
          calories: newCalories,
          protein: newProtein,
        },
        auraScore: newAuraScore,
      };
    });
  }, []);

  const updateMealAnalysis = useCallback((mealId: string, analysis: string) => {
    setHealthData(prevData => ({
      ...prevData,
      meals: prevData.meals.map(meal => 
        meal.id === mealId ? { ...meal, analysis } : meal
      ),
    }));
  }, []);
  
  const logWater = useCallback((amount: number) => {
    setHealthData(prev => ({
        ...prev,
        dailySummary: { ...prev.dailySummary, water: prev.dailySummary.water + amount },
        waterLogs: [...prev.waterLogs, { id: `w${Date.now()}`, amount, timestamp: new Date() }],
        auraScore: Math.min(100, prev.auraScore + 1)
    }));
  }, []);

  const logWeight = useCallback((weight: number) => {
    setHealthData(prev => ({
        ...prev,
        currentWeight: weight,
        weightLogs: [...prev.weightLogs, { id: `wt${Date.now()}`, weight, timestamp: new Date() }]
    }));
  }, []);

  const logGlucose = useCallback((level: number, context: 'fasting' | 'after_meal' | 'random') => {
    setHealthData(prev => ({
        ...prev,
        glucoseLogs: [...prev.glucoseLogs, { id: `g${Date.now()}`, level, context, timestamp: new Date() }]
    }));
  }, []);

  const logMood = useCallback((mood: any) => {
      setHealthData(prev => ({
          ...prev,
          moods: [...prev.moods, { id: `md${Date.now()}`, mood, timestamp: new Date() }]
      }));
  }, []);

  const checkInProgram = useCallback(() => {
    setHealthData(prev => {
        if (!prev.activeProgram) return prev;
        return {
            ...prev,
            activeProgram: {
                ...prev.activeProgram,
                isCompletedToday: true,
                currentDay: Math.min(prev.activeProgram.totalDays, prev.activeProgram.currentDay + 1)
            },
            auraScore: Math.min(100, prev.auraScore + 5)
        };
    });
  }, []);

  const addPost = useCallback((content: string) => {
      if (!group) return;
      const newPost: Post = {
          id: `p${Date.now()}`,
          authorId: 'u1',
          authorName: 'User_01',
          authorAvatar: 'https://picsum.photos/seed/user/200',
          content,
          timestamp: new Date(),
          likes: 0,
          type: 'manual'
      };
      setGroupState(prev => prev ? { ...prev, feed: [newPost, ...prev.feed] } : null);
  }, [group]);

  const setCondition = useCallback((newCondition: Condition) => {
    setConditionState(newCondition);
    localStorage.setItem('easup_condition', newCondition);
  }, []);

  return (
    <HealthDataContext.Provider value={{ 
        healthData, 
        addMeal, 
        updateMealAnalysis, 
        logWater,
        logWeight,
        logGlucose,
        logMood,
        checkInProgram,
        group, 
        setGroup, 
        addPost,
        condition, 
        setCondition 
    }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = (): HealthDataContextType => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
