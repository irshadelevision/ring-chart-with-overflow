"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

export interface TotalScreensProps {
  value: number | string;
  title?: string;
  className?: string;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  valueClassName?: string;
  valueStyle?: CSSProperties;
  containerClassName?: string;
  maxFontSize?: number;
  minFontSize?: number;
  horizontalPadding?: number;
}

const TEXT_GRADIENT =
  "linear-gradient(180deg, #1E439E 12%, #265FC1 52%, #76D8EC 100%)";
const DEFAULT_MAX_FONT_SIZE = 430;
const DEFAULT_MIN_FONT_SIZE = 112;
const DEFAULT_HORIZONTAL_PADDING = 24;

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
  titleClassName,
  titleStyle,
  valueClassName,
  valueStyle,
  containerClassName,
  maxFontSize = DEFAULT_MAX_FONT_SIZE,
  minFontSize = DEFAULT_MIN_FONT_SIZE,
  horizontalPadding = DEFAULT_HORIZONTAL_PADDING,
}: TotalScreensProps) {
  const formattedValue = formatValue(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) {
      return;
    }

    let frameId = 0;

    const fitText = () => {
      const availableWidth = Math.max(
        container.clientWidth - horizontalPadding,
        minFontSize,
      );

      let low = minFontSize;
      let high = maxFontSize;
      let best = minFontSize;

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
  }, [formattedValue, horizontalPadding, maxFontSize, minFontSize]);

  return (
    <section className={`w-full ${className ?? ""}`}>
      <h2
        className={`text-center text-4xl font-black tracking-[0.03em] text-black sm:text-5xl lg:text-[3.75rem] ${titleClassName ?? ""}`}
        style={titleStyle}
      >
        {title}
      </h2>

      <div
        ref={containerRef}
        className={`mt-10 flex justify-center overflow-visible px-3 pt-3 pb-10 ${containerClassName ?? ""}`}
      >
        <p
          ref={textRef}
          className={`total-screens-value m-0 inline-block select-none whitespace-nowrap bg-clip-text text-center text-transparent ${valueClassName ?? ""}`}
          style={{
            backgroundImage: TEXT_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily:
              '"Urbane", "Arial Black", "Helvetica Neue", Arial, sans-serif',
            fontSize: `${fontSize}px`,
            fontWeight: 900,
            fontStyle: "normal",
            letterSpacing: "-0.055em",
            lineHeight: 1,
            paddingTop: "0.08em",
            paddingRight: "0.06em",
            paddingBottom: "0.1em",
            paddingLeft: "0.08em",
            ...valueStyle,
          }}
          aria-label={`${title} ${formattedValue}`}
        >
          {formattedValue}
        </p>
      </div>
    </section>
  );
}
