import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { HealthStorageService, type Meal } from '../services/healthStorageService';

interface NutritionTrackerProps {
  userId: number;
  onMealAdded?: (meal: Meal) => void;
}

const NutritionTracker: React.FC<NutritionTrackerProps> = ({ userId, onMealAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [meals, setMeals] = useState<Meal[]>(HealthStorageService.getWeekMeals(userId));

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: 'protéines' as const,
    calories: '',
    notes: ''
  });

  const categoryEmojis: { [key: string]: string } = {
    'protéines': '🥚',
    'glucides': '🍞',
    'lipides': '🥑',
    'légumes': '🥗',
    'sucre': '🍫',
    'autre': '🍽️'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quantity.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newMeal = HealthStorageService.addMeal(userId, {
      date: new Date().toISOString(),
      name: formData.name,
      quantity: formData.quantity,
      category: formData.category,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      notes: formData.notes || undefined
    });

    setMeals(prev => [...prev, newMeal]);
    onMealAdded?.(newMeal);

    // Reset form
    setFormData({
      name: '',
      quantity: '',
      category: 'protéines',
      calories: '',
      notes: ''
    });
    setShowForm(false);
  };

  const deleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  // Calcul nutritionnel
  const nutritionStats = {
    protéines: meals.filter(m => m.category === 'protéines').length,
    glucides: meals.filter(m => m.category === 'glucides').length,
    lipides: meals.filter(m => m.category === 'lipides').length,
    légumes: meals.filter(m => m.category === 'légumes').length,
    sucre: meals.filter(m => m.category === 'sucre').length
  };

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-orbitron text-green-300">Suivi nutritionnel</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-full border border-green-500 transition"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800/50 p-4 rounded-lg space-y-4 border border-green-500/20">
          {/* Nom du aliment */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Aliment</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Poulet grillé, Riz complet..."
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
            />
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Quantité</label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="Ex: 150g, 1 assiette, 2 œufs..."
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
            >
              <option value="protéines">🥚 Protéines</option>
              <option value="glucides">🍞 Glucides</option>
              <option value="lipides">🥑 Lipides</option>
              <option value="légumes">🥗 Légumes</option>
              <option value="sucre">🍫 Sucres</option>
              <option value="autre">🍽️ Autre</option>
            </select>
          </div>

          {/* Calories */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Calories (optionnel)</label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
              placeholder="Ex: 350"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ressentis, digestion..."
              rows={2}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded transition"
          >
            Ajouter repas
          </button>
        </form>
      )}

      {/* Statistiques */}
      {meals.length > 0 && (
        <div className="bg-gray-800/30 p-3 rounded border border-green-500/20">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="text-2xl">🥚</p>
              <p className="text-green-300 font-bold">{nutritionStats.protéines}</p>
              <p className="text-gray-400">Protéines</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">🍞</p>
              <p className="text-green-300 font-bold">{nutritionStats.glucides}</p>
              <p className="text-gray-400">Glucides</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">🥑</p>
              <p className="text-green-300 font-bold">{nutritionStats.lipides}</p>
              <p className="text-gray-400">Lipides</p>
            </div>
          </div>
          {totalCalories > 0 && (
            <p className="text-center mt-2 text-sm text-gray-300">
              <span className="font-bold text-green-400">{totalCalories}</span> kcal
            </p>
          )}
        </div>
      )}

      {/* Liste des repas */}
      <div className="space-y-2">
        {meals.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Aucun repas enregistré cette semaine</p>
        ) : (
          meals.map(meal => (
            <div key={meal.id} className="bg-gray-800/30 p-3 rounded border border-gray-700 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryEmojis[meal.category]}</span>
                  <span className="text-green-400 font-bold">{meal.name}</span>
                </div>
                <p className="text-sm text-gray-400">{meal.quantity}</p>
                {meal.calories && <p className="text-xs text-gray-500">{meal.calories} kcal</p>}
                {meal.notes && <p className="text-xs text-gray-500 italic">{meal.notes}</p>}
              </div>
              <button
                onClick={() => deleteMeal(meal.id)}
                className="text-gray-500 hover:text-red-400 transition"
              >
                <X size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NutritionTracker;
