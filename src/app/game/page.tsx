import Link from "next/link";

export default function GameMenu() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8 text-center">
        <h1 className="text-4xl font-bold text-amber-500 mb-4">게임 메뉴</h1>
        
        <div className="flex flex-col gap-4 w-64">
          <Link 
            href="/game/play"
            className="px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-lg transition-colors text-center"
          >
            New Game
          </Link>
          <Link 
            href="/game/play?load=true"
            className="px-6 py-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold text-lg transition-colors text-center"
          >
            Load Game
          </Link>
          <Link 
            href="/"
            className="mt-4 text-zinc-400 hover:text-white transition-colors"
          >
            ← 로비로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
