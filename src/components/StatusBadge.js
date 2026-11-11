import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { STATUS } from '../theme';

// Etiqueta colorida que mostra o status do lugar.
export default function StatusBadge({ status, pequeno = false }) {
  const config = STATUS[status] || STATUS.quero;

  return (
    <View
      style={[
        styles.etiqueta,
        { backgroundColor: `${config.color}22`, borderColor: config.color },
        pequeno && styles.etiquetaPequena,
      ]}
    >
      <View style={[styles.ponto, { backgroundColor: config.color }, pequeno && styles.pontoPequeno]} />
      <Text style={[styles.texto, { color: config.color }, pequeno && styles.textoPequeno]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  etiquetaPequena: { paddingHorizontal: 8, paddingVertical: 2 },
  ponto: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  pontoPequeno: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  texto: { fontSize: 12, fontWeight: '600' },
  textoPequeno: { fontSize: 11 },
});
