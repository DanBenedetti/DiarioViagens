# Diário de Viagens

Aplicativo React Native (Expo) para registrar os lugares que você quer conhecer ou que já visitou.
Cada lugar tem nome, descrição, endereço, status (**Quero visitar** / **Visitado**) e uma foto.
Os lugares aparecem em lista, em mapa e em gráficos.

Projeto do 2º bimestre da disciplina **Programação para Dispositivos Móveis I** — FATEC Franca.

## Integrante

- Danilo Benedetti Ribeiro

## Funcionalidades

| Tela | O que faz |
| --- | --- |
| **Lista de Lugares** (inicial) | Lista os lugares com foto em miniatura, nome, cidade e status. Botão para adicionar. Tocar em um lugar abre os detalhes. |
| **Cadastro de Lugar** | Formulário com nome, descrição, rua, número, cidade, estado e status. Foto tirada na hora, escolhida da galeria ou capturada na câmera do app (com troca de lente). Ao salvar, o endereço é convertido em latitude/longitude com `Location.geocodeAsync`. |
| **Detalhes do Lugar** | Mostra todos os dados, a foto e um mini mapa com o marcador. Permite editar, marcar como visitado e remover. |
| **Mapa** | Marcador com o nome de cada lugar cadastrado e a localização atual do usuário, obtida pelo hook `useLocation`. Tocar no marcador abre os detalhes. |
| **Estatísticas** | Gráfico de pizza com a quantidade de lugares por status, com legenda e cores diferentes. Segundo gráfico com a quantidade de lugares por cidade. Os dados vêm dos lugares cadastrados. |

Regras implementadas:

- Navegação com React Navigation (abas para Lista, Mapa e Estatísticas; pilha para Cadastro e Detalhes).
- Lugares guardados no estado global compartilhado entre as telas (Context API).
- Se o endereço não for encontrado no `geocodeAsync`, o app avisa o usuário e **não** cadastra o lugar sem coordenadas.
- A foto tirada pela câmera é salva na galeria do dispositivo (`expo-media-library`, via `Asset.create`) e exibida no app.
- Permissões de localização, câmera e galeria são solicitadas, com aviso quando negadas.
- Se o Android encerrar o app enquanto a câmera está aberta, a foto é recuperada com `ImagePicker.getPendingResultAsync()`.

### Botões de foto no cadastro

- **Tirar foto** — abre a câmera do sistema (`expo-image-picker`), com edição/corte da imagem.
- **Escolher da galeria** — escolhe uma foto já existente no aparelho.
- **Câmera com troca de lente** — abre uma tela de captura própria (`expo-camera`), com botão para alternar entre câmera traseira e frontal.

## Organização do código

```
DiarioViagens/
├── App.js                     # provedores globais + navegação
├── index.js                   # ponto de entrada (registerRootComponent)
├── app.json                   # configuração do app e permissões
└── src/
    ├── components/            # Botao, CameraCaptura, LugarCard, StatusBadge
    ├── context/               # LugaresContext (estado global dos lugares)
    ├── hooks/                 # useLocation (localização atual)
    ├── navigation/            # RootNavigator (abas + pilha)
    ├── screens/               # Lista, Cadastro, Detalhes, Mapa, Estatísticas
    ├── utils/                 # montagem do endereço e agrupamentos
    └── theme.js               # cores, status e sombra
```

## Instalação e execução

Pré-requisitos:

- **Node.js 20 ou superior** (testado com Node 24).
- **Aplicativo Expo Go atualizado (SDK 58)** no celular, ou um emulador Android com Google Play.

```bash
# 1. Instalar as dependências (a flag é obrigatória, veja abaixo)
npm install --legacy-peer-deps

# 2. Iniciar o app
npx expo start
```

Depois disso, leia o QR Code com o Expo Go (Android) ou com a câmera (iOS), ou pressione:

- `a` para abrir no emulador Android;
- `i` para abrir no simulador iOS.

### Problemas comuns

- **`npm install` falha com `ERESOLVE could not resolve`** — o `react-native-svg-charts` declara suporte apenas a `react-native-svg` ^6 ou ^7, e o Expo SDK 58 usa a versão 15. Por isso a instalação precisa de `npm install --legacy-peer-deps`.
- **"Project is incompatible with this version of Expo Go"** — o Expo Go instalado é de um SDK anterior ao 58. Atualize o aplicativo Expo Go pela Play Store (o projeto usa Expo SDK 58).
- **Foto sai preta no emulador** — a câmera virtual do emulador Android pode entregar quadros pretos na captura de imagem parada (a pré-visualização funciona). Não é defeito do app; teste a câmera em um aparelho físico.
- **Mapa não renderiza no emulador** — o `react-native-maps` usa o Google Maps no Android e precisa dos serviços do Google Play na imagem do emulador. Em imagens sem Play, o mapa fica em branco; teste em aparelho físico.
- **Endereço não encontrado ao salvar** — a conversão de endereço em coordenadas (`geocodeAsync`) precisa de conexão com a internet e de um endereço completo (rua, número, cidade e UF).
- **Nenhuma pasta `node_modules` é enviada ao repositório.**
