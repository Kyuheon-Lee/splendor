import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, Player, GemColor, Card, Noble } from '@/types/game';
import { ALL_CARDS } from '@/data/cards';

// 셔플 유틸리티 함수
const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

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
        // 1. 레벨별로 카드 분류 및 셔플
        const l1Cards = shuffle(ALL_CARDS.filter(c => c.level === 1));
        const l2Cards = shuffle(ALL_CARDS.filter(c => c.level === 2));
        const l3Cards = shuffle(ALL_CARDS.filter(c => c.level === 3));

        // 2. 보드에 4장씩 배치하고 남은 카드는 덱으로
        set({
          ...initialState,
          decks: {
            1: l1Cards.slice(4),
            2: l2Cards.slice(4),
            3: l3Cards.slice(4),
          },
          board: {
            1: l1Cards.slice(0, 4),
            2: l2Cards.slice(0, 4),
            3: l3Cards.slice(0, 4),
          },
          turn: 1
        });
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
