"use client";

import { useEffect, useState, ReactNode } from "react";

export default function StoreHydrator({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">
        로딩 중...
      </div>
    );
  }

  return <>{children}</>;
}
