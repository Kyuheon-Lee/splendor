"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/store/useGameStore";
import CardItem from "@/components/CardItem";
import { ELEMENT_THEMES } from "@/constants/themes";
import { GemColor } from "@/types/game";

export default function GamePlay() {
  const searchParams = useSearchParams();
  const isLoad = searchParams.get("load") === "true";
  
  const { 
    players, 
    tokens, 
    board,
    decks,
    currentPlayerIndex, 
    selectedTokens,
    isDiscardingMode,
    startNewGame, 
    selectToken,
    cancelSelection,
    confirmTokens,
    discardToken,
    turn 
  } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];
  
  // 선택된 총 토큰 수
  const totalSelected = Object.values(selectedTokens).reduce((a, b) => (a as number) + (b as number), 0);
  
  // [수정] 유효성 검사: 1개만 골라도 확정 가능하도록 유연하게 처리 (공식 룰 및 자원 부족 대응)
  const isSelectionValid = totalSelected > 0 && !isDiscardingMode;
  
  // 현재 플레이어의 보유 토큰 총합
  const currentTokenTotal = currentPlayer ? Object.values(currentPlayer.tokens).reduce((a, b) => (a as number) + (b as number), 0) : 0;
  // 반납해야 할 개수
  const tokensToDiscard = Math.max(0, currentTokenTotal - 10);

  useEffect(() => {
    if (!isLoad) {
      startNewGame();
    }
  }, [isLoad, startNewGame]);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900 text-white p-4 font-sans">
      {/* 상단바 */}
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

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* 왼쪽: 보드 영역 */}
        <section className={`flex-[3] flex flex-col gap-4 bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 overflow-y-auto custom-scrollbar transition-opacity ${isDiscardingMode ? 'opacity-30 pointer-events-none' : ''}`}>
          <h3 className="text-zinc-400 font-bold mb-2 flex items-center gap-2 uppercase tracking-tighter">
            <span className="w-2 h-2 bg-zinc-500 rounded-full" />
            고대 원소 마법서 (개발 카드)
          </h3>
          {[3, 2, 1].map((level) => (
            <div key={level} className="flex gap-4 items-center bg-zinc-700/20 p-4 rounded-2xl border border-zinc-700/50">
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
          <div className={`bg-zinc-800 p-6 rounded-2xl border border-zinc-700 shadow-xl overflow-hidden relative flex flex-col transition-opacity ${isDiscardingMode ? 'opacity-30 pointer-events-none' : ''}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-zinc-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                공용 원소 정수
              </h3>
              {totalSelected > 0 && (
                <button 
                  onClick={cancelSelection}
                  className="text-[10px] font-black uppercase text-zinc-500 hover:text-red-400 transition-colors border-b border-zinc-700"
                >
                  선택 초기화
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-y-8 gap-x-4">
              {Object.entries(tokens).map(([color, count]) => {
                const isGold = color === 'gold';
                const selectedCount = isGold ? 0 : (selectedTokens[color as Exclude<GemColor, 'gold'>] || 0);
                const theme = isGold 
                  ? { name: "마력", bg: "bg-amber-400", icon: "✨", text: "text-zinc-900" }
                  : { ...ELEMENT_THEMES[color], text: color === 'white' ? "text-zinc-800" : "text-white" };

                return (
                  <div 
                    key={color} 
                    onClick={() => !isGold && selectToken(color as Exclude<GemColor, 'gold'>)}
                    className={`flex flex-col items-center gap-2 group cursor-pointer transition-all ${isGold ? 'cursor-not-allowed opacity-40' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-black text-xl shadow-[inset_0_-4px_8px_rgba(0,0,0,0.3)] border-2 transition-all duration-300 group-hover:scale-110 
                      ${theme.bg} ${theme.text} relative
                      ${selectedCount > 0 ? 'ring-4 ring-amber-500 ring-offset-4 ring-offset-zinc-800 scale-110 border-white' : 'border-white/20'}
                    `}>
                      <div className="absolute top-1 left-2 w-3 h-2 bg-white/30 rounded-full rotate-[-45deg]" />
                      <span className="text-sm opacity-50 mb-0.5">{theme.icon}</span>
                      <span className="leading-none">{count}</span>
                      {selectedCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[10px] text-zinc-900 border-2 border-zinc-800 font-black animate-bounce shadow-lg">
                          +{selectedCount}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                      {theme?.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className={`mt-8 overflow-hidden transition-all duration-500 ${isSelectionValid ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <button 
                onClick={confirmTokens}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-900 font-black rounded-xl shadow-[0_4px_15px_rgba(245,158,11,0.3)] transform active:scale-95 transition-all uppercase tracking-widest text-sm"
              >
                정수 수집 확정
              </button>
            </div>
          </div>

          {/* 플레이어 요약 */}
          <div className="flex flex-col gap-4">
            {players.map((player, idx) => {
              const isCurrent = idx === currentPlayerIndex;
              const playerTokenTotal = Object.values(player.tokens).reduce((a, b) => (a as number) + (b as number), 0);
              
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
                  {/* 반납 모드 안내 오버레이 (pointer-events-none 추가하여 클릭 통과) */}
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
                      정수: {playerTokenTotal} / 10
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
        </aside>
      </div>
    </main>
  );
}
