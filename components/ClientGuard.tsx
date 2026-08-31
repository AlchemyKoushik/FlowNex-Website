"use client";

import { useEffect, useState } from "react";

export default function ClientGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-flownex-black text-flownex-white flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-flownex-pink animate-ping" />
      </div>
    );
  }

  return <>{children}</>;
}

