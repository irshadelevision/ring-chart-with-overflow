"use client";

import { useId } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

export interface AffinityBarDatum {
  label: string;
  value: number;
  colors: [string, string] | [string, string, string];
}

export interface AffinityBarChartProps {
  data: AffinityBarDatum[];
  title?: string;
  maxValue?: number;
  ticks?: number[];
  className?: string;
}

const DEFAULT_TICKS = [0, 1, 1.25, 1.5, 1.75, 2];

interface AffinityXAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value?: string | number;
  };
}

function formatTick(value: number): string {
  return Number.isInteger(value)
    ? `${value}`
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function AffinityXAxisTick({ x = 0, y = 0, payload }: AffinityXAxisTickProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        dy={22}
        fill="#B8B8B8"
        fontSize={13.5}
        fontWeight={400}
        textAnchor="end"
        transform="rotate(-27)"
      >
        {payload?.value}
      </text>
    </g>
  );
}

export function AffinityBarChart({
  data,
  title = "AFFINITY INDEX",
  maxValue = 2,
  ticks = DEFAULT_TICKS,
  className,
}: AffinityBarChartProps) {
  const gradientSeed = useId().replace(/:/g, "");
  const chartWidth = 1240;
  const chartHeight = 560;

  if (!data.length) {
    return null;
  }

  const chartData = data.map((datum, index) => ({
    ...datum,
    value: Math.max(0, Math.min(datum.value, maxValue)),
    gradientId: `${gradientSeed}-affinity-bar-gradient-${index}`,
  }));

  return (
    <section className={`w-full ${className ?? ""}`}>
      <h2 className="text-center text-3xl font-black tracking-[0.08em] text-black sm:text-4xl">
        {title}
      </h2>

      <div className="mx-auto mt-8 w-full overflow-x-auto">
        <div
          className="mx-auto h-140"
          style={{ width: chartWidth }}
          role="img"
          aria-label="Affinity index bar chart"
        >
          <BarChart
            width={chartWidth}
            height={chartHeight}
            data={chartData}
            margin={{ top: 28, right: 16, bottom: 154, left: 28 }}
          >
            <defs>
              {chartData.map((datum) => (
                <linearGradient
                  id={datum.gradientId}
                  key={datum.gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  {datum.colors.map((color, stopIndex) => (
                    <stop
                      key={`${datum.gradientId}-stop-${stopIndex}`}
                      offset={`${(stopIndex / (datum.colors.length - 1)) * 100}%`}
                      stopColor={color}
                    />
                  ))}
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              stroke="#E8E8E8"
              strokeWidth={1.5}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              interval={0}
              height={118}
              padding={{ left: 26, right: 14 }}
              tick={<AffinityXAxisTick />}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              interval={0}
              ticks={ticks}
              domain={[0, maxValue]}
              tickFormatter={formatTick}
              width={54}
              tick={{ fill: "#B7B7B7", fontSize: 19, fontWeight: 400 }}
            />

            <Bar
              dataKey="value"
              barSize={60}
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            >
              {chartData.map((datum) => (
                <Cell key={datum.label} fill={`url(#${datum.gradientId})`} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </section>
  );
}
