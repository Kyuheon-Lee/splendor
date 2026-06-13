import { Card } from "@/types/game";

// 보조 함수: 카드 생성을 단순화합니다.
const createCard = (id: string, level: 1 | 2 | 3, gemColor: Card["gemColor"], points: number, cost: Card["cost"]): Card => ({
  id, level, gemColor, points, cost
});

export const ALL_CARDS: Card[] = [
  // --- LEVEL 1 (40 cards) ---
  // White (Diamond) produced
  createCard("w1-1", 1, "white", 0, { blue: 1, green: 1, red: 1, black: 1 }),
  createCard("w1-2", 1, "white", 0, { blue: 1, green: 2, red: 1, black: 1 }),
  createCard("w1-3", 1, "white", 0, { red: 2, black: 1 }),
  createCard("w1-4", 1, "white", 0, { blue: 2, green: 2 }),
  createCard("w1-5", 1, "white", 0, { blue: 3 }),
  createCard("w1-6", 1, "white", 1, { green: 4 }),
  createCard("w1-7", 1, "white", 0, { white: 3, blue: 1, black: 1 }),
  createCard("w1-8", 1, "white", 0, { blue: 1, green: 1, red: 2, black: 1 }),

  // Blue (Sapphire) produced
  createCard("b1-1", 1, "blue", 0, { white: 1, green: 1, red: 1, black: 1 }),
  createCard("b1-2", 1, "blue", 0, { white: 1, green: 1, red: 2, black: 1 }),
  createCard("b1-3", 1, "blue", 0, { black: 2, white: 1 }),
  createCard("b1-4", 1, "blue", 0, { green: 2, black: 2 }),
  createCard("b1-5", 1, "blue", 0, { red: 3 }),
  createCard("b1-6", 1, "blue", 1, { red: 4 }),
  createCard("b1-7", 1, "blue", 0, { white: 1, blue: 3, green: 1 }),
  createCard("b1-8", 1, "blue", 0, { white: 2, green: 1, red: 1, black: 1 }),

  // Green (Emerald) produced
  createCard("g1-1", 1, "green", 0, { white: 1, blue: 1, red: 1, black: 1 }),
  createCard("g1-2", 1, "green", 0, { white: 2, blue: 1, red: 1, black: 1 }),
  createCard("g1-3", 1, "green", 0, { white: 2, blue: 1 }),
  createCard("g1-4", 1, "green", 0, { white: 2, red: 2 }),
  createCard("g1-5", 1, "green", 0, { black: 3 }),
  createCard("g1-6", 1, "green", 1, { black: 4 }),
  createCard("g1-7", 1, "green", 0, { blue: 1, green: 3, red: 1 }),
  createCard("g1-8", 1, "green", 0, { white: 1, blue: 2, red: 1, black: 1 }),

  // Red (Ruby) produced
  createCard("r1-1", 1, "red", 0, { white: 1, blue: 1, green: 1, black: 1 }),
  createCard("r1-2", 1, "red", 0, { white: 1, blue: 2, green: 1, black: 1 }),
  createCard("r1-3", 1, "red", 0, { blue: 2, green: 1 }),
  createCard("r1-4", 1, "red", 0, { white: 2, black: 2 }),
  createCard("r1-5", 1, "red", 0, { white: 3 }),
  createCard("r1-6", 1, "red", 1, { white: 4 }),
  createCard("r1-7", 1, "red", 0, { white: 1, green: 1, red: 3 }),
  createCard("r1-8", 1, "red", 0, { white: 1, blue: 1, green: 2, black: 1 }),

  // Black (Onyx) produced
  createCard("k1-1", 1, "black", 0, { white: 1, blue: 1, green: 1, red: 1 }),
  createCard("k1-2", 1, "black", 0, { white: 1, blue: 1, green: 2, red: 1 }),
  createCard("k1-3", 1, "black", 0, { white: 2, blue: 1 }),
  createCard("k1-4", 1, "black", 0, { green: 2, red: 2 }),
  createCard("k1-5", 1, "black", 0, { blue: 3 }),
  createCard("k1-6", 1, "black", 1, { blue: 4 }),
  createCard("k1-7", 1, "black", 0, { blue: 1, red: 1, black: 3 }),
  createCard("k1-8", 1, "black", 0, { white: 1, blue: 1, green: 1, red: 2 }),

  // --- LEVEL 2 (30 cards) ---
  createCard("w2-1", 2, "white", 1, { green: 3, red: 2, black: 2 }),
  createCard("w2-2", 2, "white", 2, { white: 3, red: 3, black: 3 }),
  createCard("w2-3", 2, "white", 2, { red: 5 }),
  createCard("w2-4", 2, "white", 3, { white: 6 }),
  createCard("w2-5", 2, "white", 1, { white: 2, blue: 2, black: 3 }),
  createCard("w2-6", 2, "white", 2, { white: 4, blue: 2, black: 1 }),

  createCard("b2-1", 2, "blue", 1, { white: 2, green: 3, red: 2 }),
  createCard("b2-2", 2, "blue", 2, { white: 3, blue: 3, green: 3 }),
  createCard("b2-3", 2, "blue", 2, { white: 5 }),
  createCard("b2-4", 2, "blue", 3, { blue: 6 }),
  createCard("b2-5", 2, "blue", 1, { blue: 2, green: 2, red: 3 }),
  createCard("b2-6", 2, "blue", 2, { blue: 4, green: 2, red: 1 }),

  createCard("g2-1", 2, "green", 1, { white: 3, blue: 2, black: 2 }),
  createCard("g2-2", 2, "green", 2, { blue: 3, green: 3, red: 3 }),
  createCard("g2-3", 2, "green", 2, { blue: 5 }),
  createCard("g2-4", 2, "green", 3, { green: 6 }),
  createCard("g2-5", 2, "green", 1, { white: 2, blue: 3, red: 2 }),
  createCard("g2-6", 2, "green", 2, { green: 4, red: 2, black: 1 }),

  createCard("r2-1", 2, "red", 1, { white: 2, blue: 2, black: 3 }),
  createCard("r2-2", 2, "red", 2, { green: 3, red: 3, black: 3 }),
  createCard("r2-3", 2, "red", 2, { black: 5 }),
  createCard("r2-4", 2, "red", 3, { red: 6 }),
  createCard("r2-5", 2, "red", 1, { blue: 3, green: 2, black: 2 }),
  createCard("r2-6", 2, "red", 2, { white: 1, red: 4, black: 2 }),

  createCard("k2-1", 2, "black", 1, { white: 2, blue: 3, green: 2 }),
  createCard("k2-2", 2, "black", 2, { white: 3, blue: 3, black: 3 }),
  createCard("k2-3", 2, "black", 2, { green: 5 }),
  createCard("k2-4", 2, "black", 3, { black: 6 }),
  createCard("k2-5", 2, "black", 1, { white: 3, green: 2, red: 2 }),
  createCard("k2-6", 2, "black", 2, { white: 2, green: 1, black: 4 }),

  // --- LEVEL 3 (20 cards) ---
  createCard("w3-1", 3, "white", 3, { black: 7 }),
  createCard("w3-2", 3, "white", 4, { white: 3, black: 6, red: 3 }),
  createCard("w3-3", 3, "white", 4, { black: 7, white: 3 }),
  createCard("w3-4", 3, "white", 5, { white: 3, black: 7 }),

  createCard("b3-1", 3, "blue", 3, { white: 7 }),
  createCard("b3-2", 3, "blue", 4, { white: 3, blue: 3, green: 6 }),
  createCard("b3-3", 3, "blue", 4, { white: 7, blue: 3 }),
  createCard("b3-4", 3, "blue", 5, { blue: 3, white: 7 }),

  createCard("g3-1", 3, "green", 3, { blue: 7 }),
  createCard("g3-2", 3, "green", 4, { blue: 3, green: 3, red: 6 }),
  createCard("g3-3", 3, "green", 4, { blue: 7, green: 3 }),
  createCard("g3-4", 3, "green", 5, { green: 3, blue: 7 }),

  createCard("r3-1", 3, "red", 3, { green: 7 }),
  createCard("r3-2", 3, "red", 4, { green: 3, red: 3, black: 6 }),
  createCard("r3-3", 3, "red", 4, { green: 7, red: 3 }),
  createCard("r3-4", 3, "red", 5, { red: 3, green: 7 }),

  createCard("k3-1", 3, "black", 3, { red: 7 }),
  createCard("k3-2", 3, "black", 4, { red: 3, black: 3, white: 6 }),
  createCard("k3-3", 3, "black", 4, { red: 7, black: 3 }),
  createCard("k3-4", 3, "black", 5, { black: 3, red: 7 }),
];
