import React from 'react';
import { Home, MessageSquare, Apple, User, Users, BarChart3 } from 'lucide-react';
import type { Screen } from '../App';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: Screen;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex flex-col items-center justify-center h-full p-2 transition-all duration-300 ease-in-out transform ${
        isActive ? 'text-green-400' : 'text-gray-400 hover:text-white'
      }`}
    >
      <div className={`relative transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
        {icon}
        {isActive && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-green-400 rounded-full shadow-[0_0_10px_0_rgba(16,185,129,0.7)]"></div>
        )}
      </div>
      <span className={`text-xs mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems: { label: Screen; icon: React.ReactNode }[] = [
    { label: 'Home', icon: <Home size={26} /> },
    { label: 'Dashboard', icon: <BarChart3 size={26} /> },
    { label: 'Coach', icon: <MessageSquare size={26} /> },
    { label: 'Nutrition', icon: <Apple size={26} /> },
    { label: 'Profile', icon: <User size={26} /> },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-gray-900/50 backdrop-blur-lg border-t border-green-400/20 z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            isActive={activeScreen === item.label}
            onClick={() => setActiveScreen(item.label)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;