import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LugarCard from '../components/LugarCard';
import { useLugares } from '../context/LugaresContext';
import { colors, sombra } from '../theme';

// Tela inicial: lista todos os lugares cadastrados.
export default function ListaScreen({ navigation }) {
  const { lugares } = useLugares();
  const visitados = lugares.filter((lugar) => lugar.status === 'visitado').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Diário de Viagens</Text>
        <Text style={styles.subtitulo}>
          {lugares.length} {lugares.length === 1 ? 'lugar' : 'lugares'} · {visitados}{' '}
          {visitados === 1 ? 'visitado' : 'visitados'}
        </Text>
      </View>

      <FlatList
        data={lugares}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LugarCard lugar={item} onPress={() => navigation.navigate('Detalhes', { id: item.id })} />
        )}
        contentContainerStyle={[styles.lista, lugares.length === 0 && styles.listaVazia]}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🧭</Text>
            <Text style={styles.vazioTitulo}>Nenhum lugar cadastrado</Text>
            <Text style={styles.vazioTexto}>
              Toque em “Adicionar lugar” para registrar o primeiro destino do seu diário.
            </Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [styles.botaoAdicionar, pressed && { opacity: 0.85 }]}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.botaoTexto}>+ Adicionar lugar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  cabecalho: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: colors.primary,
  },
  titulo: { fontSize: 22, fontWeight: '800', color: colors.white },
  subtitulo: { fontSize: 13, color: '#CFE3EA', marginTop: 4 },
  lista: { padding: 16, paddingBottom: 100 },
  listaVazia: { flexGrow: 1, justifyContent: 'center' },
  vazio: { alignItems: 'center', paddingHorizontal: 32 },
  vazioEmoji: { fontSize: 44, marginBottom: 12 },
  vazioTitulo: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6, textAlign: 'center' },
  vazioTexto: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  botaoAdicionar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    ...sombra,
  },
  botaoTexto: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
