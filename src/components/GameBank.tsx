"use client";

import { useGameStore } from "@/store/useGameStore";
import { ELEMENT_THEMES } from "@/constants/themes";
import { GemColor } from "@/types/game";

export default function GameBank() {
  const { 
    tokens, 
    selectedTokens, 
    isDiscardingMode, 
    selectToken, 
    cancelSelection, 
    confirmTokens 
  } = useGameStore();

  const totalSelected = Object.values(selectedTokens).reduce((a, b) => (a as number) + (b as number), 0);
  const isSelectionValid = totalSelected > 0 && !isDiscardingMode;

  return (
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
  );
}
