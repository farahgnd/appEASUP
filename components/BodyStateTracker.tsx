import React, { useState, useEffect } from 'react';
import { Heart, Frown, Zap } from 'lucide-react';
import InteractiveBody, { type BodyZone } from './InteractiveBody';
import { HealthStorageService } from '../services/healthStorageService';

interface BodyStateTrackerProps {
  userId: number;
}

const BodyStateTracker: React.FC<BodyStateTrackerProps> = ({ userId }) => {
  const [energyLevel, setEnergyLevel] = useState(5);
  const [muscleFatigue, setMuscleFatigue] = useState<{ [key: string]: number }>({
    chest: 0,
    back: 0,
    left_arm: 0,
    right_arm: 0,
    abdomen: 0,
    left_leg: 0,
    right_leg: 0,
    left_shoulder: 0,
    right_shoulder: 0,
  });
  const [discomforts, setDiscomforts] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const discomfortOptions = ['Aucune', 'Douleur légère', 'Raideur', 'Fatigue', 'Courbatures', 'Entorse'];

  // Charger les données du jour
  useEffect(() => {
    const todayState = HealthStorageService.getTodayBodyState(userId);
    if (todayState) {
      setEnergyLevel(todayState.energyLevel);
      setMuscleFatigue(todayState.muscleFatigue);
      setDiscomforts(todayState.discomforts);
      setNotes(todayState.notes || '');
    }
  }, [userId]);

  const handleSaveState = () => {
    HealthStorageService.setBodyState(userId, {
      energyLevel,
      muscleFatigue,
      discomforts,
      notes
    });
    alert('État du corps enregistré ! 💪');
  };

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
  };

  // Générer les zones du corps avec intensité
  const bodyZones: BodyZone[] = [
    { id: 'head', name: 'head', label: 'Tête', intensity: 0, color: '#EF4444', x: 50, y: 15 },
    { id: 'chest', name: 'chest', label: 'Poitrine', intensity: muscleFatigue['chest'] * 10, color: '#EF4444', x: 50, y: 40 },
    { id: 'back', name: 'back', label: 'Dos', intensity: muscleFatigue['back'] * 10, color: '#EF4444', x: 50, y: 75 },
    { id: 'left_shoulder', name: 'left_shoulder', label: 'Épaule gauche', intensity: muscleFatigue['left_shoulder'] * 10, color: '#EF4444', x: 35, y: 32 },
    { id: 'right_shoulder', name: 'right_shoulder', label: 'Épaule droite', intensity: muscleFatigue['right_shoulder'] * 10, color: '#EF4444', x: 65, y: 32 },
    { id: 'left_arm', name: 'left_arm', label: 'Bras gauche', intensity: muscleFatigue['left_arm'] * 10, color: '#EF4444', x: 30, y: 50 },
    { id: 'right_arm', name: 'right_arm', label: 'Bras droit', intensity: muscleFatigue['right_arm'] * 10, color: '#EF4444', x: 70, y: 50 },
    { id: 'abdomen', name: 'abdomen', label: 'Abdominaux', intensity: muscleFatigue['abdomen'] * 10, color: '#EF4444', x: 50, y: 63 },
    { id: 'left_leg', name: 'left_leg', label: 'Jambe gauche', intensity: muscleFatigue['left_leg'] * 10, color: '#EF4444', x: 45, y: 90 },
    { id: 'right_leg', name: 'right_leg', label: 'Jambe droite', intensity: muscleFatigue['right_leg'] * 10, color: '#EF4444', x: 55, y: 90 },
  ];

  const getEnergyColor = (level: number) => {
    if (level < 3) return 'text-red-400';
    if (level < 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getEnergyEmoji = (level: number) => {
    if (level < 3) return '😴';
    if (level < 6) return '😐';
    return '🚀';
  };

  return (
    <div className="space-y-6">
      {/* Niveau d'énergie */}
      <div className="bg-gray-800/30 p-4 rounded-lg border border-green-500/20">
        <h3 className="flex items-center gap-2 text-green-300 font-bold mb-4">
          <Zap size={18} />
          Niveau d'énergie
        </h3>
        <div className="text-center">
          <div className={`text-5xl mb-2 ${getEnergyColor(energyLevel)}`}>
            {getEnergyEmoji(energyLevel)}
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            className="w-full"
          />
          <p className={`mt-2 font-bold text-lg ${getEnergyColor(energyLevel)}`}>
            {energyLevel}/10
          </p>
        </div>
      </div>

      {/* Corps humain interactif */}
      <div className="bg-gray-800/30 p-4 rounded-lg border border-green-500/20">
        <h3 className="text-green-300 font-bold mb-4">Fatigue musculaire par zone</h3>
        <InteractiveBody 
          zones={bodyZones} 
          onZoneClick={handleZoneClick}
        />

        {/* Contrôle de la fatigue de la zone sélectionnée */}
        {selectedZone && (
          <div className="mt-4 p-3 bg-gray-700 rounded border border-green-500/30">
            <label className="block text-sm text-gray-300 mb-2">
              Fatigue {selectedZone.replace('_', ' ')}: <span className="text-green-400 font-bold">{muscleFatigue[selectedZone] || 0}/10</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={muscleFatigue[selectedZone] || 0}
              onChange={(e) => setMuscleFatigue(prev => ({
                ...prev,
                [selectedZone]: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Inconforts */}
      <div className="bg-gray-800/30 p-4 rounded-lg border border-green-500/20">
        <h3 className="flex items-center gap-2 text-green-300 font-bold mb-3">
          <Frown size={18} />
          Inconforts ou douleurs
        </h3>
        <div className="space-y-2">
          {discomfortOptions.map(option => (
            <button
              key={option}
              onClick={() => setDiscomforts(prev => 
                prev.includes(option) 
                  ? prev.filter(d => d !== option)
                  : [...prev, option]
              )}
              className={`block w-full text-left px-3 py-2 rounded transition ${
                discomforts.includes(option)
                  ? 'bg-red-500/30 border border-red-500 text-red-300'
                  : 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Notes supplémentaires */}
      <div className="bg-gray-800/30 p-4 rounded-lg border border-green-500/20">
        <label className="block text-green-300 font-bold mb-2">Notes supplémentaires</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Comment vous sentez-vous ? Avez-vous bien dormi ? Des observations ?"
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
        />
      </div>

      {/* Bouton de sauvegarde */}
      <button
        onClick={handleSaveState}
        className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-lg transition transform active:scale-95 flex items-center justify-center gap-2"
      >
        <Heart size={20} />
        Enregistrer mon état du corps
      </button>
    </div>
  );
};

export default BodyStateTracker;
