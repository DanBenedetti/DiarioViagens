import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { colors } from '../theme';

// Tela de captura própria (expo-camera), com botão para virar entre a
// câmera traseira e a frontal.
export default function CameraCaptura({ visivel, onFechar, onCapturar }) {
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [capturando, setCapturando] = useState(false);
  const cameraRef = useRef(null);

  // Pede a permissão da câmera ao abrir, se ainda não foi concedida.
  useEffect(() => {
    if (visivel && permissao && !permissao.granted) pedirPermissao();
  }, [visivel, permissao, pedirPermissao]);

  function virarCamera() {
    setFacing((atual) => (atual === 'back' ? 'front' : 'back'));
  }

  async function capturar() {
    if (!cameraRef.current || capturando) return;

    setCapturando(true);
    try {
      const foto = await cameraRef.current.takePictureAsync({ quality: 0.6 });
      if (foto?.uri) await onCapturar(foto.uri);
      onFechar();
    } catch (erro) {
      // Mantém a câmera aberta para o usuário tentar de novo.
    } finally {
      setCapturando(false);
    }
  }

  return (
    <Modal visible={visivel} animationType="slide" onRequestClose={onFechar}>
      <View style={styles.container}>
        {permissao?.granted ? (
          <>
            {/* O CameraView não aceita children: o rótulo fica por cima, em posição absoluta. */}
            <View style={styles.areaCamera}>
              <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
              <View style={styles.topo} pointerEvents="none">
                <Text style={styles.topoTexto}>
                  {facing === 'back' ? 'Câmera traseira' : 'Câmera frontal'}
                </Text>
              </View>
            </View>

            <View style={styles.controles}>
              <Pressable style={styles.botaoLateral} onPress={onFechar}>
                <Text style={styles.textoBotao}>Fechar</Text>
              </Pressable>

              <Pressable style={styles.botaoCapturar} onPress={capturar} disabled={capturando}>
                {capturando ? <ActivityIndicator color={colors.white} /> : null}
              </Pressable>

              <Pressable style={styles.botaoLateral} onPress={virarCamera}>
                <Text style={styles.textoBotao}>🔄 Virar</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.aviso}>
            <Text style={styles.avisoTitulo}>Permissão da câmera</Text>
            <Text style={styles.avisoTexto}>
              Precisamos do acesso à câmera para fotografar o lugar. Você pode negar e escolher uma foto da
              galeria.
            </Text>
            <Pressable style={styles.botaoPermissao} onPress={pedirPermissao}>
              <Text style={styles.textoBotao}>Permitir câmera</Text>
            </Pressable>
            <Pressable style={styles.botaoCancelar} onPress={onFechar}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  areaCamera: { flex: 1 },
  camera: { flex: 1 },
  topo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  topoTexto: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: '#000',
  },
  botaoLateral: { paddingVertical: 12, paddingHorizontal: 14, minWidth: 92, alignItems: 'center' },
  textoBotao: { color: colors.white, fontSize: 14, fontWeight: '700' },
  botaoCapturar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 5,
    borderColor: colors.white,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aviso: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  avisoTitulo: { color: colors.white, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  avisoTexto: { color: '#CFE3EA', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  botaoPermissao: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  botaoCancelar: { paddingVertical: 10, paddingHorizontal: 20 },
  textoCancelar: { color: colors.white, fontSize: 14 },
});
