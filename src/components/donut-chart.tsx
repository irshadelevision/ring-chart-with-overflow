"use client";

import { useMemo } from "react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const CONNECTOR_COLOR = "#C9CDD7";
const PERCENT_COLOR = "#102B79";
const LABEL_COLOR = "#B6BAC6";
const TRANSPARENT = "rgba(255, 255, 255, 0)";
const FALLBACK_FONT = "Arial, Helvetica, sans-serif";

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutDatum[];
  size?: number;
  cutout?: number | string;
  segmentSpacing?: number;
  rotation?: number;
  className?: string;
}

function normalizeValue(value: number): number {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

export function DonutChart({
  data,
  size = 320,
  cutout = "64%",
  segmentSpacing = 5,
  rotation = 16,
  className,
}: DonutChartProps) {
  const safeValues = useMemo(
    () => data.map((item) => normalizeValue(item.value)),
    [data],
  );
  const total = useMemo(
    () => safeValues.reduce((sum, value) => sum + value, 0),
    [safeValues],
  );

  const labelPadding = Math.round(size * 0.39);
  const canvasSize = size + labelPadding * 2;

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: safeValues,
          backgroundColor: data.map((item) => item.color),
          borderAlign: "inner" as const,
          borderColor: TRANSPARENT,
          borderWidth: 0,
          borderRadius: 9,
          spacing: segmentSpacing,
          hoverOffset: 0,
          hoverBorderColor: TRANSPARENT,
          hoverBorderWidth: 0,
        },
      ],
    }),
    [data, safeValues, segmentSpacing],
  );

  const externalLabelsPlugin = useMemo<Plugin<"doughnut">>(
    () => ({
      id: "polished_doughnut_labels",
      afterDatasetsDraw(chart) {
        const meta = chart.getDatasetMeta(0);

        if (!meta?.data.length || total <= 0) {
          return;
        }

        const fontFamily =
          (typeof window !== "undefined"
            ? window.getComputedStyle(document.body).fontFamily
            : FALLBACK_FONT) || FALLBACK_FONT;
        const scale = chart.width / canvasSize;
        const radialStart = Math.max(8 * scale, 6);
        const diagonalRun = Math.max(48 * scale, 34);
        const diagonalRise = Math.max(48 * scale, 34);
        const horizontalReach = Math.max(108 * scale, 78);
        const lineWidth = Math.max(1.6 * scale, 1.1);
        const dotRadius = Math.max(3 * scale, 2.1);
        const percentFontSize = Math.max(32 * scale, 22);
        const labelFontSize = Math.max(15 * scale, 11);
        const percentBottomOffset = Math.max(14 * scale, 10);
        const labelTopOffset = Math.max(10 * scale, 7);
        const textInset = Math.max(1 * scale, 0.5);

        const { ctx } = chart;

        ctx.save();

        meta.data.forEach((arc, index) => {
          const datum = data[index];
          const value = safeValues[index];

          if (!datum || value <= 0) {
            return;
          }

          const { x, y, startAngle, endAngle, outerRadius } = arc.getProps(
            ["x", "y", "startAngle", "endAngle", "outerRadius"],
            true,
          );
          const midAngle = (startAngle + endAngle) / 2;
          const radialX = Math.cos(midAngle);
          const radialY = Math.sin(midAngle);
          const lineStartX = x + radialX * (outerRadius + radialStart);
          const lineStartY = y + radialY * (outerRadius + radialStart);
          const isRightSide = radialX >= 0;
          const isLowerHalf = radialY >= 0;
          const bendX = lineStartX + (isRightSide ? diagonalRun : -diagonalRun);
          const bendY =
            lineStartY + (isLowerHalf ? diagonalRise : -diagonalRise);
          const endX =
            bendX + (isRightSide ? horizontalReach : -horizontalReach);
          const endY = bendY;
          const textX = endX + (isRightSide ? -textInset : textInset);
          const percentage = `${Math.round((value / total) * 100)}%`;

          ctx.beginPath();
          ctx.moveTo(lineStartX, lineStartY);
          ctx.lineTo(bendX, bendY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = CONNECTOR_COLOR;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(endX, endY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = CONNECTOR_COLOR;
          ctx.fill();

          ctx.textAlign = isRightSide ? "right" : "left";
          ctx.fillStyle = PERCENT_COLOR;
          ctx.font = `700 ${percentFontSize}px ${fontFamily}`;
          ctx.textBaseline = "bottom";
          ctx.fillText(percentage, textX, endY - percentBottomOffset);

          ctx.fillStyle = LABEL_COLOR;
          ctx.font = `500 ${labelFontSize}px ${fontFamily}`;
          ctx.textBaseline = "top";
          ctx.fillText(datum.label, textX, endY + labelTopOffset);
        });

        ctx.restore();
      },
    }),
    [canvasSize, data, safeValues, total],
  );

  const options = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      rotation,
      circumference: 360,
      cutout,
      animation: {
        animateRotate: true,
        animateScale: false,
        duration: 1000,
        easing: "easeOutCubic",
      },
      layout: {
        padding: {
          top: labelPadding,
          right: labelPadding,
          bottom: labelPadding,
          left: labelPadding,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      elements: {
        arc: {
          borderJoinStyle: "round",
          borderWidth: 0,
        },
      },
    }),
    [cutout, labelPadding, rotation],
  );

  if (!data.length) {
    return null;
  }

  return (
    <div
      className={`mx-auto w-full ${className ?? ""}`}
      style={{ maxWidth: canvasSize }}
    >
      <div className="relative aspect-square w-full">
        <Doughnut
          data={chartData}
          options={options}
          plugins={[externalLabelsPlugin]}
          role="img"
          aria-label="Age distribution doughnut chart"
        />
      </div>
    </div>
  );
}
