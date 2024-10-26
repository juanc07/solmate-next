import { create } from 'zustand';

// Define your store structure
interface CounterState {
  count: number;
  increase: () => void;
  reset: () => void;
}

// Create the Zustand store with type-safe `set`
export const useStore = create<CounterState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
