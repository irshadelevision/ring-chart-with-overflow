"use client";

import React, { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RingDatum {
  /** Display label, e.g. "Move" */
  label: string;
  /** Current value */
  value: number;
  /** Target / goal value — 100 % = value equals target */
  target: number;
  /** Ring colour (any CSS colour), a gradient tuple [startColor, endColor],
   *  or a 3-colour tuple [start, mid, end] where the overflow arc uses mid→end */
  color: string | [string, string] | [string, string, string];
  /** Optional unit suffix for the legend, e.g. "CAL" */
  unit?: string;
}

export interface RingChartProps {
  /** Ring data — first item is the outermost ring */
  data: RingDatum[];
  /** Diameter of the chart in px */
  size?: number;
  /** Thickness of each ring */
  ringWidth?: number;
  /** Gap between rings */
  gap?: number;
  /** Show inline legend */
  showLegend?: boolean;
  /** Mount animation duration (ms) */
  animationDuration?: number;
  /** Extra wrapper className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type ColorProp = string | [string, string] | [string, string, string];

/** Is the colour a gradient tuple (2 or 3 colours)? */
function isGradient(
  c: ColorProp,
): c is [string, string] | [string, string, string] {
  return Array.isArray(c);
}

/* ---- Colour interpolation helpers ---- */

/** Parse a hex colour to [r, g, b] (0-255) */
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Convert [r, g, b] (0-255) back to hex */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** Linearly interpolate between two hex colours at position t (0-1) */
function lerpColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  );
}

/**
 * Interpolate through an array of colour stops at position t (0-1).
 * Evenly distributes stops along 0→1.
 */
function interpolateColors(colors: string[], t: number): string {
  if (colors.length === 1) return colors[0];
  const clamped = Math.max(0, Math.min(1, t));
  const segments = colors.length - 1;
  const scaled = clamped * segments;
  const idx = Math.min(Math.floor(scaled), segments - 1);
  const local = scaled - idx;
  return lerpColor(colors[idx], colors[idx + 1], local);
}

/** Build an SVG arc path `d` string from startAngle to endAngle (in radians), on circle at (cx, cy, r) */
function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Apple Health-style ring chart built with **pure SVG**.
 *
 * Each ring is a `<circle>` with a thick stroke and `stroke-dasharray` to
 * control the visible arc length.  `stroke-linecap="round"` gives the
 * characteristic rounded caps on both ends.
 *
 * For rings that exceed 100 % (overflow), an additional brighter stroke is
 * drawn on top.  A small SVG `<circle>` at 12-o'clock — the same colour as
 * the base ring — masks the overflow's starting rounded cap so only the
 * ending tip is visible, exactly like Apple Health.
 */
export function RingChart({
  data,
  size = 240,
  ringWidth = 20,
  gap = 6,
  animationDuration = 1200,
  className,
}: RingChartProps) {
  const center = size / 2;
  const maxOuter = center - 4; // small padding from SVG edge

  /* ---- mount animation ---- */
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ---- pre-compute ring geometry ---- */
  const rings = data.map((d, i) => {
    const outerR = maxOuter - i * (ringWidth + gap);
    const innerR = outerR - ringWidth;
    const midR = (outerR + innerR) / 2;
    const circ = 2 * Math.PI * midR;
    const pct = d.target > 0 ? Math.max(0, Math.min(d.value / d.target, 4)) : 0;
    const isOver = pct > 1;
    const overPct = isOver ? pct - 1 : 0;
    const basePct = isOver ? 1 : pct;

    const hasGrad = isGradient(d.color);
    const colors: string[] = hasGrad ? [...d.color] : [d.color as string];

    return {
      ...d,
      outerR,
      innerR,
      midR,
      circ,
      pct,
      isOver,
      overPct,
      basePct,
      hasGrad,
      colors,
      idx: i,
    };
  });

  /** Number of small segments per full circle for smooth angular gradient */
  const SEGMENTS = 180;

  return (
    <div className={`inline-flex items-center gap-8 ${className ?? ""}`}>
      {/* -------- SVG chart -------- */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block"
        >
          {rings.map((r) => {
            /* Total arc fraction — supports up to 400 % (4 full laps) */
            const totalPct = r.pct;
            const animatedTotal = animated ? totalPct : 0;

            /* Arc segments: split the visible arc into many small pieces */
            const totalAngle = animatedTotal * 2 * Math.PI;
            const segCount = Math.max(1, Math.round(SEGMENTS * animatedTotal));
            const segAngle = totalAngle / segCount;
            // Start at -90° (12 o'clock)
            const startOff = -Math.PI / 2;

            return (
              <g key={r.idx}>
                {/* LAYER 1 — Background track */}
                <circle
                  cx={center}
                  cy={center}
                  r={r.midR}
                  fill="none"
                  stroke="#D1D5DB"
                  strokeWidth={ringWidth}
                />

                {/* LAYER 2 — Segmented gradient arc */}
                {r.hasGrad ? (
                  <>
                    {Array.from({ length: segCount }, (_, s) => {
                      const a0 = startOff + s * segAngle;
                      // Extend each segment slightly to overlap and prevent gaps
                      const a1 = startOff + (s + 1) * segAngle + 0.005;
                      const t = segCount > 1 ? s / (segCount - 1) : 0;
                      const segColor = interpolateColors(r.colors, t);
                      const isFirst = s === 0;
                      const isLast = s === segCount - 1;
                      return (
                        <path
                          key={s}
                          d={arcPath(
                            center,
                            center,
                            r.midR,
                            a0,
                            Math.min(a1, startOff + totalAngle + 0.005),
                          )}
                          fill="none"
                          stroke={segColor}
                          strokeWidth={ringWidth}
                          strokeLinecap={isFirst || isLast ? "round" : "butt"}
                        />
                      );
                    })}
                  </>
                ) : (
                  /* Solid colour — single circle with dasharray */
                  <circle
                    cx={center}
                    cy={center}
                    r={r.midR}
                    fill="none"
                    stroke={r.colors[0]}
                    strokeWidth={ringWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${animatedTotal * r.circ} ${r.circ - animatedTotal * r.circ}`}
                    transform={`rotate(-90 ${center} ${center})`}
                    style={{
                      transition: `stroke-dasharray ${animationDuration}ms ease-out ${r.idx * 150}ms`,
                    }}
                  />
                )}

                {/* LAYER 3 — Drop-shadow overlay for overflow depth */}
                {r.isOver && animated && (
                  <circle
                    cx={center}
                    cy={center}
                    r={r.midR}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={ringWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min(r.overPct, 1) * r.circ} ${r.circ - Math.min(r.overPct, 1) * r.circ}`}
                    transform={`rotate(-90 ${center} ${center})`}
                    style={{
                      filter: "drop-shadow(-1px 2px 6px rgba(0, 0, 0, 0.45))",
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* ---- Center label ---- */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-6xl font-bold text-zinc-800">
            {Math.round(
              data[0]?.target > 0 ? (data[0].value / data[0].target) * 100 : 0,
            )}
            %
          </span>
          <span className="text-[7px] font-semibold tracking-widest text-zinc-400 uppercase mt-0.5">
            {data[0]?.label}
          </span>
        </div>
      </div>
    </div>
  );
}
