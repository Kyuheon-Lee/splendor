"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import { Card as CardType } from "@/types/game";

// 원소별 테마 및 진화형 아이콘 설정
const ELEMENT_THEMES: Record<string, { 
  name: string, 
  bg: string, 
  glow: string, 
  icons: string[] 
}> = {
  white: { name: "바람", bg: "bg-slate-100", glow: "shadow-slate-200", icons: ["☁️", "🌪️", "⚡"] },
  blue: { name: "물", bg: "bg-blue-500", glow: "shadow-blue-400", icons: ["💧", "🌊", "🧊"] },
  green: { name: "대지", bg: "bg-emerald-500", glow: "shadow-emerald-400", icons: ["🌱", "🌲", "⛰️"] },
  red: { name: "불", bg: "bg-orange-600", glow: "shadow-orange-400", icons: ["🔥", "🌋", "☄️"] },
  black: { name: "공허", bg: "bg-zinc-800", glow: "shadow-zinc-900", icons: ["🌑", "🌌", "🌀"] },
};

// 개별 카드 컴포넌트
function CardItem({ card }: { card: CardType }) {
  const theme = ELEMENT_THEMES[card.gemColor];
  const levelIndex = card.level - 1;
  const elementIcon = theme.icons[levelIndex];

  // 레벨별 카드 테두리 및 효과 스타일
  const levelStyles = {
    1: "border-zinc-200 shadow-md",
    2: `border-white/60 shadow-xl scale-105 ring-1 ring-white/30`,
    3: `border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] scale-110 ring-2 ring-amber-400`,
  }[card.level];

  return (
    <div className={`w-32 h-48 bg-zinc-100 rounded-xl flex flex-col relative overflow-hidden group cursor-pointer hover:-translate-y-4 transition-all duration-500 ease-out border-2 ${levelStyles}`}>
      
      {/* 카드 배경 그라데이션 (카드 전체에 이미지 느낌 부여) */}
      <div className={`absolute inset-0 opacity-20 bg-gradient-to-b from-white to-zinc-400`} />
      <div className={`absolute inset-0 opacity-10 ${theme.bg}`} />

      {/* [상단 섹션] */}
      <div className="absolute top-0 w-full p-2 flex justify-between items-start z-20">
        {/* 점수 (좌측 상단, 매우 크고 강조됨) */}
        <span className="text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] italic tracking-tighter">
          {card.points > 0 ? card.points : ""}
        </span>
        
        {/* 생산 원소 (우측 상단) */}
        <div className={`w-10 h-10 rounded-full ${theme.bg} shadow-lg flex items-center justify-center text-2xl border-2 border-white/50 transform group-hover:rotate-12 transition-transform`}>
          {elementIcon}
        </div>
      </div>

      {/* [중앙 메인 아이콘 (Hero)] */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        {/* 장식용 후광 */}
        <div className={`absolute w-28 h-28 rounded-full blur-3xl opacity-30 ${theme.bg} group-hover:scale-150 transition-transform duration-1000`} />
        
        <div className={`transition-all duration-500 group-hover:scale-110 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]
          ${card.level === 1 ? 'text-6xl opacity-70' : 
            card.level === 2 ? 'text-7xl opacity-90' : 
            'text-8xl opacity-100'}
        `}>
          {elementIcon}
        </div>

        {/* 레벨 3 특수 마법진 */}
        {card.level === 3 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-32 h-32 border-2 border-dashed border-amber-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
          </div>
        )}
      </div>
      
      {/* [좌측 비용 섹션 (컬럼식)] */}
      <div className="absolute bottom-2 left-2 flex flex-col-reverse gap-1 z-20">
        {Object.entries(card.cost).map(([color, amount]) => (
          <div key={color} className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white/80
            ${color === 'white' ? 'bg-slate-100 text-zinc-800' : 
              color === 'blue' ? 'bg-blue-500 text-white' :
              color === 'green' ? 'bg-emerald-500 text-white' :
              color === 'red' ? 'bg-orange-600 text-white' : 
              'bg-zinc-800 text-white'}
          `}>
            <span className="text-sm font-black drop-shadow-sm">{amount}</span>
          </div>
        ))}
      </div>

      {/* 하단 레벨 표시기 */}
      <div className="absolute bottom-1 right-2 flex gap-0.5 opacity-30">
        {[...Array(card.level)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-black shadow-inner" />
        ))}
      </div>

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />
    </div>
  );
}

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
      {/* 상단바: 현재 턴 정보 및 메뉴로 돌아가기 */}
      <header className="flex justify-between items-center mb-6 bg-zinc-800 p-4 rounded-xl shadow-lg border border-zinc-700">
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

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* 왼쪽: 보드 영역 (카드 3단계) */}
        <section className="flex-[3] flex flex-col gap-4 bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 overflow-y-auto">
          <h3 className="text-zinc-400 font-bold mb-2">개발 카드</h3>
          {[3, 2, 1].map((level) => (
            <div key={level} className="flex gap-4 items-center bg-zinc-700/20 p-3 rounded-xl">
              {/* 덱 표시 */}
              <div className="relative group">
                <div className="w-24 h-32 bg-zinc-700 rounded-lg flex flex-col items-center justify-center font-bold border-2 border-zinc-600 shadow-lg">
                  <span className="text-zinc-500">Lvl {level}</span>
                  <span className="text-2xl">{decks[level as 1|2|3]?.length || 0}</span>
                </div>
              </div>
              
              {/* 보드 카드 표시 */}
              <div className="flex-1 flex gap-4">
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
            {/* 배경 장식 */}
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
                      {/* 반짝임 효과 */}
                      <div className="absolute top-1 left-2 w-3 h-2 bg-white/30 rounded-full rotate-[-45deg]" />
                      
                      <span className="text-sm opacity-50 mb-0.5">{theme.icon}</span>
                      <span className="leading-none">{count}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter">
                        {theme.name}
                      </span>
                      <div className={`w-0 group-hover:w-full h-0.5 transition-all duration-300 ${isGold ? 'bg-amber-400' : theme.bg.replace('bg-', 'bg-')}`} />
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
