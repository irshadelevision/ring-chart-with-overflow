# Reporting Template

An Apple Health-style ring chart reporting UI built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. The ring chart is rendered entirely with hand-written SVG — no charting library required at runtime.

## Tech Stack

| Layer     | Technology                    | Version            |
| --------- | ----------------------------- | ------------------ |
| Framework | Next.js (App Router)          | 16.1.6             |
| UI        | React                         | 19.2.3             |
| Language  | TypeScript                    | ^5                 |
| Styling   | Tailwind CSS + PostCSS        | ^4                 |
| Fonts     | Geist Sans & Geist Mono       | next/font/google   |
| Linting   | ESLint 9 + eslint-config-next | 16.1.6             |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to see the ring chart demo.

## Project Structure

```
src/
├── app/
│   ├── globals.css           # Tailwind import + CSS custom-property theming
│   ├── layout.tsx            # Root layout (Geist font, metadata)
│   └── page.tsx              # Home page — single ring chart demo
└── components/
    └── ring-chart.tsx        # Apple Health-style ring chart (pure SVG)
```

## Ring Chart Component

### Overview

`RingChart` is a reusable, client-side component that renders concentric activity rings using pure SVG. It supports solid colours, multi-stop angular gradients, and overflow beyond 100%.

### Usage

```tsx
import { RingChart } from "@/components/ring-chart";
import type { RingDatum } from "@/components/ring-chart";

const data: RingDatum[] = [
  {
    label: "Move",
    value: 124,
    target: 100,
    color: ["#00F2F2", "#047EBE", "#08088A"],
    unit: "%",
  },
];

<RingChart data={data} size={260} ringWidth={44} gap={7} />
```

### Props

| Prop                | Type          | Default | Description                                       |
| ------------------- | ------------- | ------- | ------------------------------------------------- |
| `data`              | `RingDatum[]` | —       | Ring data array; first item is the outermost ring |
| `size`              | `number`      | `240`   | Chart diameter in px                              |
| `ringWidth`         | `number`      | `20`    | Thickness of each ring                            |
| `gap`               | `number`      | `6`     | Spacing between rings                             |
| `showLegend`        | `boolean`     | `true`  | _(declared but not yet rendered)_                 |
| `animationDuration` | `number`      | `1200`  | Animation duration in ms                          |
| `className`         | `string`      | —       | Additional wrapper CSS classes                    |

### `RingDatum`

```ts
interface RingDatum {
  label: string;       // e.g. "Move"
  value: number;       // current value
  target: number;      // goal value (100% when value === target)
  color:
    | string                         // solid colour
    | [string, string]               // 2-stop gradient
    | [string, string, string];      // 3-stop gradient
  unit?: string;       // e.g. "CAL", "%"
}
```

### How It Works

Each ring is rendered as three SVG layers:

1. **Track** — a full grey `<circle>` (`#D1D5DB`) behind the active arc.
2. **Active arc** — for gradients, the arc is split into ~180 small `<path>` segments with linearly interpolated stroke colours; for solid colours, a single `<circle>` with `stroke-dasharray` is used.
3. **Overflow shadow** — when `value / target > 1`, a transparent stroke with a CSS `drop-shadow` filter is drawn on top to create depth at the overlap.

A centered label shows the primary ring's percentage and "Percentage of Target".

### Colour Modes

| `color` value                                 | Rendering                                               |
| --------------------------------------------- | ------------------------------------------------------- |
| Plain string (`"#FA114F"`)                    | Single `<circle>` with `stroke-dasharray` animation     |
| 2-tuple (`["#00F2F2", "#047EBE"]`)            | Segmented `<path>` arc with linear colour interpolation |
| 3-tuple (`["#00F2F2", "#047EBE", "#08088A"]`) | Interpolates through three colour stops                 |

### Overflow Behaviour

| Condition             | Visual                                                   |
| --------------------- | -------------------------------------------------------- |
| `value / target ≤ 1`  | Normal arc from 12 o'clock clockwise                     |
| `value / target > 1`  | Full ring + overflow arc with drop-shadow                |
| `value / target > 4`  | Clamped at 400% (4 full revolutions)                     |

## Styling

- **Tailwind CSS 4** with `@import "tailwindcss"` syntax and `@theme inline` for custom properties.
- **Dark mode** via `prefers-color-scheme` media query — CSS variables switch between light and dark palettes automatically.
- **Fonts**: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`) loaded via `next/font/google`.

## Conventions

- Client components use `"use client"` directive.
- Path alias `@/*` maps to `./src/*`.
- ESLint flat config with `core-web-vitals` and `typescript` presets.

## License

This project is provided **"as is"**, without warranty of any kind, express or implied. The author is not responsible for any damages or liability arising from the use of this software. You are free to use, copy, modify, and distribute this project for any purpose.

## Author

**Irshad**
