"use client";

import { useGameStore } from "@/store/useGameStore";
import { GemColor } from "@/types/game";

export default function PlayerDashboard() {
  const { players, currentPlayerIndex, isDiscardingMode, discardToken } = useGameStore();

  return (
    <div className="flex flex-col gap-4">
      {players.map((player, idx) => {
        const isCurrent = idx === currentPlayerIndex;
        const playerTokenTotal = Object.values(player.tokens).reduce((a, b) => (a as number) + (b as number), 0);
        const tokensToDiscard = Math.max(0, playerTokenTotal - 10);
        
        return (
          <div 
            key={player.id} 
            className={`p-5 rounded-2xl border-2 transition-all duration-500 relative overflow-hidden ${
              isCurrent 
              ? isDiscardingMode 
                ? 'bg-red-900/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-105 z-50'
                : 'bg-amber-900/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
              : 'bg-zinc-800/40 border-zinc-700 opacity-50 scale-95 origin-right'
            }`}
          >
            {/* 반납 모드 안내 오버레이 */}
            {isCurrent && isDiscardingMode && (
              <div className="absolute inset-0 bg-red-600/10 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 p-2 text-center pointer-events-none">
                <span className="text-white font-black text-sm uppercase mb-1 drop-shadow-md">Discarding Mode</span>
                <span className="text-red-400 text-[10px] font-bold tracking-tighter bg-zinc-900/80 px-2 py-0.5 rounded-full">
                  반납할 정수를 클릭하세요 ({tokensToDiscard}개 더)
                </span>
              </div>
            )}

            {isCurrent && !isDiscardingMode && (
              <div className="absolute top-0 right-0 p-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              </div>
            )}
            
            <div className="relative z-20 flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Master</span>
                <span className="font-black text-lg">{player.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Score</span>
                <span className="text-amber-500 font-black text-2xl leading-none">{player.score}</span>
              </div>
            </div>
            
            <div className="relative z-20 mb-3 flex justify-end">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                playerTokenTotal > 10 
                ? 'bg-red-500 text-white border-red-400 animate-pulse' 
                : playerTokenTotal === 10
                ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                : 'bg-zinc-900 border-zinc-700 text-zinc-500'
              }`}>
                ESSENCES: {playerTokenTotal} / 10
              </span>
            </div>

            <div className="relative z-30 grid grid-cols-6 gap-2">
               {Object.entries(player.tokens).map(([color, count]) => (
                 <button 
                   key={color} 
                   disabled={!isCurrent || !isDiscardingMode || (count as number) <= 0}
                   onClick={(e) => {
                     e.stopPropagation();
                     discardToken(color as GemColor);
                   }}
                   className={`flex flex-col items-center gap-1 group/token transition-all ${isCurrent && isDiscardingMode && (count as number) > 0 ? 'hover:scale-125 cursor-pointer ring-1 ring-red-500/50 rounded-lg p-1 bg-red-500/5' : 'cursor-default'}`}
                 >
                   <div className={`w-full h-1.5 rounded-full transition-all ${
                     color === 'white' ? 'bg-slate-100' : 
                     color === 'blue' ? 'bg-blue-500' :
                     color === 'green' ? 'bg-emerald-500' :
                     color === 'red' ? 'bg-orange-600' :
                     color === 'black' ? 'bg-zinc-900' : 'bg-amber-400'
                   } ${isCurrent && isDiscardingMode && (count as number) > 0 ? 'group-hover/token:h-3 group-hover/token:bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`} />
                   <span className={`text-[10px] font-black ${isCurrent && isDiscardingMode && (count as number) > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                     {count}
                   </span>
                 </button>
               ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
