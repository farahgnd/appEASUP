import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import ExerciseTracker from '../components/ExerciseTracker';
import NutritionTracker from '../components/NutritionTracker';
import BodyStateTracker from '../components/BodyStateTracker';
import WeeklySummary from '../components/WeeklySummary';
import { BarChart3, Activity, Utensils, Heart } from 'lucide-react';

const DashboardScreen: React.FC = () => {
  const { healthData } = useHealthData();
  const [activeTab, setActiveTab] = useState<'overview' | 'exercises' | 'nutrition' | 'body'>('overview');
  
  // Mock userId - en production, récupérer depuis auth
  const userId = parseInt(localStorage.getItem('easup_user_id') || '1');

  return (
    <div className="h-full flex flex-col relative z-10">
      {/* Header */}
      <header className="p-4 bg-gray-900/50 backdrop-blur-lg border-b border-green-400/20 sticky top-0 z-20">
        <h1 className="text-2xl font-orbitron text-center text-green-300">EASUP Dashboard</h1>
        <p className="text-xs text-center text-gray-400 mt-1">Suivi santé et bien-être complet</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-900/30 overflow-x-auto sticky top-16 z-20">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-3 font-bold text-center transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-b-2 border-green-400 text-green-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <BarChart3 className="inline mr-2" size={18} />
          Récapitulatif
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 px-4 py-3 font-bold text-center transition whitespace-nowrap ${
            activeTab === 'exercises'
              ? 'border-b-2 border-green-400 text-green-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Activity className="inline mr-2" size={18} />
          Exercices
        </button>
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`flex-1 px-4 py-3 font-bold text-center transition whitespace-nowrap ${
            activeTab === 'nutrition'
              ? 'border-b-2 border-green-400 text-green-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Utensils className="inline mr-2" size={18} />
          Nutrition
        </button>
        <button
          onClick={() => setActiveTab('body')}
          className={`flex-1 px-4 py-3 font-bold text-center transition whitespace-nowrap ${
            activeTab === 'body'
              ? 'border-b-2 border-green-400 text-green-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Heart className="inline mr-2" size={18} />
          État du corps
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'overview' && (
          <WeeklySummary userId={userId} />
        )}

        {activeTab === 'exercises' && (
          <ExerciseTracker userId={userId} />
        )}

        {activeTab === 'nutrition' && (
          <NutritionTracker userId={userId} />
        )}

        {activeTab === 'body' && (
          <BodyStateTracker userId={userId} />
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
