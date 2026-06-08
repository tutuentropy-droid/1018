import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CompletedEffect,
  MakeupStep,
  ProductOption,
  CharacterProfile,
  GameMode,
  StepRecord,
} from "@/types";
import { MAKEUP_STEPS } from "@/data";

export interface GameUIState {
  showTip: boolean;
  currentTip: string;
  currentTipName: string;
  showConfetti: boolean;
  wrongStepId: number | null;
  hintsRemaining: number;
  showHint: boolean;
  showProductSelection: boolean;
  pendingStep: MakeupStep | null;
  showDrawing: boolean;
  drawingStep: MakeupStep | null;
  drawingProduct: ProductOption | null;
}

export interface GameState extends GameUIState {
  characterProfile: CharacterProfile | null;
  started: boolean;
  gameMode: GameMode;
  expectedStepId: number;
  completedSteps: number[];
  stepHistory: StepRecord[];
  completedEffects: CompletedEffect;

  setCharacterProfile: (profile: CharacterProfile | null) => void;
  setStarted: (started: boolean) => void;
  setGameMode: (mode: GameMode) => void;
  setExpectedStepId: (id: number) => void;
  incrementExpectedStep: () => void;

  finalizeStep: (step: MakeupStep, product?: ProductOption) => void;
  clearStep: (stepId: number) => void;

  setWrongStep: (stepId: number | null) => void;
  useHint: () => void;
  setShowHint: (show: boolean) => void;

  openProductSelection: (step: MakeupStep) => void;
  closeProductSelection: () => void;
  setPendingStep: (step: MakeupStep | null) => void;

  openDrawing: (step: MakeupStep, product?: ProductOption | null) => void;
  closeDrawing: () => void;
  setDrawingStep: (step: MakeupStep | null) => void;
  setDrawingProduct: (product: ProductOption | null) => void;

  showStepTip: (step: MakeupStep) => void;
  closeTip: () => void;
  triggerConfetti: () => void;

  resetGame: () => void;
  resetUI: () => void;
  fullReset: () => void;

  isStepCompleted: (stepId: number) => boolean;
  isComplete: boolean;
  totalSteps: number;
}

const initialUIState: GameUIState = {
  showTip: false,
  currentTip: "",
  currentTipName: "",
  showConfetti: false,
  wrongStepId: null,
  hintsRemaining: 3,
  showHint: false,
  showProductSelection: false,
  pendingStep: null,
  showDrawing: false,
  drawingStep: null,
  drawingProduct: null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialUIState,
      characterProfile: null,
      started: false,
      gameMode: "guided",
      expectedStepId: 1,
      completedSteps: [],
      stepHistory: [],
      completedEffects: {},

      setCharacterProfile: (profile) => set({ characterProfile: profile }),
      setStarted: (started) => set({ started }),
      setGameMode: (mode) =>
        set({
          gameMode: mode,
          expectedStepId: 1,
          completedSteps: [],
          stepHistory: [],
          completedEffects: {},
          ...initialUIState,
        }),
      setExpectedStepId: (id) => set({ expectedStepId: id }),
      incrementExpectedStep: () =>
        set((state) => ({
          expectedStepId: Math.min(state.expectedStepId + 1, MAKEUP_STEPS.length),
        })),

      finalizeStep: (step, product) =>
        set((state) => {
          const wasNotCompleted = !state.completedSteps.includes(step.id);
          const newCompletedSteps = wasNotCompleted
            ? [...state.completedSteps, step.id]
            : state.completedSteps;
          const newEffects = {
            ...state.completedEffects,
            [step.effectKey]: product ? product : true,
          };
          const newHistory = wasNotCompleted
            ? [
                ...state.stepHistory,
                {
                  stepId: step.id,
                  stepName: step.name,
                  product,
                  completedAt: Date.now(),
                },
              ]
            : state.stepHistory;

          const shouldShowConfetti = newCompletedSteps.length === MAKEUP_STEPS.length;

          return {
            completedSteps: newCompletedSteps,
            completedEffects: newEffects,
            stepHistory: newHistory,
            currentTip: step.tip,
            currentTipName: step.name,
            showTip: true,
            showConfetti: shouldShowConfetti,
          };
        }),

      clearStep: (stepId) =>
        set((state) => ({
          completedSteps: state.completedSteps.filter((id) => id !== stepId),
          stepHistory: state.stepHistory.filter((r) => r.stepId !== stepId),
        })),

      setWrongStep: (stepId) => set({ wrongStepId: stepId }),
      useHint: () =>
        set((state) => ({
          hintsRemaining: Math.max(0, state.hintsRemaining - 1),
          showHint: state.hintsRemaining > 0,
        })),
      setShowHint: (show) => set({ showHint: show }),

      openProductSelection: (step) =>
        set({
          pendingStep: step,
          showProductSelection: true,
        }),
      closeProductSelection: () =>
        set({
          showProductSelection: false,
          pendingStep: null,
        }),
      setPendingStep: (step) => set({ pendingStep: step }),

      openDrawing: (step, product) =>
        set({
          drawingStep: step,
          drawingProduct: product ?? null,
          showDrawing: true,
        }),
      closeDrawing: () =>
        set({
          showDrawing: false,
          drawingStep: null,
          drawingProduct: null,
          pendingStep: null,
        }),
      setDrawingStep: (step) => set({ drawingStep: step }),
      setDrawingProduct: (product) => set({ drawingProduct: product }),

      showStepTip: (step) =>
        set({
          currentTip: step.tip,
          currentTipName: step.name,
          showTip: true,
        }),
      closeTip: () =>
        set((state) => ({
          showTip: false,
          expectedStepId:
            state.gameMode === "guided"
              ? Math.min(state.expectedStepId + 1, MAKEUP_STEPS.length)
              : state.expectedStepId,
        })),
      triggerConfetti: () => set({ showConfetti: true }),

      resetGame: () =>
        set({
          expectedStepId: 1,
          completedSteps: [],
          stepHistory: [],
          completedEffects: {},
          ...initialUIState,
          started: true,
        }),

      resetUI: () => set({ ...initialUIState }),

      fullReset: () =>
        set({
          characterProfile: null,
          started: false,
          gameMode: "guided",
          expectedStepId: 1,
          completedSteps: [],
          stepHistory: [],
          completedEffects: {},
          ...initialUIState,
        }),

      isStepCompleted: (stepId) => get().completedSteps.includes(stepId),
      get isComplete() {
        return get().completedSteps.length >= MAKEUP_STEPS.length;
      },
      totalSteps: MAKEUP_STEPS.length,
    }),
    {
      name: "makeup-game-storage",
      partialize: (state) => ({
        characterProfile: state.characterProfile,
        started: state.started,
        gameMode: state.gameMode,
        expectedStepId: state.expectedStepId,
        completedSteps: state.completedSteps,
        stepHistory: state.stepHistory,
        completedEffects: state.completedEffects,
        hintsRemaining: state.hintsRemaining,
      }),
    }
  )
);

export function useIsGameComplete(): boolean {
  const completedSteps = useGameStore((s) => s.completedSteps);
  return completedSteps.length >= MAKEUP_STEPS.length;
}
