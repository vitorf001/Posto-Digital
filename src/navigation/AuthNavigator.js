import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { CadastroScreen } from '../screens/auth/CadastroScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  const { colors } = useTheme();

  return (
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
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Cadastro"
        component={CadastroScreen}
        options={{
          title: 'Criar conta',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack.Navigator>
  );
}