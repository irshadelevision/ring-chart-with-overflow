import {
  AffinityBarChart,
  type AffinityBarDatum,
} from "@/components/affinity-bar-chart";
import { DonutChart, type DonutDatum } from "@/components/donut-chart";
import { GenderSplitChart } from "@/components/gender-split-chart";
import { RingChart, type RingDatum } from "@/components/ring-chart";
import { TotalScreens } from "@/components/total-screens";
import {
  UniqueReachChart,
  type UniqueReachDatum,
} from "@/components/unique-reach-chart";

const progressValue = 120;

const healthRings: RingDatum[] = [
  {
    label: "Percentage of Target",
    value: progressValue,
    target: 100,
    color: ["#00F2F2", "#047EBE", "#08088A"],
    unit: "%",
  },
];

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
    value: 0.33,
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

const totalScreens = 1579;
const uniqueReach = 151100;
const genderSplit = {
  leftPercentage: 59,
  rightPercentage: 41,
};

const uniqueReachByArea: UniqueReachDatum[] = [
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

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16">
        <RingChart data={healthRings} size={260} ringWidth={44} gap={7} />

        <DonutChart
          data={ageBreakdown}
          size={420}
          cutout="56%"
          segmentSpacing={2.5}
          rotation={16}
        />

        <AffinityBarChart data={affinityIndex} />

        <TotalScreens value={totalScreens} />

        <UniqueReachChart value={uniqueReach} data={uniqueReachByArea} />

        <GenderSplitChart
          leftPercentage={genderSplit.leftPercentage}
          rightPercentage={genderSplit.rightPercentage}
        />
      </div>
    </main>
  );
}
