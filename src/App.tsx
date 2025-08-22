import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import WaterLevelDashboard from './components/WaterLevelDashboard';

type AppState = 'splash' | 'login' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppState>('splash');

  // Add debugging to track state changes
  useEffect(() => {
    console.log('App currentScreen changed to:', currentScreen);
  }, [currentScreen]);

  const handleSplashComplete = () => {
    console.log('SplashScreen onComplete called');
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    console.log('Login onLogin called');
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    console.log('Dashboard onLogout called');
    setCurrentScreen('login');
  };

  // Add debugging for what's being rendered
  console.log('App rendering, currentScreen:', currentScreen);

  return (
    <div className="app-container">
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      
      {currentScreen === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      
      {currentScreen === 'dashboard' && (
        <WaterLevelDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}