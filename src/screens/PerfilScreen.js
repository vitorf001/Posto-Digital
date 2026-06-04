import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../services/supabase';

export default function PerfilScreen({ session, navigation, tipoUsuario }) {
  async function sair() {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive',
        onPress: async () => await supabase.auth.signOut()
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icone}>⛽</Text>
        <Text style={styles.nome}>{session?.user?.email}</Text>
        <Text style={styles.tipo}>{tipoUsuario === 'admin' ? '👑 Administrador' : 'Dono de Posto'}</Text>
      </View>

      <View style={styles.menu}>
        {tipoUsuario === 'admin' && (
          <TouchableOpacity style={[styles.item, styles.itemAdmin]} onPress={() => navigation.navigate('Admin')}>
            <Text style={styles.itemTextoAdmin}>🛠️ Painel Administrativo</Text>
            <Text style={styles.itemSeta}>→</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('MeuPosto')}>
          <Text style={styles.itemTexto}>🏪 Meu Posto</Text>
          <Text style={styles.itemSeta}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AtualizarPrecos')}>
          <Text style={styles.itemTexto}>⛽ Atualizar Preços</Text>
          <Text style={styles.itemSeta}>→</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botaoSair} onPress={sair}>
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', alignItems: 'center', padding: 32, marginBottom: 12 },
  icone: { fontSize: 50, marginBottom: 12 },
  nome: { fontSize: 16, color: '#333', fontWeight: 'bold' },
  tipo: { fontSize: 13, color: '#f4a500', marginTop: 4 },
  menu: { backgroundColor: '#fff' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemAdmin: { backgroundColor: '#fff8ec' },
  itemTexto: { fontSize: 15, color: '#333', flex: 1 },
  itemTextoAdmin: { fontSize: 15, color: '#f4a500', fontWeight: 'bold', flex: 1 },
  itemSeta: { fontSize: 15, color: '#ccc' },
  botaoSair: { margin: 24, padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e74c3c', alignItems: 'center' },
  botaoSairTexto: { color: '#e74c3c', fontSize: 15, fontWeight: 'bold' },
});