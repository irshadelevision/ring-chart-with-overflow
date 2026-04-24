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

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-16">
        <RingChart data={healthRings} size={260} ringWidth={44} gap={7} />

        <DonutChart
          data={ageBreakdown}
          size={420}
          cutout="56%"
          segmentSpacing={2.5}
          rotation={16}
        />
      </div>
    </main>
  );
}
