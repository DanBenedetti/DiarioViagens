// Conta quantos lugares existem para cada valor de um campo (ex.: cidade).
export function contarPor(lugares, campo) {
  const contagem = new Map();

  lugares.forEach((lugar) => {
    const valor = String(lugar[campo] ?? '').trim();
    const chave = valor || 'Não informado';
    contagem.set(chave, (contagem.get(chave) || 0) + 1);
  });

  return [...contagem.entries()]
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome));
}
