import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export interface BodyZone {
  id: string;
  name: string;
  label: string;
  intensity: number; // 0-100
  color: string;
  x: number;
  y: number;
}

interface InteractiveBodyProps {
  zones: BodyZone[];
  onZoneClick?: (zoneId: string) => void;
  gender?: 'male' | 'female';
}

const InteractiveBody: React.FC<InteractiveBodyProps> = ({ 
  zones, 
  onZoneClick, 
  gender = 'male' 
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const getZoneColor = (intensity: number) => {
    if (intensity === 0) return '#4B5563';
    if (intensity < 30) return '#60A5FA';
    if (intensity < 60) return '#FBBF24';
    return '#EF4444';
  };

  const zoneMap: { [key: string]: BodyZone } = {};
  zones.forEach(z => {
    zoneMap[z.id] = z;
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <svg 
        viewBox="0 0 100 200" 
        className="w-full max-w-xs h-auto"
        style={{ maxHeight: '400px' }}
      >
        {/* Head */}
        <circle 
          cx="50" 
          cy="15" 
          r="8" 
          fill={getZoneColor(zoneMap['head']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('head')}
          onMouseEnter={() => setHoveredZone('head')}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Chest */}
        <ellipse 
          cx="50" 
          cy="40" 
          rx="12" 
          ry="15" 
          fill={getZoneColor(zoneMap['chest']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('chest')}
          onMouseEnter={() => setHoveredZone('chest')}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Left Shoulder */}
        <circle 
          cx="35" 
          cy="32" 
          r="5" 
          fill={getZoneColor(zoneMap['left_shoulder']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('left_shoulder')}
          onMouseEnter={() => setHoveredZone('left_shoulder')}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Right Shoulder */}
        <circle 
          cx="65" 
          cy="32" 
          r="5" 
          fill={getZoneColor(zoneMap['right_shoulder']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('right_shoulder')}
          onMouseEnter={() => setHoveredZone('right_shoulder')}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Left Arm */}
        <rect 
          x="28" 
          y="38" 
          width="5" 
          height="25" 
          fill={getZoneColor(zoneMap['left_arm']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('left_arm')}
          onMouseEnter={() => setHoveredZone('left_arm')}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Right Arm */}
        <rect 
          x="67" 
          y="38" 
          width="5" 
          height="25" 
          fill={getZoneColor(zoneMap['right_arm']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('right_arm')}
          onMouseEnter={() => setHoveredZone('right_arm')}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Abdomen */}
        <rect 
          x="42" 
          y="56" 
          width="16" 
          height="15" 
          fill={getZoneColor(zoneMap['abdomen']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('abdomen')}
          onMouseEnter={() => setHoveredZone('abdomen')}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Left Leg */}
        <rect 
          x="44" 
          y="75" 
          width="5" 
          height="30" 
          fill={getZoneColor(zoneMap['left_leg']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('left_leg')}
          onMouseEnter={() => setHoveredZone('left_leg')}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Right Leg */}
        <rect 
          x="51" 
          y="75" 
          width="5" 
          height="30" 
          fill={getZoneColor(zoneMap['right_leg']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('right_leg')}
          onMouseEnter={() => setHoveredZone('right_leg')}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Back (lower) */}
        <rect 
          x="42" 
          y="72" 
          width="16" 
          height="12" 
          fill={getZoneColor(zoneMap['back']?.intensity || 0)}
          stroke="#22C55E"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80 transition"
          onClick={() => onZoneClick?.('back')}
          onMouseEnter={() => setHoveredZone('back')}
          onMouseLeave={() => setHoveredZone(null)}
        />
      </svg>

      {/* Legend */}
      <div className="mt-6 w-full max-w-xs text-xs text-gray-300 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-500"></div>
          <span>Not activated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-400"></div>
          <span>Light (1-30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-400"></div>
          <span>Moderate (30-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>Intense (60-100%)</span>
        </div>
      </div>

      {/* Hovered zone info */}
      {hoveredZone && zoneMap[hoveredZone] && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-sm text-green-300 text-center">
          {zoneMap[hoveredZone].label}: {zoneMap[hoveredZone].intensity}%
        </div>
      )}
    </div>
  );
};

export default InteractiveBody;
