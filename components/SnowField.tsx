"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  opacity: number;
};

export function SnowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let animationId = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function seedFlakes() {
      const count = Math.round((width * height) / 22000);
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.35 + 0.12,
        drift: Math.random() * 0.6 - 0.3,
        phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.25,
      }));
    }

    function resize() {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedFlakes();
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = "#e7ebf5";
      for (const f of flakes) {
        f.y += f.speed;
        f.phase += 0.01;
        f.x += Math.sin(f.phase) * 0.15 + f.drift * 0.05;
        if (f.y > height + 4) {
          f.y = -4;
          f.x = Math.random() * width;
        }
        if (f.x > width + 4) f.x = -4;
        if (f.x < -4) f.x = width + 4;

        ctx!.globalAlpha = f.opacity;
        ctx!.beginPath();
        ctx!.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      animationId = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
