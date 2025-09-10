import { create } from 'zustand';

interface TutorialState {
  isIntroCompleted: boolean;
  isGPSCompleted: boolean;
  isTutorialCompleted: boolean;
  setIntroCompleted: (completed: boolean) => void;
  setGPSCompleted: (completed: boolean) => void;
  setTutorialCompleted: (completed: boolean) => void;
  resetTutorial: () => void;
}

// Create store with error handling
let tutorialStore: any = null;

try {
  tutorialStore = create<TutorialState>((set) => ({
    isIntroCompleted: false,
    isGPSCompleted: false,
    isTutorialCompleted: false,
    
    setIntroCompleted: (completed: boolean) =>
      set((state) => ({
        isIntroCompleted: completed,
        isTutorialCompleted: completed && state.isGPSCompleted,
      })),
    
    setGPSCompleted: (completed: boolean) =>
      set((state) => ({
        isGPSCompleted: completed,
        isTutorialCompleted: state.isIntroCompleted && completed,
      })),
    
    setTutorialCompleted: (completed: boolean) =>
      set({
        isTutorialCompleted: completed,
        isIntroCompleted: completed,
        isGPSCompleted: completed,
      }),
    
    resetTutorial: () =>
      set({
        isIntroCompleted: false,
        isGPSCompleted: false,
        isTutorialCompleted: false,
      }),
  }));
} catch (error) {
  console.warn('Failed to create tutorial store:', error);
  // Fallback store
  tutorialStore = create<TutorialState>(() => ({
    isIntroCompleted: false,
    isGPSCompleted: false,
    isTutorialCompleted: false,
    setIntroCompleted: () => {},
    setGPSCompleted: () => {},
    setTutorialCompleted: () => {},
    resetTutorial: () => {},
  }));
}

export const useTutorialStore = tutorialStore;
