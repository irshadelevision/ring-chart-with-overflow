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

function formatTick(value: number): string {
  return Number.isInteger(value)
    ? `${value}`
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function roundedTopBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): string {
  const safeHeight = Math.max(height, 0);
  const safeRadius = Math.min(radius, width / 2, safeHeight);
  const bottom = y + safeHeight;

  return [
    `M ${x} ${bottom}`,
    `L ${x} ${y + safeRadius}`,
    `Q ${x} ${y} ${x + safeRadius} ${y}`,
    `L ${x + width - safeRadius} ${y}`,
    `Q ${x + width} ${y} ${x + width} ${y + safeRadius}`,
    `L ${x + width} ${bottom}`,
    "Z",
  ].join(" ");
}

export function AffinityBarChart({
  data,
  title = "AFFINITY INDEX",
  maxValue = 2,
  ticks = DEFAULT_TICKS,
  className,
}: AffinityBarChartProps) {
  if (!data.length) {
    return null;
  }

  const viewWidth = 1240;
  const viewHeight = 560;
  const margin = { top: 28, right: 28, bottom: 176, left: 78 };
  const chartWidth = viewWidth - margin.left - margin.right;
  const chartHeight = viewHeight - margin.top - margin.bottom;
  const slotWidth = chartWidth / data.length;
  const barWidth = Math.min(slotWidth * 0.5, 62);
  const barRadius = 8;
  const labelY = margin.top + chartHeight + 26;

  return (
    <section className={`w-full ${className ?? ""}`}>
      <h2 className="text-center text-3xl font-black tracking-[0.08em] text-black sm:text-4xl">
        {title}
      </h2>

      <div className="mx-auto mt-8 w-full max-w-6xl">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Affinity index bar chart"
        >
          <defs>
            {data.map((datum, index) => {
              const gradientId = `affinity-bar-gradient-${index}`;

              return (
                <linearGradient
                  id={gradientId}
                  key={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  {datum.colors.map((color, stopIndex) => (
                    <stop
                      key={`${gradientId}-stop-${stopIndex}`}
                      offset={`${(stopIndex / (datum.colors.length - 1)) * 100}%`}
                      stopColor={color}
                    />
                  ))}
                </linearGradient>
              );
            })}
          </defs>

          {ticks.map((tick) => {
            const y =
              margin.top + chartHeight - (tick / maxValue) * chartHeight;

            return (
              <g key={`tick-${tick}`}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={viewWidth - margin.right}
                  y2={y}
                  stroke="#E8E8E8"
                  strokeWidth="1.5"
                />
                <text
                  x={margin.left - 12}
                  y={y + 7}
                  textAnchor="end"
                  fontSize="19"
                  fontWeight="400"
                  fill="#B7B7B7"
                >
                  {formatTick(tick)}
                </text>
              </g>
            );
          })}

          {data.map((datum, index) => {
            const normalizedValue = Math.max(
              0,
              Math.min(datum.value, maxValue),
            );
            const barHeight = (normalizedValue / maxValue) * chartHeight;
            const x =
              margin.left + index * slotWidth + (slotWidth - barWidth) / 2;
            const y = margin.top + chartHeight - barHeight;
            const gradientId = `affinity-bar-gradient-${index}`;
            const labelX = x + barWidth / 2;

            return (
              <g key={datum.label}>
                <path
                  d={roundedTopBarPath(x, y, barWidth, barHeight, barRadius)}
                  fill={`url(#${gradientId})`}
                />

                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  fontSize="13.5"
                  fontWeight="400"
                  fill="#B8B8B8"
                  transform={`rotate(-27 ${labelX} ${labelY})`}
                >
                  {datum.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
