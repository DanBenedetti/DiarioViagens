// Paleta de cores e rótulos usados em todas as telas.
export const colors = {
  primary: '#1F6F8B',
  primaryDark: '#14505F',
  background: '#F4F7F8',
  card: '#FFFFFF',
  text: '#152A33',
  muted: '#6C8089',
  border: '#DCE5E9',
  quero: '#F2A65A',
  visitado: '#2E9E6B',
  danger: '#C0392B',
  white: '#FFFFFF',
};

// Status possíveis de um lugar (chave usada no estado + rótulo + cor).
export const STATUS = {
  quero: { label: 'Quero visitar', color: colors.quero },
  visitado: { label: 'Visitado', color: colors.visitado },
};

export const sombra = {
  shadowColor: '#0B2B36',
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};
