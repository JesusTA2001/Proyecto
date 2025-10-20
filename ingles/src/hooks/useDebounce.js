import { useState, useEffect } from 'react';

// Este hook toma un valor (lo que el usuario escribe) y un delay (tiempo de espera)
function useDebounce(value, delay) {
  // Estado para guardar el valor "retrasado"
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Crea un temporizador que actualizará el estado solo después de que pase el tiempo de 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el temporizador si el usuario sigue escribiendo.
    // Esto es crucial para que la búsqueda solo se ejecute cuando el usuario se detiene.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // El efecto se vuelve a ejecutar solo si el valor o el delay cambian

  return debouncedValue;
}

export default useDebounce;