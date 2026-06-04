import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { supabase } from '../services/supabase';

export default function MapaScreen() {
  const [localizacao, setLocalizacao] = useState(null);
  const [postos, setPostos] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErro('Permissão de localização negada!');
        return;
      }
      const posicao = await Location.getCurrentPositionAsync({});
      setLocalizacao({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      });
    }

    async function buscarPostos() {
      const { data, error } = await supabase
        .from('postos')
        .select('*, combustiveis(*)')
        .eq('aprovado', true);
      if (!error) setPostos(data || []);
    }

    obterLocalizacao();
    buscarPostos();
  }, []);

  if (erro) return <View style={styles.centro}><Text>{erro}</Text></View>;

  if (!localizacao) return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color="#f4a500" />
      <Text style={styles.texto}>Obtendo localização...</Text>
    </View>
  );

  const marcadores = postos.map(posto => {
    const precos = posto.combustiveis
      .map(c => `${c.tipo}: R$ ${Number(c.preco).toFixed(2)}`)
      .join('<br>');
    const nome = posto.nome.replace(/'/g, "\\'");
    const endereco = posto.endereco.replace(/'/g, "\\'");
    return `
      L.marker([${posto.latitude}, ${posto.longitude}], { icon: postoIcon })
        .addTo(map)
        .bindPopup("<b>${nome}</b><br>${endereco}<br><br>${precos}");
    `;
  }).join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; font-family: sans-serif; }
        #map { width: 100vw; height: 100vh; }
        .leaflet-popup-content { font-size: 14px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${localizacao.latitude}, ${localizacao.longitude}], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        var postoIcon = L.divIcon({
          html: '<div style="background:#f4a500;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">⛽</div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
          className: ''
        });

        L.marker([${localizacao.latitude}, ${localizacao.longitude}])
          .addTo(map)
          .bindPopup("<b>Você está aqui!</b>")
          .openPopup();

        ${marcadores}
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.mapa}
        javaScriptEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapa: { flex: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  texto: { marginTop: 10, color: '#666' }
});