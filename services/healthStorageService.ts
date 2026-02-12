import type { HealthData } from '../types';

export interface Exercise {
  id: string;
  date: string;
  type: 'musculation' | 'cardio' | 'mobilité' | 'sport';
  muscleGroups: string[];
  duration: number; // minutes
  series?: number;
  reps?: number;
  intensity: number; // 1-10
  notes?: string;
}

export interface Meal {
  id: string;
  date: string;
  name: string;
  quantity: string;
  category: 'protéines' | 'glucides' | 'lipides' | 'légumes' | 'sucre' | 'autre';
  calories?: number;
  notes?: string;
}

export interface BodyState {
  date: string;
  energyLevel: number; // 1-10
  muscleFatigue: { [muscleGroup: string]: number }; // 1-10
  discomforts: string[];
  notes?: string;
}

export interface WeeklyData {
  week: number;
  year: number;
  exercises: Exercise[];
  meals: Meal[];
  bodyStates: BodyState[];
}

export interface UserHealthStorage {
  userId: number;
  createdAt: string;
  weeklyData: WeeklyData[];
  currentWeekData: WeeklyData;
}

/**
 * Service de stockage centralisé pour toutes les données santé
 * Stockage local en JSON, prêt pour intégration DB
 */

const STORAGE_KEY = 'easup_health_data';

export const HealthStorageService = {
  /**
   * Initialiser le stockage pour un utilisateur
   */
  initUser: (userId: number): UserHealthStorage => {
    const existing = HealthStorageService.getUser(userId);
    if (existing) return existing;

    const now = new Date();
    const week = getWeekNumber(now);
    const year = now.getFullYear();

    const newStorage: UserHealthStorage = {
      userId,
      createdAt: now.toISOString(),
      weeklyData: [],
      currentWeekData: {
        week,
        year,
        exercises: [],
        meals: [],
        bodyStates: []
      }
    };

    HealthStorageService.saveUser(newStorage);
    return newStorage;
  },

  /**
   * Récupérer les données d'un utilisateur
   */
  getUser: (userId: number): UserHealthStorage | null => {
    const data = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Sauvegarder les données d'un utilisateur
   */
  saveUser: (userData: UserHealthStorage): void => {
    localStorage.setItem(`${STORAGE_KEY}_${userData.userId}`, JSON.stringify(userData));
  },

  /**
   * Ajouter un exercice
   */
  addExercise: (userId: number, exercise: Omit<Exercise, 'id'>): Exercise => {
    const user = HealthStorageService.getUser(userId) || HealthStorageService.initUser(userId);
    const newExercise: Exercise = {
      ...exercise,
      id: `ex_${Date.now()}`
    };

    user.currentWeekData.exercises.push(newExercise);
    HealthStorageService.saveUser(user);
    return newExercise;
  },

  /**
   * Ajouter un repas
   */
  addMeal: (userId: number, meal: Omit<Meal, 'id'>): Meal => {
    const user = HealthStorageService.getUser(userId) || HealthStorageService.initUser(userId);
    const newMeal: Meal = {
      ...meal,
      id: `meal_${Date.now()}`
    };

    user.currentWeekData.meals.push(newMeal);
    HealthStorageService.saveUser(user);
    return newMeal;
  },

  /**
   * Enregistrer l'état du corps
   */
  setBodyState: (userId: number, state: Omit<BodyState, 'date'>): BodyState => {
    const user = HealthStorageService.getUser(userId) || HealthStorageService.initUser(userId);
    const bodyState: BodyState = {
      ...state,
      date: new Date().toISOString()
    };

    // Garder seulement un état par jour
    const today = new Date().toDateString();
    user.currentWeekData.bodyStates = user.currentWeekData.bodyStates.filter(
      bs => new Date(bs.date).toDateString() !== today
    );
    user.currentWeekData.bodyStates.push(bodyState);

    HealthStorageService.saveUser(user);
    return bodyState;
  },

  /**
   * Récupérer les données de la semaine actuelle
   */
  getCurrentWeekData: (userId: number): WeeklyData | null => {
    const user = HealthStorageService.getUser(userId);
    return user?.currentWeekData || null;
  },

  /**
   * Récupérer les exercices de la semaine
   */
  getWeekExercises: (userId: number): Exercise[] => {
    const user = HealthStorageService.getUser(userId);
    return user?.currentWeekData.exercises || [];
  },

  /**
   * Récupérer les repas de la semaine
   */
  getWeekMeals: (userId: number): Meal[] => {
    const user = HealthStorageService.getUser(userId);
    return user?.currentWeekData.meals || [];
  },

  /**
   * Récupérer l'état du corps du jour
   */
  getTodayBodyState: (userId: number): BodyState | null => {
    const user = HealthStorageService.getUser(userId);
    if (!user) return null;

    const today = new Date().toDateString();
    return (
      user.currentWeekData.bodyStates.find(
        bs => new Date(bs.date).toDateString() === today
      ) || null
    );
  },

  /**
   * Calculer l'intensité par zone du corps
   */
  calculateBodyZoneIntensity: (userId: number): { [zone: string]: number } => {
    const exercises = HealthStorageService.getWeekExercises(userId);
    const intensity: { [zone: string]: number } = {};

    // Mapping muscles -> zones du corps
    const muscleToZone: { [key: string]: string } = {
      poitrine: 'chest',
      dos: 'back',
      épaules: 'left_shoulder', // simplifié
      bras: 'left_arm',
      avant_bras: 'left_arm',
      abdominaux: 'abdomen',
      jambes: 'left_leg',
      quadriceps: 'left_leg',
      ischio: 'left_leg',
      mollets: 'left_leg'
    };

    exercises.forEach(ex => {
      ex.muscleGroups.forEach(muscle => {
        const zone = muscleToZone[muscle.toLowerCase()] || 'chest';
        intensity[zone] = Math.min(100, (intensity[zone] || 0) + ex.intensity * 10);
      });
    });

    return intensity;
  },

  /**
   * Générer un résumé hebdomadaire
   */
  generateWeeklySummary: (userId: number) => {
    const user = HealthStorageService.getUser(userId);
    if (!user) return null;

    const exercises = user.currentWeekData.exercises;
    const meals = user.currentWeekData.meals;
    const bodyZoneIntensity = HealthStorageService.calculateBodyZoneIntensity(userId);

    const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
    const exerciseCount = exercises.length;
    const avgIntensity = exercises.length > 0 ? exercises.reduce((sum, ex) => sum + ex.intensity, 0) / exercises.length : 0;

    // Nutrition summary
    const nutritionBreakdown = {
      protéines: meals.filter(m => m.category === 'protéines').length,
      glucides: meals.filter(m => m.category === 'glucides').length,
      lipides: meals.filter(m => m.category === 'lipides').length,
      légumes: meals.filter(m => m.category === 'légumes').length,
      sucre: meals.filter(m => m.category === 'sucre').length
    };

    return {
      week: user.currentWeekData.week,
      year: user.currentWeekData.year,
      totalDuration,
      exerciseCount,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      mealCount: meals.length,
      bodyZoneIntensity,
      nutritionBreakdown,
      mostWorkedMuscles: Object.entries(bodyZoneIntensity)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([zone, intensity]) => ({ zone, intensity: Math.round(intensity) })),
      recommendations: generateRecommendations(exercises, meals, bodyZoneIntensity)
    };
  },

  /**
   * Clôturer la semaine et passer à la nouvelle
   */
  completeWeek: (userId: number): void => {
    const user = HealthStorageService.getUser(userId);
    if (!user) return;

    // Archiver la semaine actuelle
    user.weeklyData.push(user.currentWeekData);

    // Créer une nouvelle semaine
    const now = new Date();
    const week = getWeekNumber(now);
    const year = now.getFullYear();

    user.currentWeekData = {
      week,
      year,
      exercises: [],
      meals: [],
      bodyStates: []
    };

    HealthStorageService.saveUser(user);
  }
};

/**
 * Utilitaires
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function generateRecommendations(exercises: Exercise[], meals: Meal[], bodyZoneIntensity: { [zone: string]: number }): string[] {
  const recommendations: string[] = [];

  // Exercices
  if (exercises.length === 0) {
    recommendations.push('💪 Commencez la semaine avec au moins une séance d\'exercice !');
  } else if (exercises.length < 3) {
    recommendations.push('📈 Essayez d\'ajouter 1-2 séances supplémentaires cette semaine.');
  } else {
    recommendations.push('✅ Bravo pour votre constance ! Continuez ainsi.');
  }

  // Nutrition
  const hasProteins = meals.some(m => m.category === 'protéines');
  const hasVeggies = meals.some(m => m.category === 'légumes');
  const hasSugar = meals.filter(m => m.category === 'sucre').length > 2;

  if (!hasProteins) {
    recommendations.push('🥚 Intégrez plus de protéines pour la récupération musculaire.');
  }
  if (!hasVeggies) {
    recommendations.push('🥗 Ajoutez plus de légumes pour les vitamines et minéraux.');
  }
  if (hasSugar) {
    recommendations.push('⚠️ Réduisez les sucres raffinés, préférez des glucides complexes.');
  }

  // Repos
  const highIntensityZones = Object.values(bodyZoneIntensity).filter(i => i > 50).length;
  if (highIntensityZones > 3) {
    recommendations.push('🧘 Prévoir des jours de repos pour la récupération.');
  }

  return recommendations;
}

export default HealthStorageService;
