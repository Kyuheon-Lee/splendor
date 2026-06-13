import Link from "next/link";

export default function Rules() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-900 text-white">
      <div className="z-10 max-w-2xl w-full font-sans text-sm flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-amber-500 mb-4">게임 규칙</h1>
        
        <div className="space-y-4 text-zinc-300 text-lg leading-relaxed">
          <p>
            1. 각 플레이어는 자신의 턴에 보석 토큰을 가져오거나, 카드를 예약하거나, 카드를 구매할 수 있습니다.
          </p>
          <p>
            2. 보석 토큰은 서로 다른 색상 3개를 가져오거나, 같은 색상 2개(해당 색상 토큰이 4개 이상일 때)를 가져올 수 있습니다.
          </p>
          <p>
            3. 카드를 구매하면 해당 카드의 보석 보너스를 영구적으로 얻게 됩니다.
          </p>
          <p>
            4. 승점 15점을 먼저 획득하는 플레이어가 생기면 해당 라운드까지만 진행하고 게임이 종료됩니다.
          </p>
        </div>

        <Link 
          href="/"
          className="mt-8 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors w-fit"
        >
          ← 로비로 돌아가기
        </Link>
      </div>
    </main>
  );
}
