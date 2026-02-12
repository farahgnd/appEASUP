
import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import CoachScreen from './screens/CoachScreen';
import NutritionScreen from './screens/NutritionScreen';
import ProfileScreen from './screens/ProfileScreen';
import CommunityScreen from './screens/CommunityScreen';
import DashboardScreen from './screens/DashboardScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AuthScreen from './screens/AuthScreen';
import BottomNav from './components/BottomNav';
import { HealthDataProvider } from './context/HealthDataContext';

export type Screen = 'Home' | 'Coach' | 'Nutrition' | 'Profile' | 'Community' | 'Dashboard';

type AppState = 'loading' | 'auth' | 'onboarding' | 'ready';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('Home');
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
  const initApp = async () => {
    const isAuthenticated =
      localStorage.getItem('easup_authenticated') === 'true';
    const userId = localStorage.getItem('easup_user_id');

    if (!isAuthenticated || !userId) {
      setAppState('auth');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost/appEASUP/API/check_profile.php?userId=${userId}`
      );
      const data = await res.json();

      if (data.exists) {
        setAppState('ready');        // ✅ profil déjà créé
      } else {
        setAppState('onboarding');   // ❌ pas encore de profil
      }
    } catch (e) {
      console.error(e);
      setAppState('auth');
    }
  };

  initApp();
}, []);


 const handleLoginSuccess = async (userId: number) => {
  localStorage.setItem('easup_authenticated', 'true');
  localStorage.setItem('easup_user_id', userId.toString());

  // Bypass API call - go directly to onboarding
  setAppState('onboarding');
};


  const handleOnboardingComplete = () => {
    localStorage.setItem('easup_onboarding_complete', 'true');
    setAppState('ready');
  };

  const handleLogout = () => {
    localStorage.removeItem('easup_authenticated');
    localStorage.removeItem('easup_onboarding_complete');
    localStorage.removeItem('easup_condition');
    setAppState('auth');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Dashboard':
        return <DashboardScreen />;
      case 'Coach':
        return <CoachScreen />;
      case 'Nutrition':
        return <NutritionScreen />;
      case 'Profile':
        return <ProfileScreen onLogout={handleLogout} />;
      case 'Community':
        return <CommunityScreen />;
      default:
        return <HomeScreen />;
    }
  };
  
  const renderContent = () => {
    switch(appState) {
      case 'loading':
        return <div className="h-full w-full bg-black flex items-center justify-center"></div>;
      case 'auth':
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
      case 'onboarding':
  const userId = Number(localStorage.getItem('easup_user_id'));
  return <OnboardingScreen onComplete={handleOnboardingComplete} loggedInUserId={userId} />;

      case 'ready':
        return (
          <>
            <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
              {renderScreen()}
            </main>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
          </>
        );
      default:
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
    }
  }

  return (
    <HealthDataProvider>
      <div className="h-screen w-screen bg-black overflow-hidden flex flex-col items-center justify-center">
        <div className="relative w-full max-w-md h-full md:h-[90vh] md:max-h-[800px] bg-gray-900 text-white overflow-hidden shadow-2xl shadow-green-500/10 md:rounded-3xl border border-gray-700/50 flex flex-col">
          <div 
            className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"
            // FIX: Cast style object to React.CSSProperties to allow CSS custom properties, resolving a TypeScript error.
            style={{
              '--grid-color': 'rgba(16, 185, 129, 0.5)',
              '--grid-size': '30px',
              backgroundSize: 'var(--grid-size) var(--grid-size)',
              backgroundImage: 'linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)',
            } as React.CSSProperties}
          ></div>
          
          {renderContent()}
        </div>
      </div>
    </HealthDataProvider>
  );
};

export default App;
