"use client";

import { useEffect, useState } from "react";
import { LessonCompleteModal } from "@/components/modals/lesson-complete-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <LessonCompleteModal />
    </>
  );
};
