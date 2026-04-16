import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GlobalStoreState {
  city: string;
  setCity: (city: string) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  visits: number;
  increaseVisits: () => void;
}

export const useGlobalStore = create<GlobalStoreState>()(
  devtools(
    persist(
      (set) => ({
        city: "Алматы",
        setCity: (city: string) => set({ city }),
        categories: [],
        setCategories: (categories: string[]) => set({ categories: categories.map((category) => category.normalize("NFC")) }),
        visits: 0,
        increaseVisits: () => set((state) => ({ visits: state.visits + 1 })),
      }),
      {
        name: "CityStore",
        partialize: (state) => ({ city: state.city, visits: state.visits }),
      },
    ),
  ),
);
