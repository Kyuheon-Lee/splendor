"use client";

import { Card as CardType } from "@/types/game";
import { ELEMENT_THEMES } from "@/constants/themes";

interface CardItemProps {
  card: CardType;
  onClick?: () => void;
}

export default function CardItem({ card, onClick }: CardItemProps) {
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
    <div 
      onClick={onClick}
      className={`w-32 h-48 bg-zinc-100 rounded-xl flex flex-col relative overflow-hidden group cursor-pointer hover:-translate-y-4 transition-all duration-500 ease-out border-2 ${levelStyles}`}
    >
      {/* 카드 배경 그라데이션 */}
      <div className={`absolute inset-0 opacity-20 bg-gradient-to-b from-white to-zinc-400`} />
      <div className={`absolute inset-0 opacity-10 ${theme.bg}`} />

      {/* [상단 섹션] */}
      <div className="absolute top-0 w-full p-2 flex justify-between items-start z-20">
        <span className="text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] italic tracking-tighter">
          {card.points > 0 ? card.points : ""}
        </span>
        <div className={`w-10 h-10 rounded-full ${theme.bg} shadow-lg flex items-center justify-center text-2xl border-2 border-white/50 transform group-hover:rotate-12 transition-transform`}>
          {elementIcon}
        </div>
      </div>

      {/* [중앙 메인 아이콘 (Hero)] */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className={`absolute w-28 h-28 rounded-full blur-3xl opacity-30 ${theme.bg} group-hover:scale-150 transition-transform duration-1000`} />
        <div className={`transition-all duration-500 group-hover:scale-110 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]
          ${card.level === 1 ? 'text-6xl opacity-70' : 
            card.level === 2 ? 'text-7xl opacity-90' : 
            'text-8xl opacity-100'}
        `}>
          {elementIcon}
        </div>
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
    </div>
  );
}
