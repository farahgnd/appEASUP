import React, { useState, useEffect } from 'react';
import { HealthStorageService } from '../services/healthStorageService';
import { TrendingUp, Award, Zap, BookOpen } from 'lucide-react';

interface WeeklySummaryProps {
  userId: number;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ userId }) => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const data = HealthStorageService.generateWeeklySummary(userId);
    setSummary(data);
  }, [userId]);

  if (!summary) {
    return <div className="text-gray-400 text-sm">Aucune donnée pour cette semaine</div>;
  }

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-green-600/20 to-green-400/10 p-4 rounded-lg border border-green-500/30">
        <h2 className="text-2xl font-orbitron text-green-300">
          Récapitulatif Semaine {summary.week}
        </h2>
        <p className="text-sm text-gray-400 mt-1">2026</p>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Exercices */}
        <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
          <div className="text-3xl font-bold text-green-400">{summary.exerciseCount}</div>
          <p className="text-xs text-gray-400 mt-1">Séances</p>
        </div>

        {/* Durée totale */}
        <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
          <div className="text-3xl font-bold text-blue-400">{summary.totalDuration}</div>
          <p className="text-xs text-gray-400 mt-1">minutes</p>
        </div>

        {/* Intensité moyenne */}
        <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
          <div className="text-3xl font-bold text-orange-400">{summary.avgIntensity}</div>
          <p className="text-xs text-gray-400 mt-1">/10 Intensité</p>
        </div>

        {/* Repas */}
        <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
          <div className="text-3xl font-bold text-purple-400">{summary.mealCount}</div>
          <p className="text-xs text-gray-400 mt-1">Repas</p>
        </div>
      </div>

      {/* Zones les plus sollicitées */}
      {summary.mostWorkedMuscles && summary.mostWorkedMuscles.length > 0 && (
        <div className="bg-gray-800/30 p-4 rounded-lg border border-green-500/20">
          <h3 className="flex items-center gap-2 text-green-300 font-bold mb-3">
            <TrendingUp size={18} />
            Zones les plus sollicitées
          </h3>
          <div className="space-y-2">
            {summary.mostWorkedMuscles.map((muscle: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all"
                    style={{ width: `${(muscle.intensity / 100) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-300 min-w-fit">
                  {muscle.zone.replace('_', ' ')} <span className="text-green-400">{muscle.intensity}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bilan nutritionnel */}
      <div className="bg-gray-800/30 p-4 rounded-lg border border-green-500/20">
        <h3 className="flex items-center gap-2 text-green-300 font-bold mb-3">
          <Zap size={18} />
          Bilan nutritionnel
        </h3>
        <div className="grid grid-cols-3 gap-2 text-sm text-center">
          <div className="bg-gray-700/50 p-2 rounded">
            <p className="text-lg">🥚</p>
            <p className="text-green-300 font-bold">{summary.nutritionBreakdown.protéines}</p>
            <p className="text-xs text-gray-400">Protéines</p>
          </div>
          <div className="bg-gray-700/50 p-2 rounded">
            <p className="text-lg">🍞</p>
            <p className="text-green-300 font-bold">{summary.nutritionBreakdown.glucides}</p>
            <p className="text-xs text-gray-400">Glucides</p>
          </div>
          <div className="bg-gray-700/50 p-2 rounded">
            <p className="text-lg">🥑</p>
            <p className="text-green-300 font-bold">{summary.nutritionBreakdown.lipides}</p>
            <p className="text-xs text-gray-400">Lipides</p>
          </div>
          <div className="bg-gray-700/50 p-2 rounded">
            <p className="text-lg">🥗</p>
            <p className="text-green-300 font-bold">{summary.nutritionBreakdown.légumes}</p>
            <p className="text-xs text-gray-400">Légumes</p>
          </div>
          <div className="bg-gray-700/50 p-2 rounded">
            <p className="text-lg">🍫</p>
            <p className="text-amber-300 font-bold">{summary.nutritionBreakdown.sucre}</p>
            <p className="text-xs text-gray-400">Sucres</p>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      {summary.recommendations && summary.recommendations.length > 0 && (
        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
          <h3 className="flex items-center gap-2 text-blue-300 font-bold mb-3">
            <BookOpen size={18} />
            Recommandations pour la prochaine semaine
          </h3>
          <ul className="space-y-2">
            {summary.recommendations.map((rec: string, idx: number) => (
              <li key={idx} className="text-sm text-blue-200 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Encouragements */}
      {summary.exerciseCount > 0 && (
        <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/20">
          <h3 className="flex items-center gap-2 text-green-300 font-bold mb-2">
            <Award size={18} />
            Bravo ! 🎉
          </h3>
          <p className="text-sm text-green-200">
            {summary.exerciseCount === 1 && "Vous avez commencé la semaine avec détermination !"}
            {summary.exerciseCount > 1 && summary.exerciseCount <= 3 && "Bonne constance cette semaine ! Continuez sur cette lancée."}
            {summary.exerciseCount > 3 && summary.exerciseCount <= 5 && "Excellent ! Vous êtes régulier dans vos entraînements."}
            {summary.exerciseCount > 5 && "Vous êtes un champion ! Votre dévouement inspire. 💪"}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklySummary;
