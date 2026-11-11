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
| **Cadastro de Lugar** | Formulário com nome, descrição, rua, número, cidade, estado e status. Foto tirada na hora ou escolhida da galeria. Ao salvar, o endereço é convertido em latitude/longitude com `Location.geocodeAsync`. |
| **Detalhes do Lugar** | Mostra todos os dados, a foto e um mini mapa com o marcador. Permite editar, marcar como visitado e remover. |
| **Mapa** | Marcador com o nome de cada lugar cadastrado e a localização atual do usuário, obtida pelo hook `useLocation`. Tocar no marcador abre os detalhes. |
| **Estatísticas** | Gráfico de pizza com a quantidade de lugares por status, com legenda e cores diferentes. Segundo gráfico com a quantidade de lugares por cidade. Os dados vêm dos lugares cadastrados. |

Regras implementadas:

- Navegação com React Navigation (abas para Lista, Mapa e Estatísticas; pilha para Cadastro e Detalhes).
- Lugares guardados no estado global compartilhado entre as telas (Context API).
- Se o endereço não for encontrado no `geocodeAsync`, o app avisa o usuário e **não** cadastra o lugar sem coordenadas.
- A foto tirada pela câmera é salva na galeria do dispositivo (`expo-media-library`) e exibida no app.
- Permissões de localização, câmera e galeria são solicitadas, com aviso quando negadas.

## Organização do código

```
DiarioViagens/
├── App.js                     # provedores globais + navegação
├── index.js                   # ponto de entrada (registerRootComponent)
├── app.json                   # configuração do app e permissões
└── src/
    ├── components/            # Botao, LugarCard, StatusBadge
    ├── context/               # LugaresContext (estado global dos lugares)
    ├── hooks/                 # useLocation (localização atual)
    ├── navigation/            # RootNavigator (abas + pilha)
    ├── screens/               # Lista, Cadastro, Detalhes, Mapa, Estatísticas
    ├── utils/                 # montagem do endereço e agrupamentos
    └── theme.js               # cores, status e sombra
```

## Instalação e execução

Pré-requisitos: Node.js instalado e o aplicativo **Expo Go** no celular (ou um emulador Android/iOS).

```bash
# 1. Instalar as dependências
npm install --legacy-peer-deps

# 2. Iniciar o app
npx expo start
```

Depois disso, leia o QR Code com o Expo Go (Android) ou com a câmera (iOS), ou pressione:

- `a` para abrir no emulador Android;
- `i` para abrir no simulador iOS.

### Observações

- O `react-native-svg-charts` é instalado com `--legacy-peer-deps` porque não declara suporte às versões mais novas do React Native.
- O mapa usa o Google Maps no Android. Em emuladores sem Google Play, o mapa pode não renderizar; teste em um dispositivo físico.
- A conversão de endereço em coordenadas (`geocodeAsync`) e o mapa precisam de conexão com a internet.
- Nenhuma pasta `node_modules` é enviada ao repositório.
