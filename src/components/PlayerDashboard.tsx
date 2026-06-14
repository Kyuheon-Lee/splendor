"use client";

import { useGameStore } from "@/store/useGameStore";
import { Card, GemColor, Player } from "@/types/game";
import { ELEMENT_THEMES } from "@/constants/themes";
import { cn } from "@/lib/utils";

// --- 하위 컴포넌트들 ---

/** 1. 플레이어 보너스 배지 목록 */
const BonusBadges = ({ playerCards }: { playerCards: Card[] }) => {
  const hasNoBonuses = playerCards.length === 0;

  return (
    <div className="flex gap-1 items-center bg-black/30 px-2 py-1 rounded-lg border border-white/5 shadow-inner">
      {Object.entries(ELEMENT_THEMES).map(([color, theme]) => {
        const bonusCount = playerCards.filter(c => c.gemColor === color).length;
        if (bonusCount === 0) return null;
        return (
          <div key={color} className="flex items-center gap-0.5" title={`${theme.name} Bonus: ${bonusCount}`}>
            <span className="text-xs">{theme.icons[0]}</span>
            <span className="text-[10px] font-black text-amber-500">{bonusCount}</span>
          </div>
        );
      })}
      {hasNoBonuses && (
        <span className="text-[9px] text-zinc-600 font-bold uppercase italic tracking-tighter">
          No Bonuses
        </span>
      )}
    </div>
  );
};

/** 2. 개별 토큰 버튼 (Inventory용) */
const TokenItem = ({ 
  color, 
  count, 
  isCurrent, 
  isDiscardingMode, 
  onDiscard 
}: { 
  color: string; 
  count: number; 
  isCurrent: boolean; 
  isDiscardingMode: boolean; 
  onDiscard: (color: GemColor) => void;
}) => {
  const isSelectable = isCurrent && isDiscardingMode && count > 0;

  return (
    <button 
      disabled={!isSelectable}
      onClick={(e) => {
        e.stopPropagation();
        onDiscard(color as GemColor);
      }}
      className={cn(
        "flex flex-col items-center gap-1 group/token transition-all cursor-default p-1 rounded-lg",
        isSelectable && "hover:scale-125 cursor-pointer bg-white/5 ring-1 ring-white/20"
      )}
    >
      <div className={cn(
        "w-full h-1.5 rounded-full transition-all",
        color === 'white' && 'bg-slate-100',
        color === 'blue' && 'bg-blue-500',
        color === 'green' && 'bg-emerald-500',
        color === 'red' && 'bg-orange-600',
        color === 'black' && 'bg-zinc-900',
        color === 'gold' && 'bg-amber-400',
        isSelectable && "h-2.5 ring-2 ring-white/30 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
      )} />
      <span className={cn(
        "text-xs font-black",
        isSelectable ? "text-white underline decoration-white/30" : isCurrent ? "text-white" : "text-zinc-500"
      )}>
        {count}
      </span>
    </button>
  );
};

/** 3. 예약된 카드 아이템 */
const ReservedCardItem = ({ 
  card, 
  isCurrent, 
  isDiscardingMode, 
  affordable, 
  onBuy 
}: { 
  card: Card; 
  isCurrent: boolean; 
  isDiscardingMode: boolean; 
  affordable: boolean; 
  onBuy: (card: Card) => void;
}) => {
  const theme = ELEMENT_THEMES[card.gemColor];
  const canBeBought = isCurrent && !isDiscardingMode && affordable;

  return (
    <div 
      onClick={() => canBeBought && onBuy(card)}
      className={cn(
        "w-20 h-28 rounded-xl flex flex-col items-center justify-between p-2 shadow-2xl border-2 transition-all duration-300 relative group overflow-hidden active:scale-95",
        theme.bg,
        canBeBought 
          ? "cursor-pointer hover:-translate-y-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] ring-2 ring-emerald-400/20" 
          : "cursor-default border-white/20 opacity-60 grayscale-[0.3]"
      )}
    >
      <div className="w-full flex justify-between items-start z-10">
        <span className={cn(
          "text-lg font-black italic leading-none drop-shadow-md",
          card.gemColor === 'white' ? 'text-zinc-800' : 'text-white'
        )}>
          {card.points > 0 ? card.points : ""}
        </span>
        <span className="text-sm opacity-80">{theme.icons[0]}</span>
      </div>
      
      <span className="text-3xl drop-shadow-2xl my-1 group-hover:scale-110 transition-transform">
        {theme.icons[card.level - 1]}
      </span>
      
      <div className="w-full bg-black/20 rounded-lg p-1 grid grid-cols-2 gap-x-1 gap-y-0.5 mt-auto border border-white/5">
        {Object.entries(card.cost).map(([color, amount]) => (
          <div key={color} className="flex items-center gap-1">
            <div className={cn(
              "w-2 shadow-sm h-2 rounded-full",
              color === 'white' && 'bg-slate-100',
              color === 'blue' && 'bg-blue-500',
              color === 'green' && 'bg-emerald-500',
              color === 'red' && 'bg-orange-600',
              color === 'black' && 'bg-zinc-900'
            )} />
            <span className="text-[9px] font-black text-white/90">{amount}</span>
          </div>
        ))}
      </div>

      {canBeBought && (
        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

// --- 메인 컴포넌트 ---

export default function PlayerDashboard() {
  const { players, currentPlayerIndex, isDiscardingMode, discardToken, buyCard } = useGameStore();

  const canBuyCard = (player: Player, card: Card) => {
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
            className={cn(
              "p-6 rounded-3xl border-2 transition-all duration-500 relative overflow-hidden flex flex-col gap-4",
              isCurrent 
                ? isDiscardingMode 
                  ? "bg-amber-900/20 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
                  : "bg-zinc-800 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
                : "bg-zinc-800/40 border-zinc-700 opacity-60"
            )}
          >
            {/* 반납 모드 오버레이 */}
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

            {/* 헤더 섹션: 이름, 보너스, 점수 */}
            <div className="flex justify-between items-start relative z-20">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                   <div className={cn("w-2 h-2 rounded-full", isCurrent ? "bg-amber-500 animate-pulse" : "bg-zinc-600")} />
                   <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Elemental Master</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xl font-black", isCurrent ? "text-white" : "text-zinc-400")}>{player.name}</span>
                  <BonusBadges playerCards={player.cards} />
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="bg-zinc-900/50 px-3 py-1.5 rounded-2xl border border-white/5 mb-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase mb-0.5 block text-right">Victory Points</span>
                  <div className="flex items-center gap-2">
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

            {/* 인벤토리 섹션 */}
            <div className="relative z-20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Essence Inventory</span>
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-full border transition-colors",
                  playerTokenTotal > 10 ? "bg-amber-500 text-white border-amber-400 animate-pulse" : "bg-zinc-900 border-zinc-700 text-zinc-400"
                )}>
                  {playerTokenTotal} / 10
                </span>
              </div>
              
              <div className="grid grid-cols-6 gap-2 bg-black/20 p-2 rounded-xl border border-white/5">
                 {Object.entries(player.tokens).map(([color, count]) => (
                   <TokenItem 
                     key={color}
                     color={color}
                     count={count as number}
                     isCurrent={isCurrent}
                     isDiscardingMode={isDiscardingMode}
                     onDiscard={discardToken}
                   />
                 ))}
              </div>
            </div>

            {/* 예약 카드 섹션 */}
            {(player.reservedCards.length > 0 || isCurrent) && (
              <div className={cn(
                "mt-2 p-3 rounded-2xl border border-dashed transition-colors relative z-20",
                isCurrent ? "bg-zinc-900/50 border-amber-500/30" : "bg-transparent border-zinc-700/50"
              )}>
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
                  {player.reservedCards.map((card) => (
                    <ReservedCardItem 
                      key={card.id}
                      card={card}
                      isCurrent={isCurrent}
                      isDiscardingMode={isDiscardingMode}
                      affordable={canBuyCard(player, card)}
                      onBuy={(c) => buyCard(c, true)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
