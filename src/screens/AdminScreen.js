import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../services/supabase';

export default function AdminScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarStats();
  }, []);

  async function buscarStats() {
    const [postos, pendentes, usuarios, noticias] = await Promise.all([
      supabase.from('postos').select('id', { count: 'exact' }).eq('aprovado', true),
      supabase.from('postos').select('id', { count: 'exact' }).eq('aprovado', false),
      supabase.from('usuarios').select('id', { count: 'exact' }),
      supabase.from('noticias').select('id', { count: 'exact' }).eq('ativo', true),
    ]);

    setStats({
      postos: postos.count || 0,
      pendentes: pendentes.count || 0,
      usuarios: usuarios.count || 0,
      noticias: noticias.count || 0,
    });
    setCarregando(false);
  }

  if (carregando) return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color="#f4a500" />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>🛠️ Painel Admin</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderTopColor: '#27ae60' }]}>
          <Text style={styles.statNumero}>{stats.postos}</Text>
          <Text style={styles.statLabel}>Postos Ativos</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#e74c3c' }]}>
          <Text style={styles.statNumero}>{stats.pendentes}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#3498db' }]}>
          <Text style={styles.statNumero}>{stats.usuarios}</Text>
          <Text style={styles.statLabel}>Usuários</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#f4a500' }]}>
          <Text style={styles.statNumero}>{stats.noticias}</Text>
          <Text style={styles.statLabel}>Notícias</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AdminPostos')}>
          <Text style={styles.itemTexto}>🏪 Gerenciar Postos</Text>
          {stats.pendentes > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{stats.pendentes}</Text>
            </View>
          )}
          <Text style={styles.itemSeta}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AdminNoticias')}>
          <Text style={styles.itemTexto}>📰 Gerenciar Notícias</Text>
          <Text style={styles.itemSeta}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AdminUsuarios')}>
          <Text style={styles.itemTexto}>👥 Gerenciar Usuários</Text>
          <Text style={styles.itemSeta}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 4, flex: 1, minWidth: '45%', alignItems: 'center', borderTopWidth: 4, elevation: 2 },
  statNumero: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#999', marginTop: 4 },
  menu: { backgroundColor: '#fff', marginTop: 12 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemTexto: { fontSize: 15, color: '#333', flex: 1 },
  itemSeta: { fontSize: 15, color: '#ccc' },
  badge: { backgroundColor: '#e74c3c', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  badgeTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});