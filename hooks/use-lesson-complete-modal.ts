import { create } from "zustand";

type LessonCompleteModalStore = {
  isOpen: boolean;
  nextLessonUrl: string | null;
  isCourseComplete: boolean;
  onOpen: (nextLessonUrl?: string | null, isCourseComplete?: boolean) => void;
  onClose: () => void;
};

export const useLessonCompleteModal = create<LessonCompleteModalStore>((set) => ({
  isOpen: false,
  nextLessonUrl: null,
  isCourseComplete: false,
  onOpen: (nextLessonUrl = null, isCourseComplete = false) => set({ isOpen: true, nextLessonUrl, isCourseComplete }),
  onClose: () => set({ isOpen: false, nextLessonUrl: null, isCourseComplete: false }),
}));
