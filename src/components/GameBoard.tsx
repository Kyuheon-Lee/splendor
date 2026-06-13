"use client";

import { useGameStore } from "@/store/useGameStore";
import CardItem from "./CardItem";

export default function GameBoard() {
  const { board, decks, isDiscardingMode } = useGameStore();

  return (
    <section className={`flex-[3] flex flex-col gap-4 bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 overflow-y-auto custom-scrollbar transition-opacity ${isDiscardingMode ? 'opacity-30 pointer-events-none' : ''}`}>
      <h3 className="text-zinc-400 font-bold mb-2 flex items-center gap-2 uppercase tracking-tighter">
        <span className="w-2 h-2 bg-zinc-500 rounded-full" />
        고대 원소 마법서 (개발 카드)
      </h3>
      {[3, 2, 1].map((level) => (
        <div key={level} className="flex gap-4 items-center bg-zinc-700/20 p-4 rounded-2xl border border-zinc-700/50">
          {/* 덱 표시 */}
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
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
