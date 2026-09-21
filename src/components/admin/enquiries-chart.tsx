"use client";

import { useState } from "react";

type Point = { date: string; count: number };

const WIDTH = 700;
const HEIGHT = 220;
const PAD_LEFT = 32;
const PAD_RIGHT = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 28;

function niceMax(max: number): number {
  if (max <= 5) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / magnitude) * magnitude;
}

export function EnquiriesChart({ data }: { data: Point[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const yMax = niceMax(Math.max(...data.map((d) => d.count), 1));

  const xFor = (i: number) => PAD_LEFT + (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth);
  const yFor = (value: number) => PAD_TOP + plotHeight - (value / yMax) * plotHeight;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(d.count)}`).join(" ");
  const areaPath = `${linePath} L${xFor(data.length - 1)},${PAD_TOP + plotHeight} L${xFor(0)},${PAD_TOP + plotHeight} Z`;

  const yTicks = [0, yMax / 2, yMax];
  const hovered = hoverIndex !== null ? data[hoverIndex] : null;

  function handlePointerMove(event: React.PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    data.forEach((_, i) => {
      const dist = Math.abs(xFor(i) - relativeX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Enquiries received in the last 7 days">
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={yFor(tick)} y2={yFor(tick)} stroke="#e1e0d9" strokeWidth={1} />
            <text x={PAD_LEFT - 8} y={yFor(tick)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="#898781" style={{ fontVariantNumeric: "tabular-nums" }}>
              {Math.round(tick)}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="#4f46e5" fillOpacity={0.1} stroke="none" />
        <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => (
          <circle key={d.date} cx={xFor(i)} cy={yFor(d.count)} r={4} fill="#4f46e5" stroke="#ffffff" strokeWidth={2} />
        ))}

        {hoverIndex !== null && (
          <line
            x1={xFor(hoverIndex)}
            x2={xFor(hoverIndex)}
            y1={PAD_TOP}
            y2={PAD_TOP + plotHeight}
            stroke="#c3c2b7"
            strokeWidth={1}
          />
        )}

        {data.map((d, i) => (
          <text key={d.date} x={xFor(i)} y={HEIGHT - 8} textAnchor="middle" fontSize={11} fill="#898781">
            {new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </text>
        ))}

        <rect
          x={PAD_LEFT}
          y={PAD_TOP}
          width={plotWidth}
          height={plotHeight}
          fill="transparent"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        />
      </svg>

      {hovered && hoverIndex !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs shadow-md"
          style={{
            left: `${(xFor(hoverIndex) / WIDTH) * 100}%`,
            top: `${(yFor(hovered.count) / HEIGHT) * 100}%`,
          }}
        >
          <p className="font-semibold text-neutral-900">{hovered.count} enquiries</p>
          <p className="text-neutral-500">
            {new Date(hovered.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </div>
      )}
    </div>
  );
}
