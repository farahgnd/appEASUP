
import React, { useState, useCallback } from 'react';
import HolographicChart from '../components/HolographicChart';
import { useHealthData, } from '../context/HealthDataContext';
import { analyzeMeal } from '../services/geminiService';
import { Plus, Bot, Zap, Loader } from 'lucide-react';
import type { Meal } from '../types';

const MealCard: React.FC<{ meal: Meal, onAnalyze: (meal: Meal) => void, isAnalyzing: boolean }> = ({ meal, onAnalyze, isAnalyzing }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50">
            <img src={meal.imageUrl} alt={meal.name} className="w-full h-24 object-cover" />
            <div className="p-4">
                <h4 className="font-bold text-lg text-white">{meal.name}</h4>
                <p className="text-sm text-green-300 font-mono">{meal.calories} kcal</p>
                <div className="text-xs text-gray-400 mt-2 flex justify-between">
                    <span>P: {meal.nutrients.protein}g</span>
                    <span>C: {meal.nutrients.carbs}g</span>
                    <span>F: {meal.nutrients.fat}g</span>
                </div>

                {meal.analysis ? (
                    <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                        <p className="text-xs text-green-200">{meal.analysis}</p>
                    </div>
                ) : (
                    <button 
                        onClick={() => onAnalyze(meal)} 
                        disabled={isAnalyzing}
                        className="mt-4 w-full flex items-center justify-center gap-2 text-sm bg-green-500/20 text-green-300 rounded-lg py-2 hover:bg-green-500/40 transition disabled:opacity-50"
                    >
                        {isAnalyzing ? <><Loader size={16} className="animate-spin" /> Analyzing...</> : <><Bot size={16} /> Nutri-Synth Analysis</>}
                    </button>
                )}
            </div>
        </div>
    );
};


const NutritionScreen: React.FC = () => {
    const { healthData, updateMealAnalysis } = useHealthData();
    const [analyzingMealId, setAnalyzingMealId] = useState<string | null>(null);

    const handleAnalyzeMeal = useCallback(async (meal: Meal) => {
        setAnalyzingMealId(meal.id);
        const analysis = await analyzeMeal(meal.name, meal.nutrients);
        updateMealAnalysis(meal.id, analysis);
        setAnalyzingMealId(null);
    }, [updateMealAnalysis]);

    const macroData = [
        { name: 'Protein', value: healthData.dailySummary.protein },
        { name: 'Carbs', value: healthData.meals.reduce((sum, m) => sum + m.nutrients.carbs, 0) },
        { name: 'Fat', value: healthData.meals.reduce((sum, m) => sum + m.nutrients.fat, 0) },
    ];

    return (
        <div className="relative z-10">
            <header className="p-4 bg-gray-900/50 backdrop-blur-lg border-b border-green-400/20 sticky top-0 z-20">
                <h1 className="text-xl font-orbitron text-center text-green-300">EASUP Nutrition</h1>
            </header>
            <div className="p-4 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-gray-200">Macronutrient Intake</h2>
                     <HolographicChart data={macroData} colors={['#34d399', '#a7f3d0']} />
                </div>

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-200">Today's Fuel</h2>
                     <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-400 transition transform active:scale-95">
                        <Plus size={16}/> Log Meal
                    </button>
                </div>
                
                <div className="space-y-4">
                    {healthData.meals.map(meal => (
                        <MealCard 
                            key={meal.id} 
                            meal={meal} 
                            onAnalyze={handleAnalyzeMeal}
                            isAnalyzing={analyzingMealId === meal.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NutritionScreen;
