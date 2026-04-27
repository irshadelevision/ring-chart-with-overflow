import {
  MiniHorizontalBarChart,
  type MiniHorizontalBarDatum,
} from "@/components/mini-horizontal-bar-chart";
import { RingChart, type RingDatum } from "@/components/ring-chart";

export interface ReportMetricCardProps {
  title: string;
  value: number | string;
  barData: MiniHorizontalBarDatum[];
  gaugeValue: number;
  gaugeLabel: string;
  className?: string;
}

function formatValue(value: number | string): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value);
  }

  return value;
}

const gaugeColors: [string, string, string] = ["#111D8F", "#2C68CF", "#82E9EE"];

export function ReportMetricCard({
  title,
  value,
  barData,
  gaugeValue,
  gaugeLabel,
  className,
}: ReportMetricCardProps) {
  const ringData: RingDatum[] = [
    {
      label: gaugeLabel,
      value: gaugeValue,
      target: 100,
      color: gaugeColors,
    },
  ];

  return (
    <div className={`w-full ${className ?? ""}`}>
      <h3 className="text-center text-[1rem] font-black uppercase tracking-[0.03em] text-black">
        {title}
      </h3>

      <p className="mt-2 text-center text-[clamp(2.8rem,4.8vw,3.7rem)] font-black tracking-[-0.08em] text-[#0A277D]">
        {formatValue(value)}
      </p>

      <div
        className="mx-auto mt-5 h-px w-full"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(151, 236, 242, 0.65) 0%, rgba(245, 201, 171, 0.55) 48%, rgba(189, 196, 255, 0.55) 100%)",
        }}
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_150px] xl:items-center">
        <MiniHorizontalBarChart
          data={barData}
          chartWidth={280}
          labelWidth={88}
          chartHeight={188}
          barSize={10}
          ariaLabel={`${title} supporting horizontal bar chart`}
        />

        <div className="flex justify-center">
          <RingChart data={ringData} size={136} ringWidth={18} gap={6} />
        </div>
      </div>
    </div>
  );
}
