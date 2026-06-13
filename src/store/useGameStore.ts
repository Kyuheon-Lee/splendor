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
  selectToken: (color: Exclude<GemColor, "gold">) => void;
  cancelSelection: () => void;
  confirmTokens: () => void;
  discardToken: (color: GemColor) => void;
  reserveCard: (card: Card) => void; // 카드 예약 기능 추가
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
  selectedTokens: { white: 0, blue: 0, green: 0, red: 0, black: 0 },
  isDiscardingMode: false,
  isGameOver: false,
  winner: null,
  lastRound: false,
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      startNewGame: () => {
        const l1Cards = shuffle(ALL_CARDS.filter(c => c.level === 1));
        const l2Cards = shuffle(ALL_CARDS.filter(c => c.level === 2));
        const l3Cards = shuffle(ALL_CARDS.filter(c => c.level === 3));

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

      /**
       * 토큰 선택 로직 (상세 주석 처리)
       */
      selectToken: (color) => {
        const { tokens, selectedTokens } = get();
        const availableInBank = tokens[color];
        const currentSelectedCount = selectedTokens[color];

        // [CASE 1] 뱅크에 토큰이 없으면 가져올 수 없음
        if (availableInBank <= 0) return;

        const totalSelectedCount = Object.values(selectedTokens).reduce((a, b) => a + b, 0);

        // [CASE 2] 이미 같은 색을 2개 골랐다면 더 이상 선택 불가
        const hasDoubleSelection = Object.values(selectedTokens).some(count => count === 2);
        if (hasDoubleSelection) return;

        // [CASE 3] 이미 서로 다른 색 3개를 골랐다면 더 이상 선택 불가
        if (totalSelectedCount === 3) return;

        // [CASE 4] 지금 클릭한 토큰을 추가할 때의 규칙 검사
        
        // 4-1. 이미 1개를 고른 상태에서 같은 색을 또 고르려는 경우 (2개 가져오기 규칙)
        if (currentSelectedCount === 1) {
          // 다른 색이 이미 섞여있으면 안 됨 (오직 이 색 하나만 골라져 있어야 함)
          if (totalSelectedCount > 1) return;
          
          // 2인 게임 규칙: 해당 색상 토큰이 4개 이상 남아있을 때만 2개 가져오기 가능
          if (availableInBank < 4) return;
        } 
        
        // 4-2. 다른 색을 추가하려는 경우 (3개 가져오기 규칙 진행 중)
        else if (currentSelectedCount === 0) {
          // 이미 3개를 채웠거나 (위에서 체크됨), 이미 2개를 고른 상태면 안 됨 (위에서 체크됨)
          // 여기서는 통과
        }

        set({
          selectedTokens: {
            ...selectedTokens,
            [color]: currentSelectedCount + 1
          }
        });
      },

      cancelSelection: () => set({ selectedTokens: { white: 0, blue: 0, green: 0, red: 0, black: 0 } }),

      confirmTokens: () => {
        const { selectedTokens, tokens, players, currentPlayerIndex, turn } = get();
        
        const updatedPlayers = [...players];
        const currentPlayer = { 
          ...updatedPlayers[currentPlayerIndex], 
          tokens: { ...updatedPlayers[currentPlayerIndex].tokens } 
        };
        
        // 1. 플레이어에게 토큰 추가
        Object.entries(selectedTokens).forEach(([color, count]) => {
          currentPlayer.tokens[color as GemColor] += (count as number);
        });
        updatedPlayers[currentPlayerIndex] = currentPlayer;

        // 2. 뱅크에서 토큰 차감
        const updatedBank = { ...tokens };
        Object.entries(selectedTokens).forEach(([color, count]) => {
          updatedBank[color as GemColor] -= (count as number);
        });

        // 3. 보유량 체크 (10개 초과 여부)
        const totalAfterTaking = Object.values(currentPlayer.tokens).reduce((a, b) => (a as number) + (b as number), 0);
        
        if (totalAfterTaking > 10) {
          // 10개를 넘으면 반납 모드 진입 (턴을 넘기지 않음)
          set({
            players: updatedPlayers,
            tokens: updatedBank,
            isDiscardingMode: true,
            selectedTokens: { white: 0, blue: 0, green: 0, red: 0, black: 0 }
          });
        } else {
          // 10개 이하면 즉시 턴 종료
          const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
          set({
            players: updatedPlayers,
            tokens: updatedBank,
            currentPlayerIndex: nextPlayerIndex,
            selectedTokens: { white: 0, blue: 0, green: 0, red: 0, black: 0 },
            turn: nextPlayerIndex === 0 ? turn + 1 : turn
          });
        }
      },

      discardToken: (color) => {
        const { players, currentPlayerIndex, tokens, isDiscardingMode } = get();
        if (!isDiscardingMode) return;

        const updatedPlayers = [...players];
        const currentPlayer = { 
          ...updatedPlayers[currentPlayerIndex], 
          tokens: { ...updatedPlayers[currentPlayerIndex].tokens } 
        };

        if (currentPlayer.tokens[color] <= 0) return;

        // 플레이어 토큰 차감 및 뱅크 반납
        currentPlayer.tokens[color] -= 1;
        const updatedBank = { ...tokens, [color]: (tokens[color] as number) + 1 };
        updatedPlayers[currentPlayerIndex] = currentPlayer;

        // 다시 10개 이하인지 체크
        const currentTotal = Object.values(currentPlayer.tokens).reduce((a, b) => (a as number) + (b as number), 0);
        
        if (currentTotal <= 10) {
          // 반납 완료 -> 턴 종료
          const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
          set({
            players: updatedPlayers,
            tokens: updatedBank,
            isDiscardingMode: false,
            currentPlayerIndex: nextPlayerIndex,
            turn: nextPlayerIndex === 0 ? get().turn + 1 : get().turn
          });
        } else {
          // 아직 더 버려야 함
          set({
            players: updatedPlayers,
            tokens: updatedBank
          });
        }
      },

      /**
       * 카드 예약 로직
       * 1. 예약 가능 여부 확인 (최대 3장 제한)
       * 2. 카드 이동 (보드 -> 플레이어 손)
       * 3. 황금 토큰(마력) 증정 (남아있을 때만)
       * 4. 보드 채우기
       * 5. 토큰 10개 초과 시 반납 모드 진입
       */
      reserveCard: (card: Card) => {
        const { players, currentPlayerIndex, tokens, board, decks, turn } = get();
        const currentPlayer = players[currentPlayerIndex];

        // [체크] 이미 3장을 예약했다면 추가 예약 불가
        if (currentPlayer.reservedCards.length >= 3) {
          return;
        }

        const updatedPlayers = [...players];
        const updatedPlayer = { 
          ...currentPlayer, 
          tokens: { ...currentPlayer.tokens },
          reservedCards: [...currentPlayer.reservedCards, card]
        };

        const updatedBank = { ...tokens };

        // [마력 증정] 은행에 황금 토큰이 남아있다면 1개 가져옴
        if (updatedBank.gold > 0) {
          updatedPlayer.tokens.gold += 1;
          updatedBank.gold -= 1;
        }

        updatedPlayers[currentPlayerIndex] = updatedPlayer;

        // [보드 업데이트] 구매 로직과 유사하게 빈 자리 채우기
        const updatedBoard = { ...board };
        const levelBoard = [...updatedBoard[card.level]];
        const cardIndex = levelBoard.findIndex(c => c.id === card.id);
        
        if (cardIndex !== -1) {
          const updatedDecks = { ...decks };
          const levelDeck = [...updatedDecks[card.level]];
          
          if (levelDeck.length > 0) {
            const nextCard = levelDeck.shift()!;
            levelBoard[cardIndex] = nextCard;
            updatedDecks[card.level] = levelDeck;
          } else {
            levelBoard.splice(cardIndex, 1);
          }
          
          updatedBoard[card.level] = levelBoard;

          // 10개 보유 제한 체크
          const totalTokens = Object.values(updatedPlayer.tokens).reduce((a, b) => (a as number) + (b as number), 0);
          
          if (totalTokens > 10) {
            // 반납 모드 진입
            set({
              players: updatedPlayers,
              tokens: updatedBank,
              board: updatedBoard,
              decks: updatedDecks,
              isDiscardingMode: true
            });
          } else {
            // 즉시 턴 종료
            const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
            set({
              players: updatedPlayers,
              tokens: updatedBank,
              board: updatedBoard,
              decks: updatedDecks,
              currentPlayerIndex: nextPlayerIndex,
              turn: nextPlayerIndex === 0 ? turn + 1 : turn
            });
          }
        }
      },
    }),
    {
      name: 'splendor-game-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
