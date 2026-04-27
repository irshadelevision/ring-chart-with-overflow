import {
  AffinityBarChart,
  type AffinityBarDatum,
} from "@/components/affinity-bar-chart";
import { DonutChart, type DonutDatum } from "@/components/donut-chart";
import { GenderSplitChart } from "@/components/gender-split-chart";
import {
  MiniHorizontalBarChart,
  type MiniHorizontalBarDatum,
} from "@/components/mini-horizontal-bar-chart";
import { RingChart, type RingDatum } from "@/components/ring-chart";
import { TotalScreens } from "@/components/total-screens";
import {
  UniqueReachChart,
  type UniqueReachDatum,
} from "@/components/unique-reach-chart";

const dividerStyle = {
  backgroundImage:
    "linear-gradient(90deg, rgba(151, 236, 242, 0.65) 0%, rgba(245, 201, 171, 0.55) 48%, rgba(189, 196, 255, 0.55) 100%)",
};

function ReportCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[22px] border border-[#ECECE8] bg-[#F8F8F6] px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] xl:px-6 xl:py-5 ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

function ReportPage({
  children,
  className,
  breakAfter,
}: {
  children: React.ReactNode;
  className?: string;
  breakAfter?: boolean;
}) {
  return (
    <section
      className={`report-sheet ${breakAfter ? "report-sheet-break" : ""} ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

function formatValue(value: number | string): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value);
  }

  return value;
}

function MetricReportCard({
  title,
  value,
  barData,
  gaugeValue,
}: {
  title: string;
  value: number | string;
  barData: MiniHorizontalBarDatum[];
  gaugeValue: number;
}) {
  const ringData: RingDatum[] = [
    {
      label: "Percentage of Target",
      value: gaugeValue,
      target: 100,
      color: ["#111D8F", "#2C68CF", "#82E9EE"],
    },
  ];

  return (
    <ReportCard className="flex min-h-190 flex-col px-6 py-7">
      <h2 className="text-center text-[1.08rem] font-semibold uppercase tracking-[0.08em] text-black">
        {title}
      </h2>

      <p className="mt-3 text-center text-[clamp(3.35rem,4.1vw,4.45rem)] font-semibold tracking-[-0.05em] text-[#0A277D]">
        {formatValue(value)}
      </p>

      <div className="mx-auto mt-5 h-px w-full" style={dividerStyle} />

      <div className="mt-6 flex flex-1 flex-col gap-6">
        <MiniHorizontalBarChart
          data={barData}
          chartWidth={432}
          labelWidth={116}
          chartHeight={500}
          barSize={9}
          ariaLabel={`${title} bar chart by area`}
        />

        <div className="mt-auto flex justify-center">
          <RingChart
            data={ringData}
            size={248}
            ringWidth={38}
            gap={10}
            centerValueClassName="font-semibold tracking-[-0.035em]"
            centerLabelClassName="font-semibold tracking-[0.24em]"
          />
        </div>
      </div>
    </ReportCard>
  );
}

const dateRange = "01/01/2025 - 31/01/2025";
const totalScreens = 1579;
const uniqueReach = 151100;
const totalImpressions = 7_805_650;
const totalAdPlays = 8_404_458;

const ageBreakdown: DonutDatum[] = [
  { label: "18-24", value: 15, color: "#28B5CC" },
  { label: "55+", value: 18, color: "#F68A33" },
  { label: "44-54", value: 9, color: "#9516CC" },
  { label: "35-44", value: 26, color: "#2756B5" },
  { label: "25-34", value: 32, color: "#0D2272" },
];

const affinityIndex: AffinityBarDatum[] = [
  {
    label: "BEAUTY & FASHIONISTA",
    value: 1.33,
    colors: ["#90E9F2", "#2E89D8", "#111EA5"],
  },
  {
    label: "FAMILY LIFESTYLE",
    value: 1.41,
    colors: ["#9B18E1", "#7710BB", "#46116F"],
  },
  {
    label: "FITNESS ENTHUSIAST",
    value: 1.32,
    colors: ["#30418B", "#132C6F", "#081E50"],
  },
  {
    label: "FOODIE",
    value: 1.42,
    colors: ["#FF9B3D", "#F07F3C", "#A6542C"],
  },
  {
    label: "GLOBE TROTTER",
    value: 1.52,
    colors: ["#2B5EB9", "#244F9D", "#183770"],
  },
  {
    label: "LUXURY LIFESTYLE",
    value: 1.27,
    colors: ["#88E2EC", "#2A84D5", "#111AA4"],
  },
  {
    label: "SAVVY SHOPPERS",
    value: 1.38,
    colors: ["#9917DF", "#7310AE", "#46106D"],
  },
  {
    label: "SHOPAHOLICS",
    value: 1.42,
    colors: ["#314087", "#13306F", "#061D50"],
  },
  {
    label: "SOCIALITES",
    value: 1.74,
    colors: ["#FF9D3E", "#FF853F", "#AA562C"],
  },
  {
    label: "YOUNG PROFESSIONALS",
    value: 1.35,
    colors: ["#2D5EBA", "#244D9D", "#193871"],
  },
];

const reachByArea: UniqueReachDatum[] = [
  { label: "Abu Dhabi Comm", value: 1_680_000 },
  { label: "Abu Dhabi Res", value: 2_950_000 },
  { label: "Business Bay Comm", value: 3_940_000 },
  { label: "Business Bay Res", value: 2_740_000 },
  { label: "DIFC Freezone", value: 1_880_000 },
  { label: "Downtown", value: 2_390_000 },
  { label: "Dubai Creek", value: 1_320_000 },
  { label: "Dubai Hills", value: 1_070_000 },
  { label: "Dubai Marina", value: 4_060_000 },
  { label: "Dubai Silicon Oasis", value: 1_890_000 },
  { label: "Expo South", value: 1_490_000 },
  { label: "JBR", value: 3_100_000 },
  { label: "JLT Comm", value: 2_040_000 },
  { label: "JLT Res", value: 1_590_000 },
  { label: "JVC", value: 2_570_000 },
  { label: "The Greens And Views", value: 2_790_000 },
  { label: "The Palm", value: 1_990_000 },
  { label: "One Central", value: 1_930_000 },
];

const impressionsByArea: MiniHorizontalBarDatum[] = [
  { label: "Abu Dhabi Comm", value: 1_720_000 },
  { label: "Abu Dhabi Res", value: 2_960_000 },
  { label: "Business Bay Comm", value: 3_920_000 },
  { label: "Business Bay Res", value: 2_740_000 },
  { label: "DIFC Freezone", value: 1_920_000 },
  { label: "Downtown", value: 2_390_000 },
  { label: "Dubai Creek", value: 1_380_000 },
  { label: "Dubai Hills", value: 1_120_000 },
  { label: "Dubai Marina", value: 4_060_000 },
  { label: "Dubai Silicon Oasis", value: 1_920_000 },
  { label: "Expo South", value: 1_530_000 },
  { label: "JBR", value: 3_120_000 },
  { label: "JLT Comm", value: 2_080_000 },
  { label: "JLT Res", value: 1_610_000 },
  { label: "JVC", value: 2_580_000 },
  { label: "The Greens And Views", value: 2_790_000 },
  { label: "The Palm", value: 2_020_000 },
  { label: "One Central", value: 1_960_000 },
];

const adPlaysByArea: MiniHorizontalBarDatum[] = [
  { label: "Abu Dhabi Comm", value: 1_710_000 },
  { label: "Abu Dhabi Res", value: 3_020_000 },
  { label: "Business Bay Comm", value: 3_860_000 },
  { label: "Business Bay Res", value: 2_760_000 },
  { label: "DIFC Freezone", value: 1_950_000 },
  { label: "Downtown", value: 2_450_000 },
  { label: "Dubai Creek", value: 1_380_000 },
  { label: "Dubai Hills", value: 1_140_000 },
  { label: "Dubai Marina", value: 4_180_000 },
  { label: "Dubai Silicon Oasis", value: 1_950_000 },
  { label: "Expo South", value: 1_570_000 },
  { label: "JBR", value: 3_150_000 },
  { label: "JLT Comm", value: 2_120_000 },
  { label: "JLT Res", value: 1_650_000 },
  { label: "JVC", value: 2_610_000 },
  { label: "The Greens And Views", value: 2_810_000 },
  { label: "The Palm", value: 2_060_000 },
  { label: "One Central", value: 2_000_000 },
];

export default function ReportOnePage() {
  return (
    <main className="report-print-stack font-urbane min-h-screen bg-[#F1F1ED] px-6 py-8 text-black">
      <ReportPage breakAfter className="space-y-4">
        <header className="rounded-[22px] border border-[#ECECE8] bg-[#F8F8F6] px-10 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[2.05rem] font-semibold uppercase tracking-[-0.02em] text-black">
                Instashop
              </p>
              <p className="mt-1 text-lg font-semibold text-black">
                {dateRange}
              </p>
            </div>

            <h1 className="text-right text-[3.15rem] font-semibold uppercase tracking-[-0.03em] text-black">
              Campaign Report
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-[1.04fr_0.96fr] grid-rows-[300px_510px] gap-4">
          <ReportCard className="px-6 py-6">
            <TotalScreens
              value={totalScreens}
              titleStyle={{ fontSize: "1.08rem" }}
              titleClassName="font-semibold tracking-[0.08em]"
              valueStyle={{ fontWeight: 600, letterSpacing: "-0.04em" }}
              maxFontSize={205}
              minFontSize={92}
              horizontalPadding={12}
              containerClassName="!mt-4 !px-0 !pt-0 !pb-1"
            />
          </ReportCard>

          <ReportCard className="row-span-2 flex flex-col px-6 py-6">
            <h2 className="text-center text-[1.1rem] font-semibold uppercase tracking-[0.08em] text-black">
              Demographics
            </h2>

            <div className="mt-5 flex flex-1 flex-col justify-between">
              <DonutChart
                data={ageBreakdown}
                size={292}
                cutout="56%"
                segmentSpacing={2}
                rotation={16}
                labelPaddingX={140}
                labelPaddingY={72}
                percentColor="#0B277F"
                labelColor="#0B277F"
                percentFontWeight={600}
                labelFontWeight={600}
              />

              <GenderSplitChart
                leftPercentage={59}
                rightPercentage={41}
                className="mx-auto mt-6 max-w-102.5"
              />
            </div>
          </ReportCard>

          <ReportCard className="px-6 py-6">
            <AffinityBarChart
              data={affinityIndex}
              chartWidth={690}
              chartHeight={446}
              titleStyle={{ fontSize: "1.08rem" }}
              titleClassName="font-semibold tracking-[0.08em]"
              containerMaxWidthClassName="max-w-none"
              chartContainerClassName="mt-3"
              barSize={31}
              xTickFontSize={7.6}
              xTickDy={34}
              yTickFontSize={11.2}
              labelRotation={-23}
              xAxisHeight={82}
              margin={{ top: 8, right: 8, bottom: 30, left: 14 }}
            />
          </ReportCard>
        </div>
      </ReportPage>

      <ReportPage>
        <div className="grid grid-cols-[1fr_1fr_0.98fr] gap-4">
          <MetricReportCard
            title="Total Impressions"
            value={totalImpressions}
            barData={impressionsByArea}
            gaugeValue={75}
          />

          <MetricReportCard
            title="Total Ad Plays"
            value={totalAdPlays}
            barData={adPlaysByArea}
            gaugeValue={125}
          />

          <ReportCard className="min-h-190 px-6 py-7">
            <UniqueReachChart
              value={uniqueReach}
              data={reachByArea}
              chartWidth={452}
              chartHeight={760}
              labelWidth={128}
              barSize={8}
              titleStyle={{ fontSize: "1.08rem" }}
              valueStyle={{ fontSize: "4.15rem", marginTop: "0.45rem" }}
              titleClassName="font-semibold tracking-[0.08em]"
              valueClassName="font-semibold tracking-[-0.05em]"
              containerMaxWidthClassName="max-w-none"
              dividerClassName="max-w-full"
              chartContainerClassName="mt-4"
              margin={{ top: 4, right: 10, bottom: 18, left: 8 }}
              xTickFontSize={9.5}
              yTickFontSize={10.5}
            />
          </ReportCard>
        </div>
      </ReportPage>
    </main>
  );
}
