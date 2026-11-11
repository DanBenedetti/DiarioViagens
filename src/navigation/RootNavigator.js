import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import ListaScreen from '../screens/ListaScreen';
import CadastroScreen from '../screens/CadastroScreen';
import DetalhesScreen from '../screens/DetalhesScreen';
import MapaScreen from '../screens/MapaScreen';
import EstatisticasScreen from '../screens/EstatisticasScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ICONES = { Lista: '🗒️', Mapa: '🗺️', Estatisticas: '📊' };

// Abas principais do app: Lista, Mapa e Estatísticas.
function AbasPrincipais() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ size }) => <Text style={{ fontSize: size - 4 }}>{ICONES[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Lista" component={ListaScreen} options={{ title: 'Lugares' }} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Estatisticas" component={EstatisticasScreen} options={{ title: 'Estatísticas' }} />
    </Tab.Navigator>
  );
}

// Pilha de navegação sobre as abas: Cadastro e Detalhes.
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '600' },
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Inicio" component={AbasPrincipais} options={{ headerShown: false }} />
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={({ route }) => ({ title: route.params?.id ? 'Editar lugar' : 'Novo lugar' })}
        />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes do lugar' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
