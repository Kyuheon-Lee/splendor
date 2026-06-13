import Link from "next/link";

export default function Lobby() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-6xl font-bold tracking-tighter text-amber-500">SPLENDOR</h1>
        <p className="text-xl text-zinc-400">2인용 로컬 보드게임</p>
        
        <div className="flex gap-4">
          <Link 
            href="/game"
            className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xl transition-colors"
          >
            게임 입장하기
          </Link>
          <Link 
            href="/rules"
            className="px-8 py-4 border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg font-bold text-xl transition-colors"
          >
            게임 규칙
          </Link>
        </div>
      </div>
    </main>
  );
}
