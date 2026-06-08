import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabs } from './MainTabs';
import { AuthNavigator } from './AuthNavigator';

import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { AdminPostosScreen } from '../screens/admin/AdminPostosScreen';
import { AdminUsuariosScreen } from '../screens/admin/AdminUsuariosScreen';
import { AdminNoticiasScreen } from '../screens/admin/AdminNoticiasScreen';

import { DetalhesPostoScreen } from '../screens/app/DetalhesPostoScreen';
import { MeuPostoScreen } from '../screens/app/MeuPostoScreen';
import { AtualizarPrecosScreen } from '../screens/app/AtualizarPrecosScreen';
import { CadastrarPostoScreen } from '../screens/app/CadastrarPostoScreen';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { estaLogado } = useAuth();
  const { colors, isDarkMode } = useTheme();

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '800',
            color: colors.text,
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {!estaLogado ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="DetalhesPosto"
              component={DetalhesPostoScreen}
              options={{ title: 'Detalhes do posto' }}
            />

            <Stack.Screen
              name="MeuPosto"
              component={MeuPostoScreen}
              options={{ title: 'Meu Posto' }}
            />

            <Stack.Screen
              name="CadastrarPosto"
              component={CadastrarPostoScreen}
              options={{ title: 'Cadastrar Posto' }}
            />

            <Stack.Screen
              name="AtualizarPrecos"
              component={AtualizarPrecosScreen}
              options={{ title: 'Atualizar Preços' }}
            />

            <Stack.Screen
              name="AdminHome"
              component={AdminHomeScreen}
              options={{ title: 'Painel Admin' }}
            />

            <Stack.Screen
              name="AdminPostos"
              component={AdminPostosScreen}
              options={{ title: 'Gerenciar Postos' }}
            />

            <Stack.Screen
              name="AdminUsuarios"
              component={AdminUsuariosScreen}
              options={{ title: 'Gerenciar Usuários' }}
            />

            <Stack.Screen
              name="AdminNoticias"
              component={AdminNoticiasScreen}
              options={{ title: 'Gerenciar Notícias' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}