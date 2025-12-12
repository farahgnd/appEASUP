
import React from 'react';
import { Flame, Dumbbell, BrainCircuit } from 'lucide-react';

interface RingProps {
  progress: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  value: number;
  goal: number;
  unit: string;
}

const Ring: React.FC<RingProps> = ({ progress, label, icon, color, value, goal, unit }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-gray-700/50"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 1.5s ease-out',
              filter: `drop-shadow(0 0 5px ${color})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center" style={{color}}>
          {icon}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-300">{label}</p>
        <p className="text-xs font-mono" style={{color}}>
          {value} / {goal} {unit}
        </p>
      </div>
    </div>
  );
};


interface MomentumRingsProps {
  summary: {
    calories: number;
    activity: number;
    protein: number;
  };
  goals: {
    calories: number;
    activity: number;
    protein: number;
  };
}

const MomentumRings: React.FC<MomentumRingsProps> = ({ summary, goals }) => {
  return (
    <div className="p-4 bg-gray-800/30 rounded-2xl">
        <h3 className="text-lg font-orbitron text-center mb-4 text-green-300 tracking-wider">Daily Momentum</h3>
        <div className="flex justify-around items-center">
        <Ring
            progress={(summary.calories / goals.calories) * 100}
            label="Fuel"
            icon={<Flame size={32} />}
            color="#ff4800"
            value={summary.calories}
            goal={goals.calories}
            unit="kcal"
        />
        <Ring
            progress={(summary.activity / goals.activity) * 100}
            label="Body"
            icon={<Dumbbell size={32} />}
            color="#10b981"
            value={summary.activity}
            goal={goals.activity}
            unit="min"
        />
        <Ring
            progress={(summary.protein / goals.protein) * 100}
            label="Build"
            icon={<BrainCircuit size={32} />}
            color="#00ff9d"
            value={summary.protein}
            goal={goals.protein}
            unit="g"
        />
        </div>
    </div>
  );
};

export default MomentumRings;
