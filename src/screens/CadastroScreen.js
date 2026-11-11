import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

import Botao from '../components/Botao';
import CameraCaptura from '../components/CameraCaptura';
import { useLugares } from '../context/LugaresContext';
import { montarEndereco } from '../utils/endereco';
import { colors, sombra, STATUS } from '../theme';

// Cadastro e edição de um lugar (a mesma tela serve para os dois casos).
export default function CadastroScreen({ route, navigation }) {
  const { buscarLugar, adicionarLugar, atualizarLugar } = useLugares();
  const lugarEmEdicao = route.params?.id ? buscarLugar(route.params.id) : null;
  const editando = Boolean(lugarEmEdicao);

  const [nome, setNome] = useState(lugarEmEdicao?.nome ?? '');
  const [descricao, setDescricao] = useState(lugarEmEdicao?.descricao ?? '');
  const [rua, setRua] = useState(lugarEmEdicao?.rua ?? '');
  const [numero, setNumero] = useState(lugarEmEdicao?.numero ?? '');
  const [cidade, setCidade] = useState(lugarEmEdicao?.cidade ?? '');
  const [estado, setEstado] = useState(lugarEmEdicao?.estado ?? '');
  const [status, setStatus] = useState(lugarEmEdicao?.status ?? 'quero');
  const [foto, setFoto] = useState(lugarEmEdicao?.foto ?? null);
  const [salvando, setSalvando] = useState(false);
  const [cameraAberta, setCameraAberta] = useState(false);

  // Salva a foto na galeria do dispositivo (expo-media-library).
  // Na versão 58 a API antiga (saveToLibraryAsync) foi removida: usamos Asset.create.
  async function salvarNaGaleria(uri) {
    try {
      const permissao = await MediaLibrary.requestPermissionsAsync(true);
      if (!permissao.granted) {
        Alert.alert('Galeria', 'Sem permissão para salvar a foto na galeria do dispositivo.');
        return;
      }

      // Grava o arquivo da foto na galeria do dispositivo.
      await MediaLibrary.Asset.create(uri);
      Alert.alert('Foto salva', 'A foto foi salva na galeria do dispositivo.');
    } catch (erro) {
      Alert.alert(
        'Galeria',
        `Não foi possível salvar a foto na galeria.\n\n${erro?.message ?? String(erro)}`
      );
    }
  }

  // Abre a tela de captura própria, que tem o botão de virar a câmera.
  function abrirCamera() {
    setCameraAberta(true);
  }

  // Recebe a foto capturada: mostra no formulário e salva na galeria.
  async function aoCapturarFoto(uri) {
    setFoto(uri);
    await salvarNaGaleria(uri);
  }

  // Escolhe uma foto já existente na galeria.
  async function escolherDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Galeria', 'Permissão negada. Autorize o acesso às fotos para escolher a imagem do lugar.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!resultado.canceled) setFoto(resultado.assets[0].uri);
  }

  async function salvar() {
    if (!nome.trim() || !rua.trim() || !cidade.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe pelo menos o nome do lugar, a rua e a cidade.');
      return;
    }

    setSalvando(true);

    try {
      // Converte o endereço digitado em latitude e longitude.
      const enderecoCompleto = montarEndereco({ rua, numero, cidade, estado });
      const coordenadas = await Location.geocodeAsync(enderecoCompleto);

      // Se o endereço não for encontrado, avisa e não cadastra o lugar.
      if (!coordenadas || coordenadas.length === 0) {
        Alert.alert(
          'Endereço não encontrado',
          'Não foi possível converter esse endereço em coordenadas. Confira a rua, o número, a cidade e o estado e tente novamente.'
        );
        return;
      }

      const { latitude, longitude } = coordenadas[0];

      const dados = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        rua: rua.trim(),
        numero: numero.trim(),
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
        status,
        foto,
        enderecoCompleto,
        latitude,
        longitude,
      };

      if (editando) {
        atualizarLugar(lugarEmEdicao.id, dados);
      } else {
        adicionarLugar(dados);
      }

      navigation.goBack();
    } catch (erro) {
      Alert.alert('Erro ao salvar', 'Não foi possível salvar o lugar. Verifique sua conexão e tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.rotulo}>Nome do lugar *</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex.: Cachoeira do Rio Verde"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.rotulo}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="O que você quer fazer ou viu nesse lugar?"
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.rotulo}>Rua *</Text>
        <TextInput
          style={styles.input}
          value={rua}
          onChangeText={setRua}
          placeholder="Ex.: Av. Brasil"
          placeholderTextColor={colors.muted}
        />

        <View style={styles.linha}>
          <View style={styles.colunaNumero}>
            <Text style={styles.rotulo}>Número</Text>
            <TextInput
              style={styles.input}
              value={numero}
              onChangeText={setNumero}
              placeholder="1234"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.colunaEstado}>
            <Text style={styles.rotulo}>Estado</Text>
            <TextInput
              style={styles.input}
              value={estado}
              onChangeText={setEstado}
              placeholder="SP"
              placeholderTextColor={colors.muted}
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <Text style={styles.rotulo}>Cidade *</Text>
        <TextInput
          style={styles.input}
          value={cidade}
          onChangeText={setCidade}
          placeholder="Ex.: Franca"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.rotulo}>Status</Text>
        <View style={styles.seletorStatus}>
          {Object.entries(STATUS).map(([chave, config]) => {
            const ativo = status === chave;
            return (
              <Pressable
                key={chave}
                onPress={() => setStatus(chave)}
                style={[
                  styles.opcaoStatus,
                  ativo && { borderColor: config.color, backgroundColor: `${config.color}1A` },
                ]}
              >
                <View style={[styles.pontoStatus, { backgroundColor: config.color }]} />
                <Text style={[styles.textoStatus, ativo && { color: config.color, fontWeight: '700' }]}>
                  {config.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.rotulo}>Foto do lugar</Text>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.preview} />
        ) : (
          <View style={[styles.preview, styles.previewVazia]}>
            <Text style={styles.previewTexto}>Nenhuma foto escolhida</Text>
          </View>
        )}

        <View style={styles.linhaBotoesFoto}>
          <Botao titulo="Tirar foto" variante="secundario" onPress={abrirCamera} estilo={styles.botaoFoto} />
          <Botao
            titulo="Escolher da galeria"
            variante="secundario"
            onPress={escolherDaGaleria}
            estilo={styles.botaoFoto}
          />
        </View>

        <Botao
          titulo={editando ? 'Salvar alterações' : 'Salvar lugar'}
          onPress={salvar}
          carregando={salvando}
          estilo={styles.botaoSalvar}
        />
        <Botao titulo="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
      </ScrollView>

      <CameraCaptura
        visivel={cameraAberta}
        onFechar={() => setCameraAberta(false)}
        onCapturar={aoCapturarFoto}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 16, paddingBottom: 40 },
  rotulo: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
  },
  textArea: { minHeight: 92, textAlignVertical: 'top' },
  linha: { flexDirection: 'row', gap: 12 },
  colunaNumero: { flex: 2 },
  colunaEstado: { flex: 1 },
  seletorStatus: { flexDirection: 'row', gap: 10 },
  opcaoStatus: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingVertical: 12,
  },
  pontoStatus: { width: 9, height: 9, borderRadius: 5, marginRight: 7 },
  textoStatus: { fontSize: 13, color: colors.muted },
  preview: { width: '100%', height: 190, borderRadius: 12, backgroundColor: colors.border },
  previewVazia: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  previewTexto: { color: colors.muted, fontSize: 13 },
  linhaBotoesFoto: { flexDirection: 'row', gap: 10, marginTop: 10 },
  botaoFoto: { flex: 1 },
  botaoSalvar: { marginTop: 24, marginBottom: 10 },
});
