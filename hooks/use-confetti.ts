import { create } from "zustand";

/**
 * Type pour définir l'état global des confettis
 */
type ConfettiStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

/**
 * Hook de gestion d'état global pour l'animation de succès.
 * Permet de déclencher les confettis depuis n'importe quel service ou composant.
 */
export const useConfetti = create<ConfettiStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
