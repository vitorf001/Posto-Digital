import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/app/HomeScreen';
import { ListaPostosScreen } from '../screens/app/ListaPostosScreen';
import { MapaScreen } from '../screens/app/MapaScreen';
import { NoticiasScreen } from '../screens/app/NoticiasScreen';
import { PerfilScreen } from '../screens/app/PerfilScreen';
import { CalculadoraScreen } from '../screens/app/CalculadoraScreen';
import { NotificacoesScreen } from '../screens/app/NotificacoesScreen';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';

          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'ListaPostos') iconName = 'list-outline';
          if (route.name === 'Mapa') iconName = 'map-outline';
          if (route.name === 'Calculadora') iconName = 'calculator-outline';
          if (route.name === 'Noticias') iconName = 'newspaper-outline';
          if (route.name === 'Notificacoes') iconName = 'notifications-outline';
          if (route.name === 'Perfil') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />

      <Tab.Screen
        name="ListaPostos"
        component={ListaPostosScreen}
        options={{ title: 'Postos' }}
      />

      <Tab.Screen
        name="Mapa"
        component={MapaScreen}
        options={{ title: 'Mapa' }}
      />

      <Tab.Screen
        name="Calculadora"
        component={CalculadoraScreen}
        options={{ title: 'Calcular' }}
      />

      <Tab.Screen
        name="Noticias"
        component={NoticiasScreen}
        options={{ title: 'Notícias' }}
      />

      <Tab.Screen
        name="Notificacoes"
        component={NotificacoesScreen}
        options={{ title: 'Avisos' }}
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}