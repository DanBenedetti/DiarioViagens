// Junta as partes do endereço em uma string única, usada no geocodeAsync.
export function montarEndereco({ rua, numero, cidade, estado }) {
  return [rua, numero, cidade, estado, 'Brasil']
    .map((parte) => (parte ? String(parte).trim() : ''))
    .filter(Boolean)
    .join(', ');
}

// Endereço curto para exibir nas telas: "Rua X, 123 - Franca/SP".
export function formatarEndereco(lugar) {
  const linhaRua = [lugar.rua, lugar.numero].filter(Boolean).join(', ');
  const linhaCidade = [lugar.cidade, lugar.estado].filter(Boolean).join('/');
  return [linhaRua, linhaCidade].filter(Boolean).join(' - ');
}
