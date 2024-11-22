import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TestResult {
  wpm: number;
  accuracy: number;
  mistakes: number;
  timestamp: string;
}

interface TypingStore {
  results: TestResult[];
  addResult: (result: TestResult) => void;
}

export const useTypingStore = create<TypingStore>()(
  persist(
    (set) => ({
      results: [],
      addResult: (result) =>
        set((state) => ({
          results: [...state.results, result],
        })),
    }),
    {
      name: 'typing-store',
    }
  )
);