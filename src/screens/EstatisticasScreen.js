import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-svg-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLugares } from '../context/LugaresContext';
import { contarPor } from '../utils/agrupar';
import { colors, sombra, STATUS } from '../theme';

// Gráficos gerados a partir dos lugares cadastrados (nada fixo no código).
export default function EstatisticasScreen() {
  const { lugares } = useLugares();

  // Quantidade de lugares por status.
  const porStatus = useMemo(
    () =>
      Object.entries(STATUS).map(([chave, config]) => ({
        chave,
        label: config.label,
        cor: config.color,
        total: lugares.filter((lugar) => lugar.status === chave).length,
      })),
    [lugares]
  );

  const dadosPizza = porStatus
    .filter((item) => item.total > 0)
    .map((item) => ({ key: item.chave, value: item.total, svg: { fill: item.cor } }));

  // Quantidade de lugares por cidade (segundo gráfico).
  const porCidade = useMemo(() => contarPor(lugares, 'cidade'), [lugares]);
  const maiorCidade = porCidade.length > 0 ? Math.max(...porCidade.map((c) => c.total)) : 1;

  const total = lugares.length;

  if (total === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.vazio}>
          <Text style={styles.vazioEmoji}>📊</Text>
          <Text style={styles.vazioTitulo}>Sem dados para os gráficos</Text>
          <Text style={styles.vazioTexto}>
            Cadastre um lugar para ver a distribuição por status e por cidade.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Estatísticas</Text>
        <Text style={styles.subtitulo}>
          {total} {total === 1 ? 'lugar cadastrado' : 'lugares cadastrados'}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Lugares por status</Text>

          <View style={styles.pizzaArea}>
            <PieChart style={styles.pizza} data={dadosPizza} padAngle={0.02} innerRadius={0} />
            <View style={styles.legenda}>
              {porStatus.map((item) => {
                const percentual = total > 0 ? Math.round((item.total / total) * 100) : 0;
                return (
                  <View key={item.chave} style={styles.legendaItem}>
                    <View style={[styles.legendaCor, { backgroundColor: item.cor }]} />
                    <Text style={styles.legendaLabel} numberOfLines={1}>
                      {item.label}
                    </Text>
                    <Text style={styles.legendaValor}>
                      {item.total} ({percentual}%)
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Lugares por cidade</Text>

          {porCidade.map((cidade) => (
            <View key={cidade.nome} style={styles.linhaBarra}>
              <Text style={styles.cidadeLabel} numberOfLines={1}>
                {cidade.nome}
              </Text>
              <View style={styles.barraArea}>
                <BarChart
                  style={styles.barra}
                  horizontal
                  data={[cidade.total]}
                  svg={{ fill: colors.primary }}
                  yMin={0}
                  yMax={maiorCidade}
                  contentInset={{ top: 6, bottom: 6 }}
                  spacingInner={0.4}
                />
              </View>
              <Text style={styles.barraValor}>{cidade.total}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 16, paddingBottom: 32 },
  titulo: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitulo: { fontSize: 13, color: colors.muted, marginTop: 4, marginBottom: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...sombra,
  },
  cardTitulo: { fontSize: 12, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', marginBottom: 12 },
  pizzaArea: { flexDirection: 'row', alignItems: 'center' },
  pizza: { height: 150, flex: 1 },
  legenda: { flex: 1, marginLeft: 12 },
  legendaItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendaCor: { width: 12, height: 12, borderRadius: 3, marginRight: 8 },
  legendaLabel: { flex: 1, fontSize: 13, color: colors.text },
  legendaValor: { fontSize: 13, fontWeight: '700', color: colors.text },
  linhaBarra: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cidadeLabel: { width: 92, fontSize: 13, color: colors.text },
  barraArea: { flex: 1, height: 34 },
  barra: { flex: 1 },
  barraValor: { width: 26, textAlign: 'right', fontSize: 13, fontWeight: '700', color: colors.text },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  vazioEmoji: { fontSize: 44, marginBottom: 12 },
  vazioTitulo: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6, textAlign: 'center' },
  vazioTexto: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20 },
});
