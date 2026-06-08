import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { AppHeader } from '../../components/AppHeader';
import { LoadingScreen } from '../../components/LoadingScreen';
import { usePostos } from '../../hooks/usePostos';
import { useTheme } from '../../hooks/useTheme';

export function MapaScreen({ navigation }) {
  const { postos, loading } = usePostos();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  function gerarHtmlMapa() {
    const postosJson = JSON.stringify(postos);
    const bg = colors.mode === 'dark' ? '#020617' : '#F8FAFC';
    const surface = colors.mode === 'dark' ? '#0F172A' : '#FFFFFF';
    const text = colors.mode === 'dark' ? '#F8FAFC' : '#0F172A';
    const textSecondary = colors.mode === 'dark' ? '#94A3B8' : '#64748B';
    const primary = colors.primary;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

          <style>
            html, body, #map {
              height: 100%;
              width: 100%;
              margin: 0;
              padding: 0;
              background: ${bg};
            }

            .leaflet-popup-content-wrapper {
              background: ${surface};
              color: ${text};
              border-radius: 12px;
            }

            .leaflet-popup-tip {
              background: ${surface};
            }

            .popup-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 4px;
              color: ${text};
            }

            .popup-text {
              font-size: 13px;
              margin-bottom: 4px;
              color: ${textSecondary};
            }

            .popup-price {
              font-size: 13px;
              font-weight: bold;
              color: ${primary};
              margin-top: 6px;
            }

            .popup-button {
              background: ${primary};
              color: ${colors.mode === 'dark' ? '#000000' : '#FFFFFF'};
              border: none;
              border-radius: 8px;
              padding: 8px 10px;
              font-size: 13px;
              font-weight: bold;
              margin-top: 8px;
              width: 100%;
            }
          </style>
        </head>

        <body>
          <div id="map"></div>

          <script>
            const postos = ${postosJson};

            const centro = postos.length > 0
              ? [postos[0].latitude, postos[0].longitude]
              : [-8.2335, -35.7962];

            const map = L.map('map').setView(centro, 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap'
            }).addTo(map);

            postos.forEach((posto) => {
              if (!posto.latitude || !posto.longitude) return;

              const marker = L.marker([posto.latitude, posto.longitude]).addTo(map);

              marker.bindPopup(\`
                <div>
                  <div class="popup-title">\${posto.nome}</div>
                  <div class="popup-text">\${posto.endereco}</div>
                  <div class="popup-price">Gasolina: \${posto.gasolina ? 'R$ ' + posto.gasolina : '-'}</div>
                  <div class="popup-price">Etanol: \${posto.etanol ? 'R$ ' + posto.etanol : '-'}</div>
                  <button class="popup-button" onclick="abrirDetalhes('\${posto.id}')">
                    Ver detalhes
                  </button>
                </div>
              \`);
            });

            function abrirDetalhes(id) {
              const posto = postos.find((item) => item.id === id);

              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'ABRIR_DETALHES',
                posto
              }));
            }
          </script>
        </body>
      </html>
    `;
  }

  function receberMensagem(event) {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'ABRIR_DETALHES') {
        navigation.navigate('DetalhesPosto', {
          posto: data.posto,
        });
      }
    } catch (error) {
      console.log('Erro ao receber mensagem do mapa:', error);
    }
  }

  if (loading) {
    return <LoadingScreen message="Carregando mapa..." />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <AppHeader
          title="Mapa"
          subtitle="Veja os postos próximos usando OpenStreetMap."
        />
      </View>

      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: gerarHtmlMapa() }}
          style={styles.webview}
          onMessage={receberMensagem}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Toque em um marcador e depois em “Ver detaAA
          lhes”.
        </Text>
      </View>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    headerArea: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },

    mapContainer: {
      flex: 1,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 18,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },

    webview: {
      flex: 1,
      backgroundColor: colors.background,
    },

    infoBox: {
      position: 'absolute',
      left: 28,
      right: 28,
      bottom: 28,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },

    infoTitle: {
      fontSize: 15,
      fontWeight: '900',
      color: colors.text,
    },

    infoText: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textSecondary,
    },
  });
}