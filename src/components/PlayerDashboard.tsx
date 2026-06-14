"use client";

import { useGameStore } from "@/store/useGameStore";
import { Card, GemColor } from "@/types/game";
import { ELEMENT_THEMES } from "@/constants/themes";

export default function PlayerDashboard() {
  const { players, currentPlayerIndex, isDiscardingMode, discardToken, buyCard } = useGameStore();

  // 카드 구매 가능 여부 확인 함수 (내부 재사용)
  const canBuyCard = (player: any, card: Card) => {
    let requiredGold = 0;
    const costEntries = Object.entries(card.cost) as [Exclude<GemColor, "gold">, number][];

    for (const [color, amount] of costEntries) {
      const bonus = player.cards.filter((c: Card) => c.gemColor === color).length;
      const netCost = Math.max(0, amount - bonus);
      if (netCost > player.tokens[color]) {
        requiredGold += (netCost - player.tokens[color]);
      }
    }
    return player.tokens.gold >= requiredGold;
  };

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
                ? 'bg-amber-900/20 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.3)]'
                : 'bg-zinc-800 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
              : 'bg-zinc-800/40 border-zinc-700 opacity-60'
            }`}
          >
            {/* 1. 마스터 정보 및 보너스 현황 */}
            <div className="flex justify-between items-start relative z-20">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                   <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-500 animate-pulse' : 'bg-zinc-600'}`} />
                   <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Elemental Master</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-black ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>{player.name}</span>
                  
                  {/* 영구 보너스 표시 (구매한 카드 개수) */}
                  <div className="flex gap-1 items-center bg-black/30 px-2 py-1 rounded-lg border border-white/5 shadow-inner">
                    {Object.entries(ELEMENT_THEMES).map(([color, theme]) => {
                      const bonusCount = player.cards.filter(c => c.gemColor === color).length;
                      if (bonusCount === 0) return null;
                      return (
                        <div key={color} className="flex items-center gap-0.5" title={`${theme.name} Bonus: ${bonusCount}`}>
                           <span className="text-xs">{theme.icons[0]}</span>
                           <span className="text-[10px] font-black text-amber-500">{bonusCount}</span>
                        </div>
                      );
                    })}
                    {player.cards.length === 0 && <span className="text-[9px] text-zinc-600 font-bold uppercase italic tracking-tighter">No Bonuses</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="bg-zinc-900/50 px-3 py-1.5 rounded-2xl border border-white/5 mb-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase mb-0.5 block text-right">Victory Points</span>
                  <div className="flex items-center gap-2">
                    {/* 방문한 귀족 표시 */}
                    {player.nobles.length > 0 && (
                      <div className="flex -space-x-2 mr-1">
                         {player.nobles.map((noble, i) => (
                           <div key={i} className="w-6 h-6 bg-zinc-100 rounded-full border border-zinc-300 flex items-center justify-center text-xs shadow-lg" title="Noble Visited (+3 Points)">👑</div>
                         ))}
                      </div>
                    )}
                    <span className="text-3xl font-black text-amber-500 leading-none drop-shadow-lg">{player.score}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 보유 정수 영역 */}
            <div className="relative z-20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Essence Inventory</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border transition-colors ${
                  playerTokenTotal > 10 
                  ? 'bg-amber-500 text-white border-amber-400 animate-pulse' 
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                }`}>
                  {playerTokenTotal} / 10
                </span>
              </div>
              
              <div className="grid grid-cols-6 gap-2 bg-black/20 p-2 rounded-xl border border-white/5">
                 {Object.entries(player.tokens).map(([color, count]) => {
                   return (
                     <button 
                       key={color} 
                       disabled={!isCurrent || !isDiscardingMode || (count as number) <= 0}
                       onClick={(e) => {
                         e.stopPropagation();
                         discardToken(color as GemColor);
                       }}
                       className={`flex flex-col items-center gap-1 group/token transition-all ${isCurrent && isDiscardingMode && (count as number) > 0 ? 'hover:scale-125 cursor-pointer p-1 bg-white/5 rounded-lg ring-1 ring-white/20' : 'cursor-default'}`}
                     >
                       <div className={`w-full h-1.5 rounded-full transition-all ${
                         color === 'white' ? 'bg-slate-100' : 
                         color === 'blue' ? 'bg-blue-500' :
                         color === 'green' ? 'bg-emerald-500' :
                         color === 'red' ? 'bg-orange-600' :
                         color === 'black' ? 'bg-zinc-900' : 'bg-amber-400'
                       } ${isCurrent && isDiscardingMode && (count as number) > 0 ? 'h-2.5 ring-2 ring-white/30 shadow-[0_0_10px_rgba(255,255,255,0.2)]' : ''}`} />
                       <span className={`text-xs font-black ${isCurrent && isDiscardingMode && (count as number) > 0 ? 'text-white underline decoration-white/30' : isCurrent ? 'text-white' : 'text-zinc-500'}`}>
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
                    const affordable = canBuyCard(player, card);
                    
                    return (
                      <div 
                        key={card.id} 
                        onClick={() => isCurrent && !isDiscardingMode && affordable && buyCard(card, true)}
                        className={`w-20 h-28 rounded-xl ${theme.bg} flex flex-col items-center justify-between p-2 shadow-2xl border-2 transition-all duration-300 relative group overflow-hidden active:scale-95
                          ${isCurrent && affordable 
                            ? 'cursor-pointer hover:-translate-y-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] ring-2 ring-emerald-400/20' 
                            : 'cursor-default border-white/20 opacity-60 grayscale-[0.3]'}
                        `}
                      >
                        {/* 상단: 점수 및 생산 아이콘 */}
                        <div className="w-full flex justify-between items-start z-10">
                           <span className={`text-lg font-black italic leading-none ${card.gemColor === 'white' ? 'text-zinc-800' : 'text-white'} drop-shadow-md`}>
                             {card.points > 0 ? card.points : ""}
                           </span>
                           <span className="text-sm opacity-80">{theme.icons[0]}</span>
                        </div>
                        
                        {/* 중앙: 대형 진화 아이콘 */}
                        <span className="text-3xl drop-shadow-2xl my-1 group-hover:scale-110 transition-transform">{theme.icons[card.level - 1]}</span>
                        
                        {/* 하단: 실시간 비용 정보 (항상 표시) */}
                        <div className="w-full bg-black/20 rounded-lg p-1 grid grid-cols-2 gap-x-1 gap-y-0.5 mt-auto border border-white/5">
                          {Object.entries(card.cost).map(([color, amount]) => (
                            <div key={color} className="flex items-center gap-1">
                               <div className={`w-2 h-2 rounded-full ${
                                 color === 'white' ? 'bg-slate-100' : 
                                 color === 'blue' ? 'bg-blue-500' :
                                 color === 'green' ? 'bg-emerald-500' :
                                 color === 'red' ? 'bg-orange-600' : 'bg-zinc-900'
                               }`} />
                               <span className="text-[9px] font-black text-white/90">{amount}</span>
                            </div>
                          ))}
                        </div>

                        {/* 구매 가능 알림 (마법진 효과) */}
                        {isCurrent && affordable && (
                          <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 반납 모드 오버레이 (클릭 방해 금지) */}
            {isCurrent && isDiscardingMode && (
              <>
                <div className="absolute inset-0 bg-amber-600/5 backdrop-blur-[0.5px] pointer-events-none z-10" />
                <div className="absolute top-4 right-4 pointer-events-none z-30">
                  <div className="bg-zinc-900 border border-amber-500 px-3 py-1.5 rounded-full shadow-2xl animate-pulse">
                    <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                      Discard {tokensToDiscard} Essences!
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
