"use client";

import { useId, type CSSProperties } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export interface UniqueReachDatum {
  label: string;
  value: number;
}

export interface UniqueReachChartProps {
  value: number | string;
  data: UniqueReachDatum[];
  title?: string;
  maxValue?: number;
  ticks?: number[];
  className?: string;
  chartWidth?: number;
  chartHeight?: number;
  labelWidth?: number;
  barSize?: number;
  titleStyle?: CSSProperties;
  valueStyle?: CSSProperties;
  titleClassName?: string;
  valueClassName?: string;
  containerMaxWidthClassName?: string;
  dividerClassName?: string;
  dividerStyle?: CSSProperties;
  chartContainerClassName?: string;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  barCategoryGap?: string | number;
  xTickFontSize?: number;
  yTickFontSize?: number;
  xTickColor?: string;
  yTickColor?: string;
  showDivider?: boolean;
}

const DEFAULT_TICKS = [0, 800_000, 1_600_000, 2_400_000, 3_200_000, 4_000_000];

interface AxisTickProps {
  x?: number | string;
  y?: number | string;
  payload?: {
    value?: string | number;
  };
}

interface StyledAxisTickProps extends AxisTickProps {
  fontSize?: number;
  color?: string;
}

function formatValue(value: number | string): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value);
  }

  return value;
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

function UniqueReachYAxisTick({
  x = 0,
  y = 0,
  payload,
  fontSize = 13,
  color = "#4D68A6",
}: StyledAxisTickProps) {
  const translateX = typeof x === "number" ? x : Number(x ?? 0);
  const translateY = typeof y === "number" ? y : Number(y ?? 0);

  return (
    <g transform={`translate(${translateX}, ${translateY})`}>
      <text
        x={-6}
        dy={4}
        fill={color}
        fontSize={fontSize}
        fontWeight={500}
        textAnchor="end"
      >
        {payload?.value}
      </text>
    </g>
  );
}

function UniqueReachXAxisTick({
  x = 0,
  y = 0,
  payload,
  fontSize = 12.5,
  color = "#B9BDC9",
}: StyledAxisTickProps) {
  const value =
    typeof payload?.value === "number"
      ? formatTick(payload.value)
      : payload?.value;
  const translateX = typeof x === "number" ? x : Number(x ?? 0);
  const translateY = typeof y === "number" ? y : Number(y ?? 0);

  return (
    <g transform={`translate(${translateX}, ${translateY})`}>
      <text
        dy={18}
        fill={color}
        fontSize={fontSize}
        fontWeight={400}
        textAnchor="middle"
      >
        {value}
      </text>
    </g>
  );
}

export function UniqueReachChart({
  value,
  data,
  title = "UNIQUE REACH",
  maxValue = 4_100_000,
  ticks = DEFAULT_TICKS,
  className,
  chartWidth = 1152,
  chartHeight,
  labelWidth = 190,
  barSize = 14,
  titleStyle,
  valueStyle,
  titleClassName,
  valueClassName,
  containerMaxWidthClassName = "max-w-7xl",
  dividerClassName = "max-w-6xl",
  dividerStyle,
  chartContainerClassName,
  margin,
  barCategoryGap = "34%",
  xTickFontSize = 12.5,
  yTickFontSize = 13,
  xTickColor = "#B9BDC9",
  yTickColor = "#4D68A6",
  showDivider = true,
}: UniqueReachChartProps) {
  const gradientSeed = useId().replace(/:/g, "");
  const gradientId = `${gradientSeed}-unique-reach-bar-gradient`;
  const formattedValue = formatValue(value);
  const resolvedChartHeight = chartHeight ?? data.length * 42 + 92;
  const resolvedMargin = margin ?? { top: 8, right: 26, bottom: 18, left: 10 };

  if (!data.length) {
    return null;
  }

  return (
    <section className={`w-full ${className ?? ""}`}>
      <div className={`mx-auto w-full ${containerMaxWidthClassName}`}>
        <h2
          className={`text-center text-4xl font-black tracking-[0.03em] text-black sm:text-5xl lg:text-[3.75rem] ${titleClassName ?? ""}`}
          style={titleStyle}
        >
          {title}
        </h2>

        <p
          className={`mt-4 text-center text-[clamp(4.5rem,10vw,7.5rem)] font-black tracking-[-0.08em] text-[#0A277D] ${valueClassName ?? ""}`}
          style={valueStyle}
        >
          {formattedValue}
        </p>

        {showDivider ? (
          <div
            className={`mx-auto mt-6 h-px w-full ${dividerClassName}`}
            style={
              dividerStyle ?? {
                backgroundImage:
                  "linear-gradient(90deg, rgba(151, 236, 242, 0.65) 0%, rgba(245, 201, 171, 0.55) 48%, rgba(189, 196, 255, 0.55) 100%)",
              }
            }
          />
        ) : null}

        <div
          className={`mt-8 w-full overflow-x-auto ${chartContainerClassName ?? ""}`}
        >
          <div
            className="mx-auto"
            style={{ width: chartWidth }}
            role="img"
            aria-label="Unique reach horizontal bar chart"
          >
            <BarChart
              width={chartWidth}
              height={resolvedChartHeight}
              data={data}
              layout="vertical"
              margin={resolvedMargin}
              barCategoryGap={barCategoryGap}
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
                tickFormatter={formatTick}
                axisLine={{ stroke: "#D9DCE6", strokeWidth: 1 }}
                tickLine={{ stroke: "#D9DCE6", strokeWidth: 1 }}
                height={34}
                tickMargin={8}
                interval={0}
                tick={(tickProps: AxisTickProps) => (
                  <UniqueReachXAxisTick
                    {...tickProps}
                    fontSize={xTickFontSize}
                    color={xTickColor}
                  />
                )}
              />

              <YAxis
                type="category"
                dataKey="label"
                width={labelWidth}
                axisLine={{ stroke: "#D9DCE6", strokeWidth: 1 }}
                tickLine={false}
                interval={0}
                tickMargin={10}
                tick={(tickProps: AxisTickProps) => (
                  <UniqueReachYAxisTick
                    {...tickProps}
                    fontSize={yTickFontSize}
                    color={yTickColor}
                  />
                )}
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
        </div>
      </div>
    </section>
  );
}
