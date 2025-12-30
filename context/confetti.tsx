"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use"; // Optionnel : pour ajuster à la taille de l'écran

interface ConfettiContextType {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const ConfettiContext = createContext<ConfettiContextType | undefined>(undefined);

export const ConfettiProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { width, height } = useWindowSize(); // Récupère les dimensions réelles du navigateur

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <ConfettiContext.Provider value={{ onOpen, onClose, isOpen }}>
      {isOpen && (
        <ReactConfetti
          className="pointer-events-none z-[100] fixed inset-0"
          numberOfPieces={500}
          recycle={false} // L'animation s'arrête d'elle-même après une salve
          onConfettiComplete={onClose} // Ferme automatiquement le contexte à la fin
          width={width}
          height={height}
        />
      )}
      {children}
    </ConfettiContext.Provider>
  );
};

/**
 * Hook pour déclencher les confettis depuis n'importe quel composant
 * Exemple : const { onOpen } = useConfettiStore();
 */
export const useConfettiStore = () => {
  const context = useContext(ConfettiContext);
  if (context === undefined) {
    throw new Error("useConfettiStore doit être utilisé dans un ConfettiProvider");
  }
  return context;
};