import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Botao from '../components/Botao';
import StatusBadge from '../components/StatusBadge';
import { useLugares } from '../context/LugaresContext';
import { formatarEndereco } from '../utils/endereco';
import { colors, sombra } from '../theme';

// Detalhes do lugar: dados, foto, mini mapa e ações (editar, visitado, remover).
export default function DetalhesScreen({ route, navigation }) {
  const { buscarLugar, marcarComoVisitado, removerLugar } = useLugares();
  const lugar = buscarLugar(route.params.id);

  if (!lugar) {
    return (
      <View style={styles.vazio}>
        <Text style={styles.vazioTexto}>Lugar não encontrado. Ele pode ter sido removido.</Text>
      </View>
    );
  }

  function confirmarRemocao() {
    Alert.alert('Remover lugar', `Deseja remover "${lugar.nome}" do seu diário?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          removerLugar(lugar.id);
          navigation.goBack();
        },
      },
    ]);
  }

  const regiao = {
    latitude: lugar.latitude,
    longitude: lugar.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      {lugar.foto ? (
        <Image source={{ uri: lugar.foto }} style={styles.foto} />
      ) : (
        <View style={[styles.foto, styles.semFoto]}>
          <Text style={styles.semFotoTexto}>📷 Sem foto</Text>
        </View>
      )}

      <View style={styles.cabecalho}>
        <Text style={styles.nome}>{lugar.nome}</Text>
        <StatusBadge status={lugar.status} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Descrição</Text>
        <Text style={styles.descricao}>{lugar.descricao || 'Sem descrição.'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Endereço</Text>
        <Text style={styles.campoValor}>{formatarEndereco(lugar)}</Text>
        <Text style={styles.coordenadas}>
          Lat: {lugar.latitude.toFixed(5)} · Lon: {lugar.longitude.toFixed(5)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>No mapa</Text>
        <MapView
          style={styles.mapa}
          initialRegion={regiao}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker coordinate={{ latitude: lugar.latitude, longitude: lugar.longitude }} title={lugar.nome} />
        </MapView>
      </View>

      <Botao
        titulo="Editar lugar"
        onPress={() => navigation.navigate('Cadastro', { id: lugar.id })}
        estilo={styles.acao}
      />
      {lugar.status !== 'visitado' && (
        <Botao
          titulo="Marcar como visitado"
          variante="secundario"
          onPress={() => marcarComoVisitado(lugar.id)}
          estilo={styles.acao}
        />
      )}
      <Botao titulo="Remover lugar" variante="perigo" onPress={confirmarRemocao} estilo={styles.acao} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 16, paddingBottom: 40 },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  vazioTexto: { color: colors.muted, fontSize: 15, textAlign: 'center' },
  foto: { width: '100%', height: 220, borderRadius: 14, backgroundColor: colors.border },
  semFoto: { alignItems: 'center', justifyContent: 'center' },
  semFotoTexto: { color: colors.muted, fontSize: 14 },
  cabecalho: { marginTop: 14, marginBottom: 6 },
  nome: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 8 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...sombra,
  },
  cardTitulo: { fontSize: 12, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', marginBottom: 6 },
  descricao: { fontSize: 15, color: colors.text, lineHeight: 21 },
  campoValor: { fontSize: 15, color: colors.text },
  coordenadas: { fontSize: 12, color: colors.muted, marginTop: 6 },
  mapa: { height: 170, borderRadius: 10 },
  acao: { marginTop: 12 },
});
