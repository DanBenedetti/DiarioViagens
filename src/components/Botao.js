import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme';

const VARIANTES = {
  primario: { fundo: colors.primary, texto: colors.white, borda: colors.primary },
  secundario: { fundo: colors.card, texto: colors.primary, borda: colors.primary },
  perigo: { fundo: colors.card, texto: colors.danger, borda: colors.danger },
};

// Botão reutilizável com variantes de cor e estado de carregamento.
export default function Botao({ titulo, onPress, variante = 'primario', carregando = false, desabilitado = false, estilo }) {
  const cores = VARIANTES[variante] || VARIANTES.primario;
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: cores.fundo, borderColor: cores.borda },
        pressed && !inativo && styles.pressionado,
        inativo && styles.inativo,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={cores.texto} />
      ) : (
        <Text style={[styles.texto, { color: cores.texto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionado: { opacity: 0.8 },
  inativo: { opacity: 0.6 },
  texto: { fontSize: 15, fontWeight: '700' },
});
