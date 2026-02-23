"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Verbum Domini Entry Point
 * Automatically resumes the last read position for zero-click access.
 */
export default function EntryGate() {
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("vd_last_read");
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.book && state.chapter) {
          router.push(`/bible/${state.book}/${state.chapter}`);
          return;
        }
      } catch (e) {
        console.error("Failed to parse last read state", e);
      }
    }
    
    // Default to Sanctuary if no state exists
    router.push("/sanctuary");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white space-y-4">
      <Loader2 className="animate-spin text-indigo-600" size={48} strokeWidth={1} />
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-950 animate-pulse">
        Resuming the Word...
      </p>
    </div>
  );
}
