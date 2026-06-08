import { Alert } from 'react-native';

export async function configurarNotificacoes() {
  return true;
}

export async function enviarNotificacaoLocal({ titulo, mensagem }) {
  Alert.alert(titulo, mensagem);
}