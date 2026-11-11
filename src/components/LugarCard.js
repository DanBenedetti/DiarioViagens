import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import StatusBadge from './StatusBadge';
import { colors, sombra } from '../theme';

// Item da lista de lugares: foto em miniatura, nome, cidade e status.
export default function LugarCard({ lugar, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressionado]}>
      {lugar.foto ? (
        <Image source={{ uri: lugar.foto }} style={styles.foto} />
      ) : (
        <View style={[styles.foto, styles.semFoto]}>
          <Text style={styles.semFotoTexto}>📷</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>
          {lugar.nome}
        </Text>
        <Text style={styles.cidade} numberOfLines={1}>
          📍 {lugar.cidade}
          {lugar.estado ? `/${lugar.estado}` : ''}
        </Text>
        <StatusBadge status={lugar.status} pequeno />
      </View>

      <Text style={styles.seta}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...sombra,
  },
  pressionado: { opacity: 0.85 },
  foto: { width: 68, height: 68, borderRadius: 10, backgroundColor: colors.border },
  semFoto: { alignItems: 'center', justifyContent: 'center' },
  semFotoTexto: { fontSize: 22 },
  info: { flex: 1, marginLeft: 12 },
  nome: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  cidade: { fontSize: 13, color: colors.muted, marginBottom: 6 },
  seta: { fontSize: 24, color: colors.muted, marginLeft: 6 },
});
