export type GemColor = "white" | "blue" | "green" | "red" | "black" | "gold";

export interface Cost {
  white?: number;
  blue?: number;
  green?: number;
  red?: number;
  black?: number;
}

export interface Card {
  id: string;
  level: 1 | 2 | 3;
  gemColor: Exclude<GemColor, "gold">;
  points: number;
  cost: Cost;
}

export interface Noble {
  id: string;
  points: number;
  cost: Cost;
}

export interface Player {
  id: number;
  name: string;
  tokens: Record<GemColor, number>;
  cards: Card[];
  reservedCards: Card[];
  nobles: Noble[];
  score: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  tokens: Record<GemColor, number>;
  decks: {
    1: Card[];
    2: Card[];
    3: Card[];
  };
  board: {
    1: Card[];
    2: Card[];
    3: Card[];
  };
  nobles: Noble[];
  turn: number;
  selectedTokens: Record<Exclude<GemColor, "gold">, number>;
  isDiscardingMode: boolean; // 토큰 반납 모드 여부
  isGameOver: boolean;
  winner: Player | null;
  lastRound: boolean;
}
