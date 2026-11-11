import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Estado global dos lugares, compartilhado entre todas as telas (Context API).
const LugaresContext = createContext(null);

export function LugaresProvider({ children }) {
  const [lugares, setLugares] = useState([]);

  const adicionarLugar = useCallback((dados) => {
    const novoLugar = { id: String(Date.now()), criadoEm: new Date().toISOString(), ...dados };
    setLugares((atuais) => [novoLugar, ...atuais]);
    return novoLugar.id;
  }, []);

  const atualizarLugar = useCallback((id, dados) => {
    setLugares((atuais) => atuais.map((lugar) => (lugar.id === id ? { ...lugar, ...dados } : lugar)));
  }, []);

  const marcarComoVisitado = useCallback((id) => {
    setLugares((atuais) => atuais.map((lugar) => (lugar.id === id ? { ...lugar, status: 'visitado' } : lugar)));
  }, []);

  const removerLugar = useCallback((id) => {
    setLugares((atuais) => atuais.filter((lugar) => lugar.id !== id));
  }, []);

  const buscarLugar = useCallback((id) => lugares.find((lugar) => lugar.id === id), [lugares]);

  const valor = useMemo(
    () => ({ lugares, adicionarLugar, atualizarLugar, marcarComoVisitado, removerLugar, buscarLugar }),
    [lugares, adicionarLugar, atualizarLugar, marcarComoVisitado, removerLugar, buscarLugar]
  );

  return <LugaresContext.Provider value={valor}>{children}</LugaresContext.Provider>;
}

export function useLugares() {
  const contexto = useContext(LugaresContext);
  if (!contexto) throw new Error('useLugares precisa ser usado dentro de um LugaresProvider.');
  return contexto;
}
