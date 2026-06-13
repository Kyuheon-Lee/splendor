"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";

export default function GamePlay() {
  const searchParams = useSearchParams();
  const isLoad = searchParams.get("load") === "true";
  
  // Zustand 스토어에서 필요한 상태와 함수들을 가져옵니다.
  const { 
    players, 
    tokens, 
    currentPlayerIndex, 
    startNewGame, 
    turn 
  } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    // 'Load Game'이 아니고 처음 진입했을 때만 새 게임을 시작합니다.
    if (!isLoad) {
      startNewGame();
    }
  }, [isLoad, startNewGame]);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900 text-white p-4">
      {/* 상단바: 현재 턴 정보 및 메뉴로 돌아가기 */}
      <header className="flex justify-between items-center mb-6 bg-zinc-800 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/game" className="text-zinc-400 hover:text-white transition-colors">
            ← 메뉴
          </Link>
          <h2 className="text-xl font-bold text-amber-500">턴 {turn}</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">
            현재 차례: <span className="text-amber-400">{currentPlayer.name}</span>
          </span>
        </div>
      </header>

      <div className="flex flex-1 gap-6">
        {/* 왼쪽: 보드 영역 (카드 3단계) */}
        <section className="flex-[3] flex flex-col gap-4 bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700">
          <h3 className="text-zinc-400 font-bold mb-2">개발 카드</h3>
          {[3, 2, 1].map((level) => (
            <div key={level} className="flex gap-4 items-center">
              <div className="w-20 h-28 bg-zinc-700 rounded-lg flex items-center justify-center font-bold text-2xl border-2 border-zinc-600">
                Lvl {level}
              </div>
              <div className="flex-1 h-28 bg-zinc-700/30 rounded-lg border border-dashed border-zinc-600 flex items-center justify-center text-zinc-500 italic">
                카드가 여기에 표시됩니다.
              </div>
            </div>
          ))}
        </section>

        {/* 오른쪽: 공용 자원 및 플레이어 정보 */}
        <aside className="flex-1 flex flex-col gap-6">
          {/* 토큰 현황 */}
          <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 shadow-xl">
            <h3 className="text-zinc-400 font-bold mb-4">공용 토큰</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(tokens).map(([color, count]) => (
                <div key={color} className="flex flex-col items-center gap-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-inner
                    ${color === 'white' ? 'bg-zinc-100 text-zinc-900' : ''}
                    ${color === 'blue' ? 'bg-blue-600 text-white' : ''}
                    ${color === 'green' ? 'bg-green-600 text-white' : ''}
                    ${color === 'red' ? 'bg-red-600 text-white' : ''}
                    ${color === 'black' ? 'bg-zinc-800 border border-zinc-600 text-white' : ''}
                    ${color === 'gold' ? 'bg-amber-400 text-zinc-900' : ''}
                  `}>
                    {count}
                  </div>
                  <span className="text-xs uppercase text-zinc-500">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 플레이어 요약 */}
          <div className="flex flex-col gap-4">
            {players.map((player, idx) => (
              <div 
                key={player.id} 
                className={`p-4 rounded-xl border-2 transition-all ${
                  idx === currentPlayerIndex 
                  ? 'bg-amber-900/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'bg-zinc-800 border-zinc-700 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{player.name}</span>
                  <span className="text-amber-500 font-black text-xl">{player.score} 점</span>
                </div>
                <div className="flex gap-2">
                   {/* 간단한 자원 표시 */}
                   {Object.entries(player.tokens).map(([color, count]) => (
                     <div key={color} className={`w-4 h-4 rounded-sm ${
                       color === 'white' ? 'bg-zinc-100' : 
                       color === 'blue' ? 'bg-blue-600' :
                       color === 'green' ? 'bg-green-600' :
                       color === 'red' ? 'bg-red-600' :
                       color === 'black' ? 'bg-zinc-800 border border-zinc-600' : 'bg-amber-400'
                     }`} title={`${color}: ${count}`} />
                   ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
