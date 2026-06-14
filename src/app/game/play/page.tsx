"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import GameHeader from "@/components/GameHeader";
import GameBoard from "@/components/GameBoard";
import GameBank from "@/components/GameBank";
import PlayerDashboard from "@/components/PlayerDashboard";
import GameResult from "@/components/GameResult";

export default function GamePlay() {
  const searchParams = useSearchParams();
  const isLoad = searchParams.get("load") === "true";
  const startNewGame = useGameStore((state) => state.startNewGame);

  useEffect(() => {
    if (!isLoad) {
      startNewGame();
    }
  }, [isLoad, startNewGame]);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900 text-white p-4 font-sans">
      <GameHeader />

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* 왼쪽: 보드 영역 (개발 카드) */}
        <GameBoard />

        {/* 오른쪽: 공용 자원(뱅크) 및 플레이어 정보 */}
        <aside className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <GameBank />
          <PlayerDashboard />
        </aside>
      </div>

      <GameResult />
    </main>
  );
}
