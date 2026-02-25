"use client";

import { useState } from "react";
import { RingChart, RingDatum } from "@/components/ring-chart";


export default function Home() {
  const [pct, setPct] = useState(124);

  const healthRings: RingDatum[] = [
    {
      label: "Percentage of Target",
      value: pct,
      target: 100,
      color: ["#00F2F2", "#047EBE", "#08088A"],
      unit: "%",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <RingChart data={healthRings} size={260} ringWidth={44} gap={7} />
    </div>
  );
}
