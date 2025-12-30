
import { useEffect, useState } from "react";

/**
 * Hook pour retarder la mise à jour d'une valeur.
 * Utile pour les barres de recherche afin d'éviter trop d'appels API.
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // On définit un timer pour mettre à jour la valeur après le délai
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    // Si la valeur change avant la fin du timer (l'utilisateur tape encore), 
    // on annule le timer précédent et on recommence.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}