"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import CardItem from "@/components/CardItem";
import { ELEMENT_THEMES } from "@/constants/themes";

export default function GamePlay() {
  const searchParams = useSearchParams();
  const isLoad = searchParams.get("load") === "true";
  
  const { 
    players, 
    tokens, 
    board,
    decks,
    currentPlayerIndex, 
    startNewGame, 
    turn 
  } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    if (!isLoad) {
      startNewGame();
    }
  }, [isLoad, startNewGame]);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900 text-white p-4">
      {/* 상단바 */}
      <header className="flex justify-between items-center mb-6 bg-zinc-800 p-4 rounded-xl shadow-lg border border-zinc-700">
        <div className="flex items-center gap-4">
          <Link href="/game" className="text-zinc-400 hover:text-white transition-colors">
            ← 메뉴
          </Link>
          <h2 className="text-xl font-bold text-amber-500">턴 {turn}</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">
            현재 차례: <span className="text-amber-400">{currentPlayer?.name}</span>
          </span>
        </div>
      </header>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* 왼쪽: 보드 영역 */}
        <section className="flex-[3] flex flex-col gap-4 bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 overflow-y-auto">
          <h3 className="text-zinc-400 font-bold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-zinc-500 rounded-full" />
            고대 원소 마법서 (개발 카드)
          </h3>
          {[3, 2, 1].map((level) => (
            <div key={level} className="flex gap-4 items-center bg-zinc-700/20 p-4 rounded-2xl border border-zinc-700/50">
              {/* 덱 표시 */}
              <div className="relative group">
                <div className="w-32 h-48 bg-zinc-800 rounded-xl flex flex-col items-center justify-center font-bold border-2 border-zinc-600 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  <span className="text-zinc-500 text-sm mb-2">Level {level}</span>
                  <span className="text-4xl text-zinc-300 font-black">{decks[level as 1|2|3]?.length || 0}</span>
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

        {/* 오른쪽: 공용 자원 및 플레이어 정보 */}
        <aside className="flex-1 flex flex-col gap-6">
          {/* 토큰 현황 (원소 정수) */}
          <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
            
            <h3 className="text-zinc-400 font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              공용 원소 정수
            </h3>
            
            <div className="grid grid-cols-3 gap-y-8 gap-x-4">
              {Object.entries(tokens).map(([color, count]) => {
                const isGold = color === 'gold';
                const theme = isGold 
                  ? { name: "마력", bg: "bg-amber-400", icon: "✨", text: "text-zinc-900" }
                  : { ...ELEMENT_THEMES[color], text: color === 'white' ? "text-zinc-800" : "text-white" };

                return (
                  <div key={color} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-black text-xl shadow-[inset_0_-4px_8px_rgba(0,0,0,0.3)] border-2 border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12
                      ${theme.bg} ${theme.text} relative
                    `}>
                      <div className="absolute top-1 left-2 w-3 h-2 bg-white/30 rounded-full rotate-[-45deg]" />
                      <span className="text-sm opacity-50 mb-0.5">{theme.icon}</span>
                      <span className="leading-none">{count}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter">
                        {theme?.name}
                      </span>
                      <div className={`w-0 group-hover:w-full h-0.5 transition-all duration-300 ${isGold ? 'bg-amber-400' : theme?.bg}`} />
                    </div>
                  </div>
                );
              })}
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
                   {Object.entries(player.tokens).map(([color, count]) => (
                     <div key={color} className={`w-4 h-4 rounded-sm ${
                       color === 'white' ? 'bg-zinc-100' : 
                       color === 'blue' ? 'bg-blue-500' :
                       color === 'green' ? 'bg-emerald-500' :
                       color === 'red' ? 'bg-orange-600' :
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
