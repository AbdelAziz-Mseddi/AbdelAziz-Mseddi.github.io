"use client";

import { useKenzProgress } from "@/lib/eggs/kenz";
import { useSingleTakeMode, setSingleTake } from "@/lib/eggs/singleTake";

export function Footer() {
  const { allFound } = useKenzProgress();
  const singleTake = useSingleTakeMode();

  function onMarkClick() {
    if (!allFound) return;
    setSingleTake(!singleTake);
  }

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-dim sm:flex-row sm:px-10">
        <p>
          © {new Date().getFullYear()} Abdelaziz Mseddi.
          <button
            type="button"
            onClick={onMarkClick}
            aria-hidden="true"
            tabIndex={-1}
            className="ml-2 inline-block h-[3px] w-[3px] rounded-full bg-current opacity-30 hover:opacity-30"
          />
        </p>
        <p className="font-mono opacity-70 transition-opacity hover:opacity-100">
          {"// see you, space cowboy."}
        </p>
      </div>
    </footer>
  );
}
