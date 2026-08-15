"use client";

import { useEffect, useRef, useState } from "react";
import { fireEgg } from "@/lib/eggs/eggBus";
import { useKenzProgress } from "@/lib/eggs/kenz";
import { getMoonPhase, isRamadan } from "@/lib/eggs/moon";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useSingleTakeMode, setSingleTake } from "@/lib/eggs/singleTake";

type Line = { type: "input" | "output"; text: string };

const COMMANDS = [
  "fly",
  "kenz",
  "plan-sequence",
  "moon",
  "powerlevel",
  "whoami",
  "help",
  "exit",
];

function isTypingTarget(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    (el as HTMLElement).isContentEditable
  );
}

export function Terminal() {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const { foundCount, total, allFound } = useKenzProgress();
  const singleTake = useSingleTakeMode();

  function close() {
    setOpen(false);
    restoreFocusRef.current?.focus();
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (open) return;
      const typing = isTypingTarget(document.activeElement);
      const isTilde = e.key === "`" || e.key === "~";
      const isCtrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCtrlK || (isTilde && !typing)) {
        e.preventDefault();
        restoreFocusRef.current = document.activeElement as HTMLElement;
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        // Only the input is focusable in here — keep focus trapped on it.
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function print(text: string) {
    setLines((prev) => [...prev, { type: "output", text }]);
  }

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    setLines((prev) => [...prev, { type: "input", text: raw }]);
    if (!cmd) return;

    switch (cmd) {
      case "fly":
        fireEgg("fly");
        print("// scrambling.");
        break;
      case "kenz":
        print(
          allFound
            ? `kenz — ${foundCount}/${total} found. single-take unlocked.`
            : `kenz — ${foundCount}/${total} found`
        );
        break;
      case "plan-sequence":
        if (!allFound) {
          print("// still locked. six pieces, remember?");
        } else {
          setSingleTake(!singleTake);
          print(`// single-take: ${!singleTake ? "on" : "off"}.`);
        }
        break;
      case "moon": {
        const { name } = getMoonPhase(new Date());
        print(isRamadan(new Date()) ? `${name}. Ramadan Mubarak.` : name);
        break;
      }
      case "powerlevel":
        print("// reading power level... sensor fried. try again never.");
        break;
      case "whoami":
        print(
          "Abdelaziz Mseddi — software engineering student, AI engineer, night owl."
        );
        break;
      case "help":
        print(`available: ${COMMANDS.join(", ")}`);
        break;
      case "exit":
        close();
        break;
      default:
        print(`// not a command I recognize. try \`help\`.`);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    run(value);
    setValue("");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-background/80 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={close}
      style={reducedMotion ? undefined : { animation: "terminal-fade 120ms ease-out" }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command terminal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-border-strong bg-surface p-4 font-mono text-sm shadow-2xl"
      >
        <div className="max-h-64 overflow-y-auto">
          {lines.map((l, i) => (
            <p
              key={i}
              className={
                l.type === "input"
                  ? "text-foreground"
                  : "text-muted-dim"
              }
            >
              {l.type === "input" ? `> ${l.text}` : l.text}
            </p>
          ))}
        </div>
        <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
          <span className="text-accent">{">"}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-transparent text-foreground outline-none"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal command input"
          />
        </form>
      </div>
      {!reducedMotion && (
        <style>{`
          @keyframes terminal-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      )}
    </div>
  );
}
