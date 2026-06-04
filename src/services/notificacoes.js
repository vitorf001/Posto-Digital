import * as Notifications from 'expo-notifications';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registrarPushToken(userId) {
  // Push token será configurado na versão de produção
  console.log('Push notifications disponíveis na versão publicada do app.');
}

export async function salvarNotificacao(userId, titulo, mensagem) {
  await supabase.from('notificacoes').insert({ usuario_id: userId, titulo, mensagem });
}

export async function enviarNotificacaoLocal(titulo, mensagem) {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.scheduleNotificationAsync({
      content: { title: titulo, body: mensagem, sound: true },
      trigger: null,
    });
  } catch (error) {
    console.log('Erro notificação local:', error);
  }
}