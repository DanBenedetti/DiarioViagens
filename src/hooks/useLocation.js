import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

// Hook personalizado: pede permissão e devolve a localização atual do usuário.
export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const obterLocalizacao = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permissão de localização negada. Autorize o acesso para ver sua posição no mapa.');
        return null;
      }

      const posicao = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coordenadas = {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      };

      setLocation(coordenadas);
      return coordenadas;
    } catch (erro) {
      setError('Não foi possível obter sua localização. Verifique o GPS do dispositivo.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca a localização assim que o hook é montado.
  useEffect(() => {
    obterLocalizacao();
  }, [obterLocalizacao]);

  return { location, error, loading, obterLocalizacao };
}
