'use client';

import { create } from 'zustand';

type DiagnosisResults = {
  levelTestResult: string;
  styleTestResult: string;
  setLevelTestResult: (value: string) => void;
  setStyleTestResult: (value: string) => void;
  clearDiagnosisResults: () => void;
};

export const useDiagnosisResults = create<DiagnosisResults>((set) => ({
  levelTestResult: '',
  styleTestResult: '',
  setLevelTestResult: (levelTestResult) =>
    set((state) => (state.levelTestResult === levelTestResult ? state : { levelTestResult })),
  setStyleTestResult: (styleTestResult) =>
    set((state) => (state.styleTestResult === styleTestResult ? state : { styleTestResult })),
  clearDiagnosisResults: () => set({ levelTestResult: '', styleTestResult: '' }),
}));
