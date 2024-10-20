import { create } from 'zustand'

interface HeaderState {
  isNavActive: boolean
  toggleNav: () => void
  resetNav: () => void 
}

export const useHeaderStore = create<HeaderState>((set) => ({
  isNavActive: false,
  toggleNav: () => set((state) => ({ isNavActive: !state.isNavActive })),
  resetNav: () => set({ isNavActive: false }) 
}))