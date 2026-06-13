"use client";

import { useGameStore } from "@/store/useGameStore";
import CardItem from "./CardItem";
import { Card, GemColor } from "@/types/game";

export default function GameBoard() {
  const { board, decks, players, currentPlayerIndex, nobles, isDiscardingMode, reserveCard, buyCard } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];

  // 카드 구매 가능 여부 확인
  const canBuyCard = (card: Card) => {
    if (!currentPlayer) return false;
    let requiredGold = 0;
    for (const [color, amount] of Object.entries(card.cost)) {
      const bonus = currentPlayer.cards.filter(c => c.gemColor === color).length;
      const netCost = Math.max(0, (amount as number) - bonus);
      if (netCost > currentPlayer.tokens[color as GemColor]) {
        requiredGold += (netCost - currentPlayer.tokens[color as GemColor]);
      }
    }
    return currentPlayer.tokens.gold >= requiredGold;
  };

  const canReserve = currentPlayer?.reservedCards.length < 3;

  return (
    <section className={`flex-[3] flex flex-col gap-4 bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 overflow-y-auto custom-scrollbar transition-opacity ${isDiscardingMode ? 'opacity-30 pointer-events-none' : ''}`}>
      
      {/* Noble Guardians Section */}
      <div className="mb-6">
        <h3 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          Noble Guardians
        </h3>
        <div className="flex gap-4">
          {nobles.map((noble) => (
            <div 
              key={noble.id}
              className="w-24 h-24 bg-zinc-100 rounded-xl shadow-2xl border-b-4 border-zinc-300 flex flex-col items-center justify-between p-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-black to-transparent" />
              <span className="absolute top-1 left-2 text-xl font-black text-zinc-800 italic drop-shadow-sm border-b border-black/10">3</span>
              <span className="text-3xl mt-2 group-hover:scale-110 transition-transform">👑</span>
              <div className="absolute bottom-1 left-1.5 flex flex-col gap-0.5">
                {Object.entries(noble.cost).map(([color, amount]) => (
                  <div key={color} className={`w-4 h-4 rounded-md flex items-center justify-center text-[8px] font-black text-white shadow-sm
                    ${color === 'white' ? 'bg-slate-300' : 
                      color === 'blue' ? 'bg-blue-500' :
                      color === 'green' ? 'bg-emerald-500' :
                      color === 'red' ? 'bg-orange-600' : 'bg-zinc-800'}
                  `}>
                    {amount}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {[...Array(Math.max(0, 3 - nobles.length))].map((_, i) => (
            <div key={i} className="w-24 h-24 border-2 border-dashed border-zinc-700/50 rounded-xl flex items-center justify-center">
              <span className="text-zinc-700 text-[10px] font-bold uppercase italic">Visited</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
        Ancient Spellbooks
      </h3>

      {[3, 2, 1].map((level) => (
        <div key={level} className="flex gap-4 items-center bg-zinc-700/20 p-4 rounded-2xl border border-zinc-700/50">
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
          
          <div className="flex-1 flex gap-6">
            {board[level as 1|2|3]?.map((card) => (
              <div key={card.id} className="relative group">
                <CardItem card={card} />
                
                {/* 액션 오버레이 */}
                <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 bg-black/60 rounded-xl backdrop-blur-[2px]">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canBuyCard(card)) buyCard(card);
                    }}
                    disabled={!canBuyCard(card)}
                    className={`w-24 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all
                      ${canBuyCard(card) ? 'bg-emerald-500 text-white hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}
                    `}
                  >
                    Buy
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canReserve) reserveCard(card);
                    }}
                    disabled={!canReserve}
                    className={`w-24 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all
                      ${canReserve ? 'bg-amber-500 text-zinc-900 hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}
                    `}
                  >
                    Reserve
                  </button>
                </div>

                {/* 구매 가능 하이라이트 */}
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
