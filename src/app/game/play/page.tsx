import Link from "next/link";

export default function GamePlay() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8 text-center">
        <h1 className="text-4xl font-bold text-amber-500 mb-4">게임 플레이 화면</h1>
        <p className="text-zinc-400">여기에 실제 게임 보드가 구현될 예정입니다.</p>
        
        <Link 
          href="/game"
          className="mt-8 text-zinc-400 hover:text-white transition-colors"
        >
          ← 메뉴로 돌아가기
        </Link>
      </div>
    </main>
  );
}
