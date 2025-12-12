import React, { useState, useEffect } from 'react';
import { Target, Activity, HeartPulse, BrainCircuit, Bot, Loader, ShieldPlus } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import type { Condition } from '../types';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { setCondition } = useHealthData();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string | null>(null);
  const [bioData, setBioData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate'
  });
  const [calibrationText, setCalibrationText] = useState("Initializing...");
  const [fade, setFade] = useState('animate-fade-in');

  const goals = [
    { id: 'strength', name: 'Build Strength', icon: <HeartPulse size={32} /> },
    { id: 'endurance', name: 'Improve Endurance', icon: <Activity size={32} /> },
    { id: 'wellness', name: 'Wellness Balance', icon: <BrainCircuit size={32} /> },
  ];
  
   const conditions = [
    { id: 'diabetes', name: 'Diabetes', description: 'Personalized meal and activity tracking.' },
    { id: 'hypertension', name: 'Hypertension', description: 'Guidance on diet and stress management.' },
    { id: 'none', name: 'None of these', description: 'General health and fitness tracking.' },
  ];

  const handleBioDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBioData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setFade('animate-fade-out');
    setTimeout(() => {
        setStep(prev => prev + 1);
        setFade('animate-fade-in');
    }, 300);
  };
  
  const handleConditionSelect = (selectedCondition: Condition) => {
    setCondition(selectedCondition);
    nextStep();
  };

  useEffect(() => {
    if (step === 5) {
      const texts = [
        "Calibrating Bio-Metrics...",
        "Syncing Neural Pathways...",
        "Generating Personal Aura...",
        "EASUP AI is Ready.",
      ];
      let i = 0;
      const interval = setInterval(() => {
        setCalibrationText(texts[i]);
        i++;
        if (i === texts.length) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step, onComplete]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <Bot size={64} className="mx-auto text-green-400 mb-4" />
            <h1 className="text-3xl font-orbitron text-white mb-2">Welcome to EASUP</h1>
            <p className="text-gray-300 max-w-xs mx-auto">Your personal AI health partner for peak performance and well-being.</p>
            <button onClick={nextStep} className="mt-8 w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-400 transition transform active:scale-95">Begin Initialization</button>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="text-center mb-8">
                <Target size={48} className="mx-auto text-green-400 mb-4" />
                <h2 className="text-2xl font-orbitron text-white">Select Your Primary Mission</h2>
                <p className="text-gray-400 text-sm">This helps your AI tailor its guidance.</p>
            </div>
            <div className="space-y-4">
                {goals.map(g => (
                    <button 
                        key={g.id} 
                        onClick={() => { setGoal(g.id); nextStep(); }}
                        className="w-full p-4 bg-gray-800/50 border-2 border-gray-700 rounded-lg flex items-center gap-4 text-left hover:border-green-400 transition"
                    >
                        {g.icon}
                        <span className="text-lg font-semibold text-white">{g.name}</span>
                    </button>
                ))}
            </div>
          </div>
        );
      case 3:
        const isBioDataValid = bioData.age && bioData.weight && bioData.height;
        return (
          <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-orbitron text-white">Bio-Metric Calibration</h2>
                <p className="text-gray-400 text-sm">Enter your details for personalization.</p>
            </div>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (isBioDataValid) nextStep(); }}>
                <div className="relative">
                    <label htmlFor="age" className="absolute -top-2 left-3 px-1 bg-gray-900 text-green-400 text-xs font-semibold">Age</label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        min="1"
                        value={bioData.age}
                        onChange={handleBioDataChange}
                        placeholder="e.g., 28"
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                    />
                </div>
                <div className="relative">
                    <label htmlFor="weight" className="absolute -top-2 left-3 px-1 bg-gray-900 text-green-400 text-xs font-semibold">Weight (kg)</label>
                    <input
                        id="weight"
                        name="weight"
                        type="number"
                        min="1"
                        value={bioData.weight}
                        onChange={handleBioDataChange}
                        placeholder="e.g., 75"
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                    />
                </div>
                <div className="relative">
                    <label htmlFor="height" className="absolute -top-2 left-3 px-1 bg-gray-900 text-green-400 text-xs font-semibold">Height (cm)</label>
                    <input
                        id="height"
                        name="height"
                        type="number"
                        min="1"
                        value={bioData.height}
                        onChange={handleBioDataChange}
                        placeholder="e.g., 180"
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                    />
                </div>
                <div className="relative">
                    <label htmlFor="activityLevel" className="absolute -top-2 left-3 px-1 bg-gray-900 text-green-400 text-xs font-semibold">Activity Level</label>
                    <select
                        id="activityLevel"
                        name="activityLevel"
                        value={bioData.activityLevel}
                        onChange={handleBioDataChange}
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition appearance-none"
                    >
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Lightly Active</option>
                        <option value="moderate">Moderately Active</option>
                        <option value="very">Very Active</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={!isBioDataValid}
                    className="mt-8 w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-400 transition transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Finalize Calibration
                </button>
            </form>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="text-center mb-8">
                <ShieldPlus size={48} className="mx-auto text-green-400 mb-4" />
                <h2 className="text-2xl font-orbitron text-white">Health Conditions</h2>
                <p className="text-gray-400 text-sm">Select any conditions you manage. This allows for safer and more effective personalization. You can change this later.</p>
            </div>
            <div className="space-y-4">
                {conditions.map(c => (
                    <button 
                        key={c.id} 
                        onClick={() => handleConditionSelect(c.id as Condition)}
                        className="w-full p-4 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-left hover:border-green-400 transition"
                    >
                        <span className="text-lg font-semibold text-white">{c.name}</span>
                        <p className="text-sm text-gray-400 mt-1">{c.description}</p>
                    </button>
                ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center">
            <Loader size={64} className="mx-auto text-green-400 mb-6 animate-spin" />
            <h2 className="text-2xl font-orbitron text-white mb-2">Calibrating...</h2>
            <p className="text-gray-300 font-mono transition-opacity duration-500">{calibrationText}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 relative z-10">
      <div className={`w-full max-w-sm ${fade} transition-opacity duration-300`}>
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingScreen;