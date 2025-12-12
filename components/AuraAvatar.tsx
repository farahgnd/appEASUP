
import React from 'react';

interface EasupAvatarProps {
  score: number;
}

const EasupAvatar: React.FC<EasupAvatarProps> = ({ score }) => {
  // Score affects color, glow intensity, and animation speed
  const hue = score * 1.2; // 0-100 -> 0-120 (Red to Green)
  const glowOpacity = 0.2 + (score / 100) * 0.8;
  const pulseDuration = 3 - (score / 100) * 2; // Faster pulse for higher score
  const size = 150 + (score / 100) * 50;

  const auraStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: `hsl(${hue}, 80%, 50%)`,
    boxShadow: `
      0 0 20px 5px hsl(${hue}, 80%, 50%, ${glowOpacity}),
      0 0 40px 15px hsl(${hue}, 80%, 60%, ${glowOpacity * 0.7}),
      0 0 80px 30px hsl(${hue}, 80%, 70%, ${glowOpacity * 0.4})
    `,
    animation: `pulse ${pulseDuration}s infinite ease-in-out`,
  };

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="relative flex items-center justify-center">
        <div 
          className="rounded-full transition-all duration-1000 ease-out"
          style={auraStyle}
        >
          <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-sm"></div>
        </div>
        <div className="absolute flex flex-col items-center text-white">
          <span className="font-orbitron text-5xl font-bold tracking-tighter drop-shadow-lg">{score}</span>
          <span className="text-sm uppercase tracking-widest text-green-300">EASUP Score</span>
        </div>
      </div>
       <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default EasupAvatar;
