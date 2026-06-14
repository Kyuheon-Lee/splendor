import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, Player, GemColor, Card, Noble } from '@/types/game';
import { ALL_CARDS } from '@/data/cards';
import { ALL_NOBLES } from '@/data/nobles';

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
  reserveCard: (card: Card) => void;
  buyCard: (card: Card, isReserved?: boolean) => void;
  checkNobles: (player: Player) => { updatedPlayer: Player; updatedNobles: Noble[] } | null;
  nextTurn: () => void;
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

        // 2인 규칙: 귀족 타일 3개
        const selectedNobles = shuffle(ALL_NOBLES).slice(0, 3);

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
          nobles: selectedNobles,
          turn: 1
        });
      },

      resetGame: () => set(initialState),

      setCurrentPlayerIndex: (index) => set({ currentPlayerIndex: index }),

      // 턴 종료 및 승리 체크 공통 로직
      nextTurn: () => {
        const { players, currentPlayerIndex, turn, lastRound, isGameOver } = get();
        
        if (isGameOver) return;

        // 현재 플레이어가 15점 이상인지 체크
        const currentPlayer = players[currentPlayerIndex];
        let nextLastRound = lastRound;
        if (currentPlayer.score >= 15) {
          nextLastRound = true;
        }

        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        
        // 라운드가 종료되었을 때 (마지막 플레이어의 턴이 끝났을 때)
        if (nextPlayerIndex === 0) {
          // 마지막 라운드였다면 게임 종료
          if (nextLastRound) {
            // 승자 결정 (최고점, 동점시 카드 적은 사람)
            const winner = [...players].sort((a, b) => {
              if (b.score !== a.score) return b.score - a.score;
              return a.cards.length - b.cards.length;
            })[0];

            set({ 
              isGameOver: true, 
              winner: winner,
              lastRound: nextLastRound
            });
            return;
          }
          
          set({ 
            currentPlayerIndex: nextPlayerIndex, 
            turn: turn + 1,
            lastRound: nextLastRound
          });
        } else {
          set({ 
            currentPlayerIndex: nextPlayerIndex,
            lastRound: nextLastRound
          });
        }
      },

      checkNobles: (player: Player) => {
        const { nobles } = get();
        const availableNobles = [...nobles];
        
        const bonuses: Record<string, number> = { white: 0, blue: 0, green: 0, red: 0, black: 0 };
        player.cards.forEach(card => {
          bonuses[card.gemColor]++;
        });

        const visitingNobleIndex = availableNobles.findIndex(noble => {
          return Object.entries(noble.cost).every(([color, required]) => {
            return bonuses[color] >= (required as number);
          });
        });

        if (visitingNobleIndex !== -1) {
          const noble = availableNobles[visitingNobleIndex];
          const updatedPlayer = {
            ...player,
            nobles: [...player.nobles, noble],
            score: player.score + noble.points
          };
          availableNobles.splice(visitingNobleIndex, 1);
          return { updatedPlayer, updatedNobles: availableNobles };
        }

        return null;
      },

      selectToken: (color) => {
        const { tokens, selectedTokens } = get();
        const availableInBank = tokens[color];
        const currentSelectedCount = selectedTokens[color];

        if (availableInBank <= 0) return;

        const totalSelectedCount = Object.values(selectedTokens).reduce((a, b) => (a as number) + (b as number), 0);
        const hasDoubleSelection = Object.values(selectedTokens).some(count => count === 2);

        if (hasDoubleSelection) return;
        if (totalSelectedCount === 3) return;

        if (currentSelectedCount === 1) {
          if (totalSelectedCount > 1) return;
          if (availableInBank < 4) return;
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
        const { selectedTokens, tokens, players, currentPlayerIndex, checkNobles } = get();
        
        const updatedPlayers = [...players];
        let currentPlayer = { 
          ...updatedPlayers[currentPlayerIndex], 
          tokens: { ...updatedPlayers[currentPlayerIndex].tokens } 
        };
        
        Object.entries(selectedTokens).forEach(([color, count]) => {
          currentPlayer.tokens[color as GemColor] += (count as number);
        });

        // 귀족 체크
        const nobleResult = checkNobles(currentPlayer);
        let updatedNobles = get().nobles;
        if (nobleResult) {
          currentPlayer = nobleResult.updatedPlayer;
          updatedNobles = nobleResult.updatedNobles;
        }

        updatedPlayers[currentPlayerIndex] = currentPlayer;

        const updatedBank = { ...tokens };
        Object.entries(selectedTokens).forEach(([color, count]) => {
          updatedBank[color as GemColor] -= (count as number);
        });

        const totalAfterTaking = Object.values(currentPlayer.tokens).reduce((a, b) => (a as number) + (b as number), 0);
        
        if (totalAfterTaking > 10) {
          set({
            players: updatedPlayers,
            tokens: updatedBank,
            nobles: updatedNobles,
            isDiscardingMode: true,
            selectedTokens: { white: 0, blue: 0, green: 0, red: 0, black: 0 }
          });
        } else {
          set({
            players: updatedPlayers,
            tokens: updatedBank,
            nobles: updatedNobles,
            selectedTokens: { white: 0, blue: 0, green: 0, red: 0, black: 0 }
          });
          get().nextTurn();
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

        currentPlayer.tokens[color] -= 1;
        const updatedBank = { ...tokens, [color]: (tokens[color] as number) + 1 };
        updatedPlayers[currentPlayerIndex] = currentPlayer;

        const currentTotal = Object.values(currentPlayer.tokens).reduce((a, b) => (a as number) + (b as number), 0);
        
        if (currentTotal <= 10) {
          set({
            players: updatedPlayers,
            tokens: updatedBank,
            isDiscardingMode: false
          });
          get().nextTurn();
        } else {
          set({
            players: updatedPlayers,
            tokens: updatedBank
          });
        }
      },

      reserveCard: (card: Card) => {
        const { players, currentPlayerIndex, tokens, board, decks, checkNobles } = get();
        const currentPlayer = players[currentPlayerIndex];

        if (currentPlayer.reservedCards.length >= 3) return;

        const updatedPlayers = [...players];
        let updatedPlayer = { 
          ...currentPlayer, 
          tokens: { ...currentPlayer.tokens },
          reservedCards: [...currentPlayer.reservedCards, card]
        };

        const updatedBank = { ...tokens };
        if (updatedBank.gold > 0) {
          updatedPlayer.tokens.gold += 1;
          updatedBank.gold -= 1;
        }

        // 귀족 체크
        const nobleResult = checkNobles(updatedPlayer);
        let updatedNobles = get().nobles;
        if (nobleResult) {
          updatedPlayer = nobleResult.updatedPlayer;
          updatedNobles = nobleResult.updatedNobles;
        }

        updatedPlayers[currentPlayerIndex] = updatedPlayer;

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

          const totalTokens = Object.values(updatedPlayer.tokens).reduce((a, b) => (a as number) + (b as number), 0);
          
          if (totalTokens > 10) {
            set({
              players: updatedPlayers,
              tokens: updatedBank,
              board: updatedBoard,
              decks: updatedDecks,
              nobles: updatedNobles,
              isDiscardingMode: true
            });
          } else {
            set({
              players: updatedPlayers,
              tokens: updatedBank,
              board: updatedBoard,
              decks: updatedDecks,
              nobles: updatedNobles
            });
            get().nextTurn();
          }
        }
      },

      buyCard: (card: Card, isReserved: boolean = false) => {
        const { players, currentPlayerIndex, tokens, board, decks, checkNobles } = get();
        const currentPlayer = players[currentPlayerIndex];

        const costEntries = Object.entries(card.cost) as [Exclude<GemColor, "gold">, number][];
        let requiredGold = 0;
        const tokenPayment: Partial<Record<GemColor, number>> = {};

        for (const [color, totalRequired] of costEntries) {
          const bonus = currentPlayer.cards.filter(c => c.gemColor === color).length;
          const netCost = Math.max(0, totalRequired - bonus);
          if (netCost > 0) {
            const playerTokens = currentPlayer.tokens[color];
            if (playerTokens >= netCost) {
              tokenPayment[color] = netCost;
            } else {
              tokenPayment[color] = playerTokens;
              requiredGold += (netCost - playerTokens);
            }
          }
        }

        if (currentPlayer.tokens.gold < requiredGold) return;

        const updatedPlayers = [...players];
        let updatedPlayer = { 
          ...currentPlayer, 
          tokens: { ...currentPlayer.tokens },
          cards: [...currentPlayer.cards, card],
          score: currentPlayer.score + card.points
        };

        if (isReserved) {
          updatedPlayer.reservedCards = updatedPlayer.reservedCards.filter(c => c.id !== card.id);
        }

        const updatedBank = { ...tokens };
        Object.entries(tokenPayment).forEach(([color, amount]) => {
          updatedPlayer.tokens[color as GemColor] -= (amount as number);
          updatedBank[color as GemColor] += (amount as number);
        });
        
        if (requiredGold > 0) {
          updatedPlayer.tokens.gold -= requiredGold;
          updatedBank.gold += (requiredGold as number);
        }

        // 귀족 체크
        const nobleResult = checkNobles(updatedPlayer);
        let updatedNobles = get().nobles;
        if (nobleResult) {
          updatedPlayer = nobleResult.updatedPlayer;
          updatedNobles = nobleResult.updatedNobles;
        }

        updatedPlayers[currentPlayerIndex] = updatedPlayer;

        const updatedBoard = { ...board };
        const updatedDecks = { ...decks };

        if (!isReserved) {
          const levelBoard = [...updatedBoard[card.level]];
          const cardIndex = levelBoard.findIndex(c => c.id === card.id);
          if (cardIndex !== -1) {
            const levelDeck = [...updatedDecks[card.level]];
            if (levelDeck.length > 0) {
              const nextCard = levelDeck.shift()!;
              levelBoard[cardIndex] = nextCard;
              updatedDecks[card.level] = levelDeck;
            } else {
              levelBoard.splice(cardIndex, 1);
            }
            updatedBoard[card.level] = levelBoard;
          }
        }

        set({
          players: updatedPlayers,
          tokens: updatedBank,
          board: updatedBoard,
          decks: updatedDecks,
          nobles: updatedNobles
        });
        get().nextTurn();
      },
    }),
    {
      name: 'splendor-game-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
