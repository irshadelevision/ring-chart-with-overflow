"use client";

import { useId, type CSSProperties } from "react";
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
  chartWidth?: number;
  chartHeight?: number;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  containerMaxWidthClassName?: string;
  chartContainerClassName?: string;
  barSize?: number;
  xTickFontSize?: number;
  xTickDy?: number;
  yTickFontSize?: number;
  xTickColor?: string;
  yTickColor?: string;
  labelRotation?: number;
  xAxisHeight?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  barCategoryGap?: string | number;
}

const DEFAULT_TICKS = [0, 1, 1.25, 1.5, 1.75, 2];

interface AffinityXAxisTickProps {
  x?: number | string;
  y?: number | string;
  payload?: {
    value?: string | number;
  };
  fontSize?: number;
  dy?: number;
  rotation?: number;
  color?: string;
}

function formatTick(value: number): string {
  return Number.isInteger(value)
    ? `${value}`
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function AffinityXAxisTick({
  x = 0,
  y = 0,
  payload,
  fontSize = 13.5,
  dy = 22,
  rotation = -27,
  color = "#B8B8B8",
}: AffinityXAxisTickProps) {
  const translateX = typeof x === "number" ? x : Number(x ?? 0);
  const translateY = typeof y === "number" ? y : Number(y ?? 0);

  return (
    <g transform={`translate(${translateX}, ${translateY})`}>
      <text
        dy={dy}
        fill={color}
        fontSize={fontSize}
        fontWeight={400}
        textAnchor="end"
        transform={`rotate(${rotation})`}
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
  chartWidth = 1240,
  chartHeight = 560,
  titleClassName,
  titleStyle,
  containerMaxWidthClassName,
  chartContainerClassName,
  barSize = 60,
  xTickFontSize = 14.175,
  xTickDy = 22,
  yTickFontSize = 19.95,
  xTickColor = "#B8B8B8",
  yTickColor = "#B7B7B7",
  labelRotation = -27,
  xAxisHeight = 118,
  margin,
  barCategoryGap,
}: AffinityBarChartProps) {
  const gradientSeed = useId().replace(/:/g, "");
  const chartData = data.map((datum, index) => ({
    ...datum,
    gradientId: `${gradientSeed}-affinity-${index}`,
  }));
  const resolvedMargin = margin ?? {
    top: 28,
    right: 16,
    bottom: 154,
    left: 28,
  };

  if (!data.length) {
    return null;
  }

  return (
    <section className={`w-full ${className ?? ""}`}>
      <h2
        className={`text-center text-3xl font-black tracking-[0.08em] text-black sm:text-4xl ${titleClassName ?? ""}`}
        style={titleStyle}
      >
        {title}
      </h2>

      <div
        className={`mx-auto mt-12 w-full overflow-x-auto ${chartContainerClassName ?? ""}`}
      >
        <div
          className={`mx-auto h-140 ${containerMaxWidthClassName ?? ""}`}
          style={{ width: chartWidth, height: chartHeight }}
          role="img"
          aria-label="Affinity index bar chart"
        >
          <BarChart
            width={chartWidth}
            height={chartHeight}
            data={chartData}
            margin={resolvedMargin}
            barCategoryGap={barCategoryGap}
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
              height={xAxisHeight}
              padding={{ left: 26, right: 14 }}
              tick={(tickProps: AffinityXAxisTickProps) => (
                <AffinityXAxisTick
                  {...tickProps}
                  fontSize={xTickFontSize}
                  dy={xTickDy}
                  rotation={labelRotation}
                  color={xTickColor}
                />
              )}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              interval={0}
              ticks={ticks}
              domain={[0, maxValue]}
              tickFormatter={formatTick}
              width={54}
              tick={{
                fill: yTickColor,
                fontSize: yTickFontSize,
                fontWeight: 400,
              }}
            />

            <Bar
              dataKey="value"
              barSize={barSize}
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
