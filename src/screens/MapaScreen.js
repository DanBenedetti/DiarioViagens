import React, { useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLugares } from '../context/LugaresContext';
import useLocation from '../hooks/useLocation';
import { colors, sombra } from '../theme';

// Região inicial usada quando não há lugares nem localização do usuário.
const REGIAO_PADRAO = { latitude: -20.5396, longitude: -47.4009, latitudeDelta: 25, longitudeDelta: 25 };

// Tela do mapa: marcador de cada lugar e a localização atual do usuário.
export default function MapaScreen({ navigation }) {
  const { lugares } = useLugares();
  const { location, error, loading, obterLocalizacao } = useLocation();
  const mapaRef = useRef(null);

  const regiaoInicial = useMemo(() => {
    if (location) return { ...location, latitudeDelta: 0.05, longitudeDelta: 0.05 };
    if (lugares.length > 0) {
      return {
        latitude: lugares[0].latitude,
        longitude: lugares[0].longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };
    }
    return REGIAO_PADRAO;
  }, [location, lugares]);

  function centralizarEmMim() {
    if (location && mapaRef.current) {
      mapaRef.current.animateToRegion({ ...location, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 600);
    } else {
      obterLocalizacao();
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapView
        ref={mapaRef}
        style={styles.mapa}
        initialRegion={regiaoInicial}
        showsUserLocation={Boolean(location)}
        showsMyLocationButton={false}
      >
        {lugares.map((lugar) => (
          <Marker
            key={lugar.id}
            coordinate={{ latitude: lugar.latitude, longitude: lugar.longitude }}
            title={lugar.nome}
            description={`${lugar.cidade}${lugar.estado ? `/${lugar.estado}` : ''}`}
            pinColor={lugar.status === 'visitado' ? colors.visitado : colors.quero}
            onPress={() => navigation.navigate('Detalhes', { id: lugar.id })}
          />
        ))}
      </MapView>

      <View style={styles.painel}>
        <Text style={styles.contador}>
          {lugares.length} {lugares.length === 1 ? 'marcador' : 'marcadores'}
        </Text>
        <Text style={styles.info} numberOfLines={2}>
          {error
            ? error
            : loading
              ? 'Obtendo sua localização...'
              : location
                ? 'Sua localização está no mapa.'
                : 'Localização indisponível.'}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.botaoLocal, pressed && { opacity: 0.85 }]}
        onPress={centralizarEmMim}
      >
        <Text style={styles.botaoTexto}>📍 Minha localização</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapa: { flex: 1 },
  painel: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...sombra,
  },
  contador: { fontSize: 14, fontWeight: '700', color: colors.text },
  info: { fontSize: 12, color: colors.muted, marginTop: 4 },
  botaoLocal: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...sombra,
  },
  botaoTexto: { fontSize: 13, fontWeight: '700', color: colors.primary },
});
