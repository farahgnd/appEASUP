
// FIX: Import `ReactNode` type to resolve 'Cannot find namespace React' error.
import type { ReactNode } from 'react';

export type Condition = 'diabetes' | 'hypertension' | 'none';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
  };
  timestamp: Date;
  imageUrl?: string;
  analysis?: string;
}

export interface Activity {
  id: string;
  type: string;
  duration: number; // in minutes
  caloriesBurned: number;
  timestamp: Date;
}

export interface MoodLog {
    id: string;
    mood: 'Radiant' | 'Charged' | 'Balanced' | 'Drained' | 'Stressed';
    timestamp: Date;
}

export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: Date;
}

export interface WeightLog {
  id: string;
  weight: number; // in kg
  timestamp: Date;
}

export interface GlucoseLog {
  id: string;
  level: number; // mg/dL
  timestamp: Date;
  context: 'fasting' | 'after_meal' | 'random';
}

export interface MiniProgram {
  id: string;
  title: string;
  type: 'hydration' | 'walking' | 'mood';
  description: string;
  totalDays: number;
  currentDay: number;
  isJoined: boolean;
  isCompletedToday: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  type: 'manual' | 'auto_achievement';
}

export interface HealthData {
  auraScore: number;
  goals: {
    calories: number;
    protein: number;
    activity: number;
  };
  dailySummary: {
    calories: number;
    protein: number;
    activity: number;
    water: number; // ml
  };
  currentWeight: number;
  meals: Meal[];
  activities: Activity[];
  moods: MoodLog[];
  waterLogs: WaterLog[];
  weightLogs: WeightLog[];
  glucoseLogs: GlucoseLog[];
  activeProgram: MiniProgram | null;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    // FIX: Use the imported `ReactNode` type instead of `React.ReactNode`.
    text: string | ReactNode;
    timestamp: Date;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    date?: string;
}

export interface GroupMember {
    id: string;
    name: string;
    avatarUrl: string;
    easupScore: number;
    level: number;
    isCurrentUser?: boolean;
}

export interface GroupChallenge {
    id: string;
    title: string;
    description: string;
    progress: number;
    goal: number;
    unit: string;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    members: GroupMember[];
    challenges: GroupChallenge[];
    feed: Post[];
}
