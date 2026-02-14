import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { HealthStorageService, type Exercise } from '../services/healthStorageService';

interface ExerciseTrackerProps {
  userId: number;
  onExerciseAdded?: (exercise: Exercise) => void;
}

const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({ userId, onExerciseAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>(HealthStorageService.getWeekExercises(userId));
  const guidedExercises = [
    {
      name: "Planche gauche",
      image: "/public/exercises/planchegauche.jpg",
      duration: 60,
      type: "musculation",
      muscleGroups: ["Abdominaux"]
    },
    {
      name: "Squats",
      image: "/public/exercises/squat.jpg",
      duration: 60,
      type: "musculation",
      muscleGroups: ["Jambes", "Quadriceps"]
    },
    {
      name: "Pompes",
      image: "/public/exercises/popmpes.jpg",
      duration: 60,
      type: "musculation",
      muscleGroups: ["Bras", "Épaules"]
    },
    {
      name: "Jumping Jacks",
      image: "/public/exercises/jumpingjacks.jpg",
      duration: 60,
      type: "musculation",
      muscleGroups: ["Corps complet"]
    }
  ];
  const [liveMode, setLiveMode] = useState(false);
  const [currentLive, setCurrentLive] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const [formData, setFormData] = useState({
    type: 'musculation' as const,
    muscleGroups: [] as string[],
    duration: 30,
    series: 3,
    reps: 10,
    intensity: 5,
    notes: ''
  });

  const muscleOptions = [
    'corps complet', 'Dos', 'Épaules', 'Bras', 'Avant-bras',
    'Abdominaux', 'Jambes', 'Quadriceps', 'Ischio-jambiers', 'Mollets'
  ];

  const handleMuscleToggle = (muscle: string) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(muscle)
        ? prev.muscleGroups.filter(m => m !== muscle)
        : [...prev.muscleGroups, muscle]
    }));
  };

  React.useEffect(() => {
    if (!liveMode) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          const ex = guidedExercises[currentLive];
          if (ex) {
            HealthStorageService.addExercise(userId, {
              date: new Date().toISOString(),
              type: ex.type as any,
              muscleGroups: ex.muscleGroups,
              duration: 1,
              intensity: 5
            });
          }

          if (currentLive < guidedExercises.length - 1) {
            setCurrentLive(c => c + 1);
            return 60;
          } else {
            setLiveMode(false);
            setCurrentLive(0);
            return 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [liveMode, currentLive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.muscleGroups.length === 0) {
      alert('Veuillez sélectionner au moins un groupe musculaire');
      return;
    }

    const newExercise = HealthStorageService.addExercise(userId, {
      date: new Date().toISOString(),
      type: formData.type,
      muscleGroups: formData.muscleGroups,
      duration: formData.duration,
      series: formData.type === 'musculation' ? formData.series : undefined,
      reps: formData.type === 'musculation' ? formData.reps : undefined,
      intensity: formData.intensity,
      notes: formData.notes || undefined
    });

    setExercises(prev => [...prev, newExercise]);
    onExerciseAdded?.(newExercise);

    // Reset form
    setFormData({
      type: 'musculation',
      muscleGroups: [],
      duration: 30,
      series: 3,
      reps: 10,
      intensity: 5,
      notes: ''
    });
    setShowForm(false);
  };

  const deleteExercise = (id: string) => {
    const updated = exercises.filter(ex => ex.id !== id);
    setExercises(updated);
    // Note: Vous devrez ajouter une méthode deleteExercise au service
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-orbitron text-green-300">Suivi d'exercices</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-full border border-green-500 transition"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {/* MODE EXERCICE GUIDÉ */}
      <div className="bg-gray-800/40 p-4 rounded-lg border border-green-500/20">
        <button
          onClick={() => {
            if (!liveMode) {
              setCurrentLive(0);
              setTimeLeft(60);
            }
            setLiveMode(!liveMode);
          }}
          className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded mb-4"
        >
          {liveMode ? "Arrêter séance guidée" : "Démarrer séance guidée"}
        </button>

        {liveMode && guidedExercises[currentLive] && (
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-green-300 font-bold text-lg">
              {guidedExercises[currentLive].name}
            </h4>

            <img
              src={guidedExercises[currentLive].image}
              className="w-48"
              alt=""
            />

            <div className="w-40 h-40 rounded-full border-8 border-gray-600 relative">
              <div
                className="absolute inset-0 rounded-full border-8 border-green-400"
                style={{
                  clipPath: `inset(${100 - (timeLeft / 60) * 100}% 0 0 0)`
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                {timeLeft}s
              </span>
            </div>

            <p className="text-sm text-gray-400">
              {currentLive + 1} / {guidedExercises.length}
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800/50 p-4 rounded-lg space-y-4 border border-green-500/20">
          {/* Type d'exercice */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Type d'exercice</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
            >
              <option value="musculation">Musculation</option>
              <option value="cardio">Cardio</option>
              <option value="mobilité">Mobilité</option>
              <option value="sport">Sport</option>
            </select>
          </div>

          {/* Groupes musculaires */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Groupes musculaires ciblés</label>
            <div className="grid grid-cols-2 gap-2">
              {muscleOptions.map(muscle => (
                <button
                  key={muscle}
                  type="button"
                  onClick={() => handleMuscleToggle(muscle)}
                  className={`py-2 px-3 rounded text-sm transition ${
                    formData.muscleGroups.includes(muscle)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Durée: <span className="text-green-400">{formData.duration} min</span>
            </label>
            <input
              type="range"
              min="5"
              max="180"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Intensité */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Intensité: <span className="text-green-400">{formData.intensity}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.intensity}
              onChange={(e) => setFormData(prev => ({ ...prev, intensity: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Séries et reps (musculation seulement) */}
          {formData.type === 'musculation' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Séries</label>
                <input
                  type="number"
                  min="1"
                  value={formData.series}
                  onChange={(e) => setFormData(prev => ({ ...prev, series: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Répétitions</label>
                <input
                  type="number"
                  min="1"
                  value={formData.reps}
                  onChange={(e) => setFormData(prev => ({ ...prev, reps: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ressentis, observations..."
              rows={2}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded transition"
          >
            Ajouter exercice
          </button>
        </form>
      )}

      {/* Liste des exercices */}
      <div className="space-y-2">
        {exercises.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Aucun exercice enregistré cette semaine</p>
        ) : (
          exercises.map((ex, index) => (
            <div key={ex.id ?? `exercise-${index}`} className="bg-gray-800/30 p-3 rounded border border-gray-700 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold">{ex.type}</span>
                  <span className="text-xs text-gray-400">{ex.duration} min • Intensité {ex.intensity}/10</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{ex.muscleGroups.join(', ')}</p>
                {ex.series && ex.reps && (
                  <p className="text-xs text-gray-400">{ex.series}x{ex.reps}</p>
                )}
                {ex.notes && <p className="text-xs text-gray-500 italic">{ex.notes}</p>}
              </div>
              <button
                onClick={() => deleteExercise(ex.id)}
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

export default ExerciseTracker;
