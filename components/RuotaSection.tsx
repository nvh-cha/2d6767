"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { RotateCw } from "lucide-react";

const CHANCES_BY_NAME: Record<string, number> = {
  "Ilas Davide": 0,
  "Del Moro Giada": 0,
  "Gobbo Francesca": 2,
  "Cimino Manuel": 2,
  "Poziello Andrea": 2,
  "Manzini Lorenzo": 1,
  "Benacquista Marco": 1,
  "Bayron Brena": 1,
  "Silvestri Davide": 1,
  "Calabrò Ylenia": 2,
  "Friscia Giorgia": 2,
  "Gallo Mirko": 1,
  "Savini Alessio": 1,
  "Colasuonno Caterina": 1,
  "Sava Elisa": 1,
  "Shile Ema": 1,
  "Varricchio Giorgia": 1,
  "Coccia Paola": 1,
  "Dhillon Sara": 1,
};

const SLICE_COLORS = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f43f5e", // Rose
  "#84cc16", // Lime
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vRot: number;
  shape: "rect" | "circle";
};

export default function RuotaSection() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const names = useMemo(() => Object.keys(CHANCES_BY_NAME), []);
  const numSlices = names.length;
  const sliceAngle = 360 / numSlices;

  // Particle explosion engine
  function triggerConfetti() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newParticles: Particle[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 14;
      newParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        color: SLICE_COLORS[Math.floor(Math.random() * SLICE_COLORS.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 15,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }

    particlesRef.current = newParticles;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const render = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.98;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      particlesRef.current = particlesRef.current.filter(
        (p) => p.y < canvas.height + 50
      );

      if (particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);
  }

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Weighted winner selection using CHANCES_BY_NAME
  function pickWeightedIndex(): number {
    const eligible = names
      .map((name, index) => ({
        name,
        index,
        weight: Math.max(0, CHANCES_BY_NAME[name] ?? 0),
      }))
      .filter((item) => item.weight > 0);

    if (eligible.length === 0) {
      return Math.floor(Math.random() * numSlices);
    }

    const totalWeight = eligible.reduce((sum, item) => sum + item.weight, 0);
    let r = Math.random() * totalWeight;

    for (const item of eligible) {
      r -= item.weight;
      if (r <= 0) {
        return item.index;
      }
    }

    return eligible[eligible.length - 1].index;
  }

  function spinWheel() {
    if (isSpinning || numSlices === 0) return;
    setIsSpinning(true);
    setWinner(null);

    const targetIndex = pickWeightedIndex();

    const padding = Math.min(sliceAngle * 0.15, 2);
    const sliceStart = targetIndex * sliceAngle + padding;
    const sliceSpan = Math.max(sliceAngle - padding * 2, 0.5);
    const targetAngleInSlice = sliceStart + Math.random() * sliceSpan;

    const desiredMod = (360 - targetAngleInSlice + 360) % 360;
    const currentMod = rotation % 360;
    const deltaMod = (desiredMod - currentMod + 360) % 360;
    const extraSpins = (6 + Math.floor(Math.random() * 5)) * 360;

    const nextRotation = rotation + extraSpins + deltaMod;
    setRotation(nextRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(names[targetIndex]);
      triggerConfetti();
    }, 4500);
  }

  function getSlicePath(index: number) {
    const startAngle = index * sliceAngle - 90;
    const endAngle = startAngle + sliceAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 250 + 240 * Math.cos(startRad);
    const y1 = 250 + 240 * Math.sin(startRad);
    const x2 = 250 + 240 * Math.cos(endRad);
    const y2 = 250 + 240 * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    return `M 250 250 L ${x1} ${y1} A 240 240 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  }

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-8">
      {/* Confetti Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50"
      />

      <div className="relative my-4 flex items-center justify-center">
        {/* Top Pointer Triangle */}
        <div className="absolute -top-5 z-20 flex flex-col items-center drop-shadow-md">
          <div className="h-0 w-0 border-x-[18px] border-t-[32px] border-x-transparent border-t-slate-900" />
        </div>

        {/* Big Responsive Wheel Wrapper */}
        <div className="rounded-full bg-white p-2.5 shadow-2xl">
          <div className="relative aspect-square w-[88vw] max-w-[680px] overflow-hidden rounded-full bg-slate-100">
            <svg
              viewBox="0 0 500 500"
              className="h-full w-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? "transform 4.5s cubic-bezier(0.12, 0.85, 0.15, 1)"
                  : "none",
              }}
            >
              {names.map((name, idx) => {
                const midAngle = idx * sliceAngle + sliceAngle / 2 - 90;
                return (
                  <g key={name}>
                    <path
                      d={getSlicePath(idx)}
                      fill={SLICE_COLORS[idx % SLICE_COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x="250"
                      y="250"
                      fill="#ffffff"
                      fontSize="13.5"
                      fontWeight="700"
                      textAnchor="end"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, 250, 250) translate(228, 0)`}
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center Spin Button */}
            <button
              type="button"
              onClick={spinWheel}
              disabled={isSpinning || numSlices === 0}
              className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-xl transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 sm:h-24 sm:w-24"
            >
              <RotateCw
                className={`h-7 w-7 ${isSpinning ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      <div className="mt-6 flex min-h-[88px] w-full max-w-md items-center justify-center">
        {winner ? (
          <div className="animate-bounce rounded-2xl border-2 border-purple-300 bg-white px-8 py-4 text-center shadow-lg">
            <p className="text-2xl font-black text-slate-900">{winner}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={spinWheel}
            disabled={isSpinning || numSlices === 0}
            className="rounded-2xl bg-slate-900 px-8 py-3.5 text-base font-bold text-white shadow-md transition hover:opacity-95 active:scale-95 disabled:opacity-50"
          >
            {isSpinning ? "Girando la ruota..." : "Gira la Ruota"}
          </button>
        )}
      </div>
    </div>
  );
}
