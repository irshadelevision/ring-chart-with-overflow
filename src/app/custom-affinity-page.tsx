import {
  AffinityBarChart,
  type AffinityBarDatum,
} from "@/components/affinity-bar-chart";
import { DonutChart, type DonutDatum } from "@/components/donut-chart";
import { RingChart, type RingDatum } from "@/components/ring-chart";

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

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-16">
        <RingChart data={healthRings} size={260} ringWidth={44} gap={7} />

        <DonutChart
          data={ageBreakdown}
          size={420}
          cutout="56%"
          segmentSpacing={2.5}
          rotation={16}
        />

        <AffinityBarChart data={affinityIndex} />
      </div>
    </main>
  );
}
