"use client";

import { useGameStore } from "@/store/useGameStore";
import { ELEMENT_THEMES } from "@/constants/themes";
import { cn } from "@/lib/utils";
import { Player, Card } from "@/types/game";

/** 개별 플레이어 결과 행 컴포넌트 */
const ResultRow = ({ 
  player, 
  rank, 
  isWinner 
}: { 
  player: Player; 
  rank: number; 
  isWinner: boolean 
}) => (
  <div className={cn(
    "flex items-center justify-between p-4 rounded-2xl border transition-all",
    isWinner 
      ? "bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
      : "bg-zinc-800/50 border-zinc-700"
  )}>
    <div className="flex items-center gap-3">
      <span className="text-zinc-500 font-black italic">{rank}</span>
      <span className={cn("font-bold", isWinner ? "text-amber-500" : "text-zinc-300")}>
        {player.name}
      </span>
    </div>
    <div className="flex items-center gap-4">
       <div className="flex gap-1">
          {Object.entries(ELEMENT_THEMES).map(([color, theme]) => {
            const count = player.cards.filter((c: Card) => c.gemColor === color).length;
            if (count === 0) return null;
            return <span key={color} className="text-xs">{theme.icons[0]}</span>
          })}
       </div>
       <span className="text-2xl font-black text-white">{player.score}</span>
    </div>
  </div>
);

export default function GameResult() {
  const { isGameOver, winner, players, startNewGame } = useGameStore();

  if (!isGameOver || !winner) return null;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border-2 border-amber-500 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col items-center text-center">
        <div className="text-6xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-zinc-500 font-black text-sm uppercase tracking-[0.4em] mb-2">Grand Master Victorious</h2>
        <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">{winner.name}</h1>
        
        <div className="w-full space-y-3 mb-8">
          {sortedPlayers.map((player, idx) => (
            <ResultRow 
              key={player.id}
              player={player}
              rank={idx + 1}
              isWinner={player.id === winner.id}
            />
          ))}
        </div>

        <button 
          onClick={startNewGame}
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 uppercase tracking-widest"
        >
          New Adventure
        </button>
      </div>
    </div>
  );
}
