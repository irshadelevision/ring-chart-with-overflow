"use client";

import { useLayoutEffect, useRef, useState } from "react";

export interface TotalScreensProps {
  value: number | string;
  title?: string;
  className?: string;
}

const TEXT_GRADIENT =
  "linear-gradient(180deg, #1E439E 12%, #265FC1 52%, #76D8EC 100%)";
const MAX_FONT_SIZE = 430;
const MIN_FONT_SIZE = 112;
const HORIZONTAL_PADDING = 24;

function formatValue(value: number | string): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value);
  }

  return value;
}

export function TotalScreens({
  value,
  title = "TOTAL SCREENS",
  className,
}: TotalScreensProps) {
  const formattedValue = formatValue(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) {
      return;
    }

    let frameId = 0;

    const fitText = () => {
      const availableWidth = Math.max(
        container.clientWidth - HORIZONTAL_PADDING,
        MIN_FONT_SIZE,
      );

      let low = MIN_FONT_SIZE;
      let high = MAX_FONT_SIZE;
      let best = MIN_FONT_SIZE;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        text.style.fontSize = `${mid}px`;

        if (text.scrollWidth <= availableWidth) {
          best = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      text.style.fontSize = `${best}px`;
      setFontSize(best);
    };

    const scheduleFit = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(fitText);
    };

    const resizeObserver = new ResizeObserver(scheduleFit);
    resizeObserver.observe(container);

    scheduleFit();
    void document.fonts?.ready.then(scheduleFit);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [formattedValue]);

  return (
    <section className={`w-full ${className ?? ""}`}>
      <h2 className="text-center text-4xl font-black tracking-[0.03em] text-black sm:text-5xl lg:text-[3.75rem]">
        {title}
      </h2>

      <div
        ref={containerRef}
        className="mt-10 flex justify-center overflow-visible px-3 pt-3 pb-10"
      >
        <p
          ref={textRef}
          className="m-0 inline-block select-none whitespace-nowrap bg-clip-text text-center text-transparent"
          style={{
            backgroundImage: TEXT_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
            fontSize: `${fontSize}px`,
            fontWeight: 900,
            fontStyle: "normal",
            letterSpacing: "-0.055em",
            lineHeight: 1,
            paddingTop: "0.08em",
            paddingRight: "0.06em",
            paddingBottom: "0.1em",
            paddingLeft: "0.08em",
          }}
          aria-label={`${title} ${formattedValue}`}
        >
          {formattedValue}
        </p>
      </div>
    </section>
  );
}
