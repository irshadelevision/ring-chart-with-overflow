"use client";

import { useId } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export interface MiniHorizontalBarDatum {
  label: string;
  value: number;
}

export interface MiniHorizontalBarChartProps {
  data: MiniHorizontalBarDatum[];
  maxValue?: number;
  ticks?: number[];
  chartWidth?: number;
  chartHeight?: number;
  labelWidth?: number;
  barSize?: number;
  className?: string;
  ariaLabel?: string;
}

const DEFAULT_TICKS = [0, 800_000, 1_600_000, 2_400_000, 3_200_000, 4_000_000];

interface AxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value?: string | number;
  };
}

function formatTick(value: number): string {
  if (value === 0) {
    return "0";
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  return `${(value / 1_000).toFixed(1)}K`;
}

function MiniXAxisTick({ x = 0, y = 0, payload }: AxisTickProps) {
  const value =
    typeof payload?.value === "number"
      ? formatTick(payload.value)
      : payload?.value;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        dy={16}
        fill="#B9BDC9"
        fontSize={10}
        fontWeight={400}
        textAnchor="middle"
      >
        {value}
      </text>
    </g>
  );
}

function MiniYAxisTick({ x = 0, y = 0, payload }: AxisTickProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        x={-4}
        dy={4}
        fill="#4D68A6"
        fontSize={11}
        fontWeight={500}
        textAnchor="end"
      >
        {payload?.value}
      </text>
    </g>
  );
}

export function MiniHorizontalBarChart({
  data,
  maxValue = 4_100_000,
  ticks = DEFAULT_TICKS,
  chartWidth = 360,
  chartHeight,
  labelWidth = 102,
  barSize = 10,
  className,
  ariaLabel = "Mini horizontal bar chart",
}: MiniHorizontalBarChartProps) {
  const gradientSeed = useId().replace(/:/g, "");
  const gradientId = `${gradientSeed}-mini-bar-gradient`;
  const resolvedChartHeight = chartHeight ?? data.length * 30 + 38;

  if (!data.length) {
    return null;
  }

  return (
    <div
      className={`w-full ${className ?? ""}`}
      role="img"
      aria-label={ariaLabel}
    >
      <BarChart
        width={chartWidth}
        height={resolvedChartHeight}
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 6, bottom: 14, left: 10 }}
        barCategoryGap="34%"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0B287F" />
            <stop offset="56%" stopColor="#2A66C9" />
            <stop offset="100%" stopColor="#84E9EF" />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="#ECECF2"
          strokeWidth={1}
          horizontal={false}
          vertical
        />

        <XAxis
          type="number"
          domain={[0, maxValue]}
          ticks={ticks}
          axisLine={{ stroke: "#D9DCE6", strokeWidth: 1 }}
          tickLine={{ stroke: "#D9DCE6", strokeWidth: 1 }}
          height={30}
          tickMargin={7}
          interval={0}
          tick={<MiniXAxisTick />}
        />

        <YAxis
          type="category"
          dataKey="label"
          width={labelWidth}
          axisLine={{ stroke: "#D9DCE6", strokeWidth: 1 }}
          tickLine={false}
          interval={0}
          tickMargin={8}
          tick={<MiniYAxisTick />}
        />

        <Bar
          dataKey="value"
          fill={`url(#${gradientId})`}
          radius={[0, 3, 3, 0]}
          barSize={barSize}
          isAnimationActive={false}
        />
      </BarChart>
    </div>
  );
}
