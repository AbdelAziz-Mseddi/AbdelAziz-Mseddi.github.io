"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useKenzProgress } from "@/lib/eggs/kenz";

export default function KenzPage() {
  const { allFound } = useKenzProgress();

  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex flex-1 items-center justify-center px-6 pt-24 sm:px-10">
        {allFound ? (
          <div className="max-w-md text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {"// كنز"}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Kenz, Arabic for treasure. Six pieces, scattered, unmarked. If
              you found all of them, you weren&apos;t skimming.
            </p>
            <p className="mt-4 text-sm text-muted-dim">
              Thanks for actually looking.
            </p>
          </div>
        ) : (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dim">
            {"// nothing here yet."}
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
