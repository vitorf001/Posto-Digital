import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

import { AppHeader } from '../../components/AppHeader';
import { LoadingScreen } from '../../components/LoadingScreen';
import { usePostos } from '../../hooks/usePostos';
import { useTheme } from '../../hooks/useTheme';

export function MapaScreen({ navigation }) {
  const { postos, loading } = usePostos();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [localizacaoUsuario, setLocalizacaoUsuario] = useState(null);
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(true);
  const [postosOsm, setPostosOsm] = useState([]);
  const [buscandoOsm, setBuscandoOsm] = useState(false);

  async function carregarLocalizacaoUsuario() {
    try {
      setBuscandoLocalizacao(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à localização para buscar postos próximos.'
        );

        setLocalizacaoUsuario({
          latitude: -8.2335,
          longitude: -35.7962,
        });

        return;
      }

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocalizacaoUsuario({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      });
    } catch (error) {
      console.log('Erro ao buscar localização:', error.message);

      Alert.alert(
        'Erro',
        'Não foi possível obter sua localização. Usando localização padrão.'
      );

      setLocalizacaoUsuario({
        latitude: -8.2335,
        longitude: -35.7962,
      });
    } finally {
      setBuscandoLocalizacao(false);
    }
  }

  async function buscarPostosOpenStreetMapReactNative(localizacao) {
    if (!localizacao?.latitude || !localizacao?.longitude) {
      return;
    }

    try {
      setBuscandoOsm(true);

      const latitude = localizacao.latitude;
      const longitude = localizacao.longitude;

      const postosEncontrados = await buscarPostosNominatim(latitude, longitude);

      console.log(
        `Postos OpenStreetMap/Nominatim carregados: ${postosEncontrados.length}`
      );

      setPostosOsm(postosEncontrados);
    } catch (error) {
      console.log('Erro Nominatim/OpenStreetMap:', error.message);
      setPostosOsm([]);
    } finally {
      setBuscandoOsm(false);
    }
  }

  async function buscarPostosNominatim(latitude, longitude) {
    const delta = 0.08;

    const left = longitude - delta;
    const right = longitude + delta;
    const top = latitude + delta;
    const bottom = latitude - delta;

    const termos = [
      'posto de gasolina',
      'gas station',
      'combustível',
      'fuel',
    ];

    const resultados = [];

    for (const termo of termos) {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?format=jsonv2` +
        `&q=${encodeURIComponent(termo)}` +
        `&bounded=1` +
        `&viewbox=${left},${top},${right},${bottom}` +
        `&limit=20` +
        `&addressdetails=1`;

      try {
        console.log('OSM/Nominatim buscando:', termo);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'PostoDigitalFaculdade/1.0',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        data.forEach((item) => {
          resultados.push(item);
        });
      } catch (error) {
        console.log(`Erro buscando "${termo}":`, error.message);
      }
    }

    return removerDuplicadosNominatim(resultados)
      .map(formatarPostoNominatim)
      .filter(Boolean);
  }

  function removerDuplicadosNominatim(itens) {
    const mapa = {};

    itens.forEach((item) => {
      const chave = `${item.osm_type}-${item.osm_id}`;
      mapa[chave] = item;
    });

    return Object.values(mapa);
  }

  function formatarPostoNominatim(item) {
    const lat = Number(item.lat);
    const lon = Number(item.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return null;
    }

    const address = item.address || {};

    const nome =
      item.name ||
      address.fuel ||
      address.amenity ||
      item.display_name?.split(',')[0] ||
      'Posto de combustível';

    const rua = address.road || address.street || '';
    const bairro = address.suburb || address.neighbourhood || '';
    const cidade =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      '';

    const enderecoPartes = [rua, bairro, cidade].filter(Boolean);

    return {
      id: `osm-${item.osm_type}-${item.osm_id}`,
      nome,
      endereco:
        enderecoPartes.length > 0
          ? enderecoPartes.join(' - ')
          : item.display_name || 'Endereço não informado',
      telefone: '',
      operador: item.type || 'OpenStreetMap',
      horario: '',
      gasolina: null,
      etanol: null,
      diesel: null,
      status: 'openstreetmap',
      latitude: lat,
      longitude: lon,
    };
  }

  useEffect(() => {
    carregarLocalizacaoUsuario();
  }, []);

  useEffect(() => {
    if (localizacaoUsuario) {
      buscarPostosOpenStreetMapReactNative(localizacaoUsuario);
    }
  }, [localizacaoUsuario]);

  function gerarHtmlMapa() {
    const postosJson = JSON.stringify(postos || []);
    const postosOsmJson = JSON.stringify(postosOsm || []);

    const centroMapa = {
      latitude: localizacaoUsuario?.latitude || -8.2335,
      longitude: localizacaoUsuario?.longitude || -35.7962,
    };

    const usuarioJson = JSON.stringify(centroMapa);

    const isDark = colors.mode === 'dark';

    const background = isDark ? '#020617' : '#F8FAFC';
    const surface = isDark ? '#0F172A' : '#FFFFFF';
    const text = isDark ? '#F8FAFC' : '#0F172A';
    const textSecondary = isDark ? '#94A3B8' : '#64748B';
    const primary = colors.primary;
    const buttonText = isDark ? '#000000' : '#FFFFFF';

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = isDark
      ? '&copy; OpenStreetMap &copy; CARTO'
      : '&copy; OpenStreetMap';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
          />

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
              background: ${background};
              font-family: Arial, sans-serif;
            }

            .leaflet-popup-content-wrapper {
              background: ${surface};
              color: ${text};
              border-radius: 14px;
            }

            .leaflet-popup-tip {
              background: ${surface};
            }

            .popup {
              min-width: 220px;
              max-width: 280px;
              background: ${surface};
              color: ${text};
            }

            .popup-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 4px;
              color: ${text};
            }

            .popup-text {
              font-size: 13px;
              color: ${textSecondary};
              margin-bottom: 6px;
              line-height: 18px;
            }

            .popup-price {
              font-size: 13px;
              font-weight: bold;
              color: ${primary};
              margin-top: 5px;
            }

            .popup-badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 999px;
              font-size: 11px;
              font-weight: bold;
              margin-bottom: 8px;
              background: ${primary};
              color: ${buttonText};
            }

            .popup-badge-osm {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 999px;
              font-size: 11px;
              font-weight: bold;
              margin-bottom: 8px;
              background: #F59E0B;
              color: #000000;
            }

            .popup-button {
              background: ${primary};
              color: ${buttonText};
              border: none;
              border-radius: 8px;
              padding: 9px 10px;
              font-size: 13px;
              font-weight: bold;
              margin-top: 10px;
              width: 100%;
            }

            .marker-user {
              width: 18px;
              height: 18px;
              border-radius: 999px;
              background: #2563EB;
              border: 3px solid #FFFFFF;
              box-shadow: 0 0 8px rgba(37, 99, 235, 0.6);
            }

            .marker-sistema {
              width: 30px;
              height: 30px;
              border-radius: 999px;
              background: ${primary};
              color: ${buttonText};
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              border: 2px solid #FFFFFF;
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            }

            .marker-osm {
              width: 30px;
              height: 30px;
              border-radius: 999px;
              background: #F59E0B;
              color: #000000;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              border: 2px solid #FFFFFF;
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            }
          </style>
        </head>

        <body>
          <div id="map"></div>

          <script>
            const postosSupabase = ${postosJson};
            const postosOsm = ${postosOsmJson};
            const localizacaoUsuario = ${usuarioJson};

            let map;
            let bounds;

            function enviarMensagem(payload) {
              try {
                window.ReactNativeWebView.postMessage(JSON.stringify(payload));
              } catch (error) {
                console.log("Erro ao enviar mensagem:", error);
              }
            }

            function iniciarMapa() {
              const centro = localizacaoUsuario
                ? [
                    Number(localizacaoUsuario.latitude),
                    Number(localizacaoUsuario.longitude)
                  ]
                : [-8.2335, -35.7962];

              map = L.map('map').setView(centro, 15);

              L.tileLayer('${tileUrl}', {
                maxZoom: 19,
                attribution: '${attribution}',
              }).addTo(map);

              bounds = L.latLngBounds([]);

              adicionarMarcadorUsuario(centro);
              adicionarPostosDoSistema();
              adicionarPostosOpenStreetMap();

              ajustarMapa();
            }

            function adicionarMarcadorUsuario(centro) {
              const userIcon = L.divIcon({
                className: '',
                html: '<div class="marker-user"></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              });

              const marker = L.marker(centro, { icon: userIcon }).addTo(map);

              marker.bindPopup(\`
                <div class="popup">
                  <div class="popup-title">Sua localização</div>
                  <div class="popup-text">Ponto usado para buscar postos próximos.</div>
                </div>
              \`);

              bounds.extend(centro);
            }

            function adicionarPostosDoSistema() {
              const sistemaIcon = L.divIcon({
                className: '',
                html: '<div class="marker-sistema">P</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              });

              const postosComLocalizacao = postosSupabase.filter((posto) => {
                return posto.latitude && posto.longitude;
              });

              postosComLocalizacao.forEach((posto) => {
                const position = [
                  Number(posto.latitude),
                  Number(posto.longitude),
                ];

                const marker = L.marker(position, { icon: sistemaIcon }).addTo(map);

                marker.bindPopup(\`
                  <div class="popup">
                    <div class="popup-badge">Posto cadastrado</div>
                    <div class="popup-title">\${posto.nome || 'Posto'}</div>
                    <div class="popup-text">\${posto.endereco || 'Endereço não informado'}</div>

                    <div class="popup-price">
                      Gasolina: \${posto.gasolina ? 'R$ ' + posto.gasolina : '-'}
                    </div>

                    <div class="popup-price">
                      Etanol: \${posto.etanol ? 'R$ ' + posto.etanol : '-'}
                    </div>

                    <div class="popup-price">
                      Diesel: \${posto.diesel ? 'R$ ' + posto.diesel : '-'}
                    </div>

                    <button class="popup-button" onclick="abrirDetalhesSistema('\${posto.id}')">
                      Ver detalhes
                    </button>
                  </div>
                \`);

                bounds.extend(position);
              });
            }

            function adicionarPostosOpenStreetMap() {
              const osmIcon = L.divIcon({
                className: '',
                html: '<div class="marker-osm">O</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              });

              postosOsm.forEach((posto) => {
                if (!posto.latitude || !posto.longitude) {
                  return;
                }

                const position = [
                  Number(posto.latitude),
                  Number(posto.longitude),
                ];

                const marker = L.marker(position, { icon: osmIcon }).addTo(map);

                marker.bindPopup(\`
                  <div class="popup">
                    <div class="popup-badge-osm">OpenStreetMap</div>
                    <div class="popup-title">\${posto.nome || 'Posto de combustível'}</div>
                    <div class="popup-text">\${posto.endereco || 'Endereço não informado'}</div>

                    \${posto.operador ? '<div class="popup-text">Origem: ' + posto.operador + '</div>' : ''}
                    \${posto.telefone ? '<div class="popup-text">Telefone: ' + posto.telefone + '</div>' : ''}
                    \${posto.horario ? '<div class="popup-text">Horário: ' + posto.horario + '</div>' : ''}

                    <div class="popup-price">Preços não informados pelo OpenStreetMap</div>

                    <button class="popup-button" onclick="abrirDetalhesOSM('\${posto.id}')">
                      Ver informações
                    </button>
                  </div>
                \`);

                bounds.extend(position);
              });
            }

            function abrirDetalhesSistema(id) {
              const posto = postosSupabase.find((item) => item.id === id);

              enviarMensagem({
                type: 'ABRIR_DETALHES_SISTEMA',
                posto,
              });
            }

            function abrirDetalhesOSM(id) {
              const posto = postosOsm.find((item) => item.id === id);

              enviarMensagem({
                type: 'ABRIR_DETALHES_OSM',
                posto,
              });
            }

            function ajustarMapa() {
              if (bounds && bounds.isValid()) {
                map.fitBounds(bounds, {
                  padding: [30, 30],
                });
              }
            }

            iniciarMapa();
          </script>
        </body>
      </html>
    `;
  }

  function receberMensagem(event) {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'ABRIR_DETALHES_SISTEMA') {
        navigation.navigate('DetalhesPosto', {
          posto: data.posto,
        });
      }

      if (data.type === 'ABRIR_DETALHES_OSM') {
        navigation.navigate('DetalhesPosto', {
          posto: data.posto,
        });
      }
    } catch (error) {
      console.log('Erro ao receber mensagem do mapa:', error.message);
    }
  }

  if (loading || buscandoLocalizacao || !localizacaoUsuario) {
    return <LoadingScreen message="Buscando postos próximos..." />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <AppHeader
          title="Mapa"
          subtitle={
            buscandoOsm
              ? 'Buscando postos próximos no OpenStreetMap...'
              : 'Veja postos cadastrados e postos próximos no mapa.'
          }
        />
      </View>

      <View style={styles.mapContainer}>
        <WebView
          key={`${postos?.length || 0}-${postosOsm.length}-${colors.mode}`}
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
        <Text style={styles.infoTitle}>Postos próximos</Text>
        <Text style={styles.infoText}>
          “P” são postos cadastrados no app. “O” são postos encontrados no OpenStreetMap.
        </Text>

        {buscandoOsm ? (
          <Text style={styles.infoTextSmall}>Buscando postos reais...</Text>
        ) : (
          <Text style={styles.infoTextSmall}>
            Encontrados no OpenStreetMap: {postosOsm.length}
          </Text>
        )}
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

    infoTextSmall: {
      marginTop: 6,
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
    },
  });
}