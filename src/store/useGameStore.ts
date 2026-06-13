import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, Player, GemColor, Card, Noble } from '@/types/game';

interface GameActions {
  startNewGame: () => void;
  resetGame: () => void;
  setCurrentPlayerIndex: (index: number) => void;
}

const initialPlayer = (id: number, name: string): Player => ({
  id,
  name,
  tokens: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 },
  cards: [],
  reservedCards: [],
  nobles: [],
  score: 0,
});

const initialState: GameState = {
  players: [initialPlayer(1, "플레이어 1"), initialPlayer(2, "플레이어 2")],
  currentPlayerIndex: 0,
  tokens: { white: 4, blue: 4, green: 4, red: 4, black: 4, gold: 5 }, // 2인 기준
  decks: { 1: [], 2: [], 3: [] },
  board: { 1: [], 2: [], 3: [] },
  nobles: [],
  turn: 1,
  isGameOver: false,
  winner: null,
  lastRound: false,
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initialState,
      startNewGame: () => {
        set({ ...initialState, turn: 1 });
      },

      resetGame: () => set(initialState),

      setCurrentPlayerIndex: (index) => set({ currentPlayerIndex: index }),
    }),
    {
      name: 'splendor-game-storage', // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);
