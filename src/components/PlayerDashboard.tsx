"use client";

import { useGameStore } from "@/store/useGameStore";
import { GemColor } from "@/types/game";
import { ELEMENT_THEMES } from "@/constants/themes";

export default function PlayerDashboard() {
  const { players, currentPlayerIndex, isDiscardingMode, discardToken } = useGameStore();

  return (
    <div className="flex flex-col gap-6">
      {players.map((player, idx) => {
        const isCurrent = idx === currentPlayerIndex;
        const playerTokenTotal = Object.values(player.tokens).reduce((a, b) => (a as number) + (b as number), 0);
        const tokensToDiscard = Math.max(0, playerTokenTotal - 10);
        
        return (
          <div 
            key={player.id} 
            className={`p-6 rounded-3xl border-2 transition-all duration-500 relative overflow-hidden flex flex-col gap-4 ${
              isCurrent 
              ? isDiscardingMode 
                ? 'bg-red-900/20 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)] scale-105 z-50'
                : 'bg-zinc-800 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
              : 'bg-zinc-800/40 border-zinc-700 opacity-60'
            }`}
          >
            {/* 1. 마스터 정보 영역 */}
            <div className="flex justify-between items-start relative z-20">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                   <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-500 animate-pulse' : 'bg-zinc-600'}`} />
                   <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Elemental Master</span>
                </div>
                <span className={`text-xl font-black ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>{player.name}</span>
              </div>
              
              <div className="flex flex-col items-end bg-zinc-900/50 px-3 py-1.5 rounded-2xl border border-white/5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase mb-0.5">Victory Points</span>
                <span className="text-3xl font-black text-amber-500 leading-none drop-shadow-lg">{player.score}</span>
              </div>
            </div>

            {/* 2. 보유 정수 영역 */}
            <div className="relative z-20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Essence Inventory</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border transition-colors ${
                  playerTokenTotal > 10 
                  ? 'bg-red-500 text-white border-red-400 animate-pulse' 
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                }`}>
                  {playerTokenTotal} / 10
                </span>
              </div>
              
              <div className="grid grid-cols-6 gap-2 bg-black/20 p-2 rounded-xl border border-white/5">
                 {Object.entries(player.tokens).map(([color, count]) => {
                   const theme = color === 'gold' 
                     ? { bg: "bg-amber-400" } 
                     : ELEMENT_THEMES[color];

                   return (
                     <button 
                       key={color} 
                       disabled={!isCurrent || !isDiscardingMode || (count as number) <= 0}
                       onClick={(e) => {
                         e.stopPropagation();
                         discardToken(color as GemColor);
                       }}
                       className={`flex flex-col items-center gap-1 group/token transition-all ${isCurrent && isDiscardingMode && (count as number) > 0 ? 'hover:scale-125 cursor-pointer p-1 bg-red-500/10 rounded-lg ring-1 ring-red-500/50' : 'cursor-default'}`}
                     >
                       <div className={`w-full h-1.5 rounded-full transition-all ${
                         color === 'white' ? 'bg-slate-100' : 
                         color === 'blue' ? 'bg-blue-500' :
                         color === 'green' ? 'bg-emerald-500' :
                         color === 'red' ? 'bg-orange-600' :
                         color === 'black' ? 'bg-zinc-900' : 'bg-amber-400'
                       } ${isCurrent && isDiscardingMode && (count as number) > 0 ? 'h-2.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`} />
                       <span className={`text-xs font-black ${isCurrent && isDiscardingMode && (count as number) > 0 ? 'text-red-400' : isCurrent ? 'text-white' : 'text-zinc-500'}`}>
                         {count}
                       </span>
                     </button>
                   );
                 })}
              </div>
            </div>

            {/* 3. 예약된 마법서 영역 (명확한 강조) */}
            {(player.reservedCards.length > 0 || isCurrent) && (
              <div className={`mt-2 p-3 rounded-2xl border border-dashed transition-colors relative z-20 ${
                isCurrent ? 'bg-zinc-900/50 border-amber-500/30' : 'bg-transparent border-zinc-700/50'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-amber-500 rounded-full" />
                    Reserved Spells
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 italic">{player.reservedCards.length} / 3</span>
                </div>
                
                <div className="flex gap-3 h-24 items-center">
                  {player.reservedCards.length === 0 && isCurrent && (
                    <div className="flex-1 flex items-center justify-center border border-zinc-700/30 rounded-xl h-full border-dashed">
                      <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter italic">Empty Slots</span>
                    </div>
                  )}
                  {player.reservedCards.map((card) => {
                    const theme = ELEMENT_THEMES[card.gemColor];
                    return (
                      <div 
                        key={card.id} 
                        className={`w-16 h-22 rounded-xl ${theme.bg} flex flex-col items-center justify-between p-2 shadow-2xl border-2 border-white/20 relative group overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-300`}
                      >
                        <div className="absolute top-0.5 left-1.5 flex flex-col">
                           <span className={`text-sm font-black italic ${card.gemColor === 'white' ? 'text-zinc-800' : 'text-white'} drop-shadow-md`}>
                             {card.points > 0 ? card.points : ""}
                           </span>
                        </div>
                        
                        <span className="text-3xl drop-shadow-xl my-auto">{theme.icons[card.level - 1]}</span>
                        
                        {/* 레벨 표시기 */}
                        <div className="flex gap-0.5 mt-auto w-full justify-center opacity-30">
                          {[...Array(card.level)].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-black" />
                          ))}
                        </div>

                        {/* 클릭 유도 오버레이 */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                           <span className="text-[8px] text-white font-black uppercase tracking-tighter">Buy Now</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 반납 모드 오버레이 (클릭 방해 금지) */}
            {isCurrent && isDiscardingMode && (
              <div className="absolute inset-0 bg-red-600/5 backdrop-blur-[1px] pointer-events-none z-10 flex items-center justify-center">
                <div className="bg-zinc-900 border border-red-500 px-4 py-2 rounded-full shadow-2xl animate-bounce">
                  <span className="text-red-500 font-black text-xs uppercase tracking-widest">
                    Discard {tokensToDiscard} Essences!
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
