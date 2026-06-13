"use client";

import { useGameStore } from "@/store/useGameStore";
import CardItem from "./CardItem";
import { Card, GemColor } from "@/types/game";

export default function GameBoard() {
  const { board, decks, players, currentPlayerIndex, isDiscardingMode, reserveCard } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];

  // 카드 구매 가능 여부 확인 (나중에 buyCard 구현 시 정교화)
  const canBuyCard = (card: Card) => {
    if (!currentPlayer) return false;
    let requiredGold = 0;
    for (const [color, amount] of Object.entries(card.cost)) {
      const bonus = currentPlayer.cards.filter(c => c.gemColor === color).length;
      const netCost = Math.max(0, amount - bonus);
      if (netCost > currentPlayer.tokens[color as GemColor]) {
        requiredGold += (netCost - currentPlayer.tokens[color as GemColor]);
      }
    }
    return currentPlayer.tokens.gold >= requiredGold;
  };

  const canReserve = currentPlayer?.reservedCards.length < 3;

  return (
    <section className={`flex-[3] flex flex-col gap-4 bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 overflow-y-auto custom-scrollbar transition-opacity ${isDiscardingMode ? 'opacity-30 pointer-events-none' : ''}`}>
      <h3 className="text-zinc-400 font-bold mb-2 flex items-center gap-2 uppercase tracking-tighter">
        <span className="w-2 h-2 bg-zinc-500 rounded-full" />
        고대 원소 마법서 (개발 카드)
      </h3>
      {[3, 2, 1].map((level) => (
        <div key={level} className="flex gap-4 items-center bg-zinc-700/20 p-4 rounded-2xl border border-zinc-700/50">
          {/* 덱 표시 (덱 클릭 시 예약 가능 규칙 추가 예정) */}
          <div className="relative group">
            <div className="w-32 h-48 bg-zinc-800 rounded-xl flex flex-col items-center justify-center font-bold border-2 border-zinc-600 shadow-2xl relative overflow-hidden group-hover:border-zinc-500 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <span className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Level {level}</span>
              <span className="text-4xl text-zinc-300 font-black">{decks[level as 1|2|3]?.length || 0}</span>
              <div className="mt-2 flex gap-0.5">
                {[...Array(level)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                ))}
              </div>
            </div>
          </div>
          
          {/* 보드 카드 표시 */}
          <div className="flex-1 flex gap-6">
            {board[level as 1|2|3]?.map((card) => (
              <div key={card.id} className="relative group">
                <CardItem card={card} />
                
                {/* 액션 오버레이 (호버 시 나타남) */}
                <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 bg-black/60 rounded-xl backdrop-blur-[2px]">
                  <button 
                    disabled={!canBuyCard(card)}
                    className={`w-24 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all
                      ${canBuyCard(card) ? 'bg-emerald-500 text-white hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}
                    `}
                  >
                    Buy
                  </button>
                  <button 
                    onClick={() => canReserve && reserveCard(card)}
                    disabled={!canReserve}
                    className={`w-24 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all
                      ${canReserve ? 'bg-amber-500 text-zinc-900 hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}
                    `}
                  >
                    Reserve
                  </button>
                </div>

                {/* 구매 가능할 때 하이라이트 (READY) */}
                {canBuyCard(card) && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full z-40 shadow-lg animate-bounce uppercase">
                    Ready
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
