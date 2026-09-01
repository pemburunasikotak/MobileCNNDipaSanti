import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import DetailScreen from './src/screens/DetailScreen';

type Screen = 'splash' | 'home' | 'scan' | 'detail';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f19" />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [screenParams, setScreenParams] = useState<any>(null);
  const [history, setHistory] = useState<Screen[]>([]);
  const safeAreaInsets = useSafeAreaInsets();

  const navigateTo = (screen: Screen, params?: any) => {
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
    if (params) {
      setScreenParams(params);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevScreen = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={() => setCurrentScreen('home')} />;
      case 'home':
        return <HomeScreen onNavigate={navigateTo} />;
      case 'scan':
        return <ScanScreen onNavigate={navigateTo} onBack={handleBack} />;
      case 'detail':
        return (
          <DetailScreen
            fishId={screenParams?.fishId || 'kembung'}
            onBack={handleBack}
            onNavigate={navigateTo}
          />
        );
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
});

export default App;

