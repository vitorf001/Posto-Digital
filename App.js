import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './src/services/supabase';
import MapaScreen from './src/screens/MapaScreen';
import ListaScreen from './src/screens/ListaScreen';
import NoticiasScreen from './src/screens/NoticiasScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';
import CalculadoraScreen from './src/screens/CalculadoraScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import MeuPostoScreen from './src/screens/MeuPostoScreen';
import AtualizarPrecosScreen from './src/screens/AtualizarPrecosScreen';
import AdminScreen from './src/screens/AdminScreen';
import AdminPostosScreen from './src/screens/AdminPostosScreen';
import AdminNoticiasScreen from './src/screens/AdminNoticiasScreen';
import AdminUsuariosScreen from './src/screens/AdminUsuariosScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PostosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Lista" component={ListaScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes do Posto' }} />
    </Stack.Navigator>
  );
}

function CalculadoraStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CalculadoraHome" component={CalculadoraScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function PerfilStack({ session, tipoUsuario }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PerfilHome" options={{ headerShown: false }}>
        {props => <PerfilScreen {...props} session={session} tipoUsuario={tipoUsuario} />}
      </Stack.Screen>
      <Stack.Screen name="MeuPosto" options={{ title: 'Meu Posto' }}>
        {props => <MeuPostoScreen {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="AtualizarPrecos" options={{ title: 'Atualizar Preços' }}>
        {props => <AtualizarPrecosScreen {...props} session={session} />}
      </Stack.Screen>
      <Stack.Screen name="Admin" options={{ title: 'Painel Admin' }}>
        {props => <AdminScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="AdminPostos" options={{ title: 'Gerenciar Postos' }}>
        {props => <AdminPostosScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="AdminNoticias" options={{ title: 'Gerenciar Notícias' }}>
        {props => <AdminNoticiasScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="AdminUsuarios" options={{ title: 'Gerenciar Usuários' }}>
        {props => <AdminUsuariosScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) await buscarTipoUsuario(session.user.id);
      setCarregando(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) await buscarTipoUsuario(session.user.id);
      else setTipoUsuario(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function buscarTipoUsuario(userId) {
    const { data } = await supabase.from('usuarios').select('tipo').eq('id', userId).single();
    if (data) setTipoUsuario(data.tipo);
  }

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#f4a500" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Mapa" component={MapaScreen} />
        <Tab.Screen name="Postos" component={PostosStack} />
        <Tab.Screen name="Calculadora" component={CalculadoraStack} />
        <Tab.Screen name="Notícias" component={NoticiasScreen} />
        <Tab.Screen
          name="Perfil"
          children={() => session
            ? <PerfilStack session={session} tipoUsuario={tipoUsuario} />
            : <AuthStack />
          }
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}