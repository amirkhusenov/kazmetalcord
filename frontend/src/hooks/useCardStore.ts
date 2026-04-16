import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { DbMetalItem, DbMetalItemsSchema } from '@/types';

interface CardStoreState {
  items: DbMetalItem[];
  addItem: (item: DbMetalItem) => void;
  removeItem: (itemUid: string) => void;
  clearItems: () => void;
}

function generateUid(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const useCardStore = create<CardStoreState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item: DbMetalItem) =>
          set((state) => {
            // Validate the item using the schema
            const result = DbMetalItemsSchema.safeParse([...state.items, { ...item, uid: generateUid() }]);
            if (!result.success) {
              console.error('Invalid item:', result.error);
              return state;
            }
            return { items: result.data };
          }),
        removeItem: (itemUid: string) =>
          set((state) => ({
            items: state.items.filter(
              (i) => i.uid !== itemUid,
            ),
          })),
        clearItems: () => set({ items: [] }),
      }),
      {
        name: 'card-storage',
      },
    ),
    { name: 'CardStore' },
  ),
);
