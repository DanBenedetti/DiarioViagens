import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LugaresProvider } from './src/context/LugaresContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';

// Componente raiz: provedores globais + navegação entre as telas.
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LugaresProvider>
          <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
          <RootNavigator />
        </LugaresProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
