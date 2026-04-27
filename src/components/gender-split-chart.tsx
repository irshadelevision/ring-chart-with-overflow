export interface GenderSplitChartProps {
  leftPercentage: number;
  rightPercentage: number;
  className?: string;
}

const LABEL_COLOR = "#0B277F";
const CONNECTOR_COLOR = "#B7B7B7";
const LABEL_FONT_SIZE = 61.6;

function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function GenderSplitChart({
  leftPercentage,
  rightPercentage,
  className,
}: GenderSplitChartProps) {
  return (
    <section className={`w-full ${className ?? ""}`}>
      <div className="mx-auto w-full max-w-7xl">
        <svg
          viewBox="0 0 1200 680"
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label={`Audience split chart showing ${formatPercentage(leftPercentage)} and ${formatPercentage(rightPercentage)}`}
        >
          <text
            x="74"
            y="98"
            fill={LABEL_COLOR}
            fontFamily='"Urbane", "Arial Black", "Helvetica Neue", Arial, sans-serif'
            fontSize={LABEL_FONT_SIZE}
            fontWeight="600"
          >
            {formatPercentage(leftPercentage)}
          </text>

          <text
            x="1126"
            y="98"
            fill={LABEL_COLOR}
            fontFamily='"Urbane", "Arial Black", "Helvetica Neue", Arial, sans-serif'
            fontSize={LABEL_FONT_SIZE}
            fontWeight="600"
            textAnchor="end"
          >
            {formatPercentage(rightPercentage)}
          </text>

          <polyline
            points="78,122 266,122 324,180"
            fill="none"
            stroke={CONNECTOR_COLOR}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <polyline
            points="1122,122 934,122 876,180"
            fill="none"
            stroke={CONNECTOR_COLOR}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <circle cx="78" cy="122" r="3.5" fill={CONNECTOR_COLOR} />
          <circle cx="1122" cy="122" r="3.5" fill={CONNECTOR_COLOR} />

          <image
            href="/Male.svg"
            x="307"
            y="66"
            width="187"
            height="530"
            preserveAspectRatio="xMidYMid meet"
          />

          <image
            href="/Female.svg"
            x="676"
            y="66"
            width="235"
            height="530"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
    </section>
  );
}
