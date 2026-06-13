"use client";

import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";

export default function GameHeader() {
  const { turn, currentPlayerIndex, players, isDiscardingMode } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];

  return (
    <header className="flex justify-between items-center mb-6 bg-zinc-800 p-4 rounded-xl shadow-lg border border-zinc-700">
      <div className="flex items-center gap-4">
        <Link href="/game" className="text-zinc-400 hover:text-white transition-colors">
          ← 메뉴
        </Link>
        <div className="h-8 w-px bg-zinc-700" />
        <h2 className="text-xl font-bold text-amber-500 uppercase tracking-widest">Turn {turn}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className={`px-4 py-1.5 rounded-full border transition-colors ${isDiscardingMode ? 'bg-red-900/40 border-red-500 animate-pulse' : 'bg-zinc-900 border-amber-500/30'}`}>
          <span className="text-sm font-medium text-zinc-400">
            {isDiscardingMode ? 'ACTION: DISCARD' : 'Current Master: '}
          </span>
          <span className={`${isDiscardingMode ? 'text-red-400' : 'text-amber-400'} font-black`}>
            {currentPlayer?.name}
          </span>
        </div>
      </div>
    </header>
  );
}
