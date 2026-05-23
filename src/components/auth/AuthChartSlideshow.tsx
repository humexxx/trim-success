import { useEffect, useMemo, useState } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const CATEGORIES = ["Ropa", "Tejido", "Producto", "Estampado", "Punto"];

const SLIDE_MS = 30000;
const CHART_ANIM_MS = 900;

const rand = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

// Theme-aware grayscale palette derived from --foreground. Five tints
// give every chart series a distinct contrast level in both light and
// dark mode without bringing in hue.
const palette = [
  "hsl(var(--foreground) / 0.92)",
  "hsl(var(--foreground) / 0.72)",
  "hsl(var(--foreground) / 0.52)",
  "hsl(var(--foreground) / 0.34)",
  "hsl(var(--foreground) / 0.2)",
];

type SlideKey = "area" | "bar" | "radial" | "donut" | "radar";

const SLIDES: { key: SlideKey; title: string; subtitle: string }[] = [
  { key: "area", title: "Tendencia mensual", subtitle: "Ventas estimadas por categoría" },
  { key: "bar", title: "Ventas por categoría", subtitle: "Comparativa del periodo activo" },
  { key: "radial", title: "Indicadores clave", subtitle: "Cumplimiento por driver" },
  { key: "donut", title: "Portafolio", subtitle: "Participación por categoría" },
  { key: "radar", title: "Perfil de inventario", subtitle: "Forma del portafolio actual" },
];

function useAreaData(seed: number) {
  return useMemo(() => {
    void seed;
    const cats = CATEGORIES.slice(0, 3);
    const base = cats.map(() => rand(35, 95));
    return MONTHS.map((m, i) => {
      const wave = 0.6 + 0.4 * Math.sin((i / MONTHS.length) * Math.PI * 1.4);
      const row: Record<string, number | string> = { month: m };
      cats.forEach((c, ci) => {
        row[c] = Math.round(base[ci]! * wave * (0.85 + Math.random() * 0.4));
      });
      return row;
    });
  }, [seed]);
}

function useBarData(seed: number) {
  return useMemo(() => {
    void seed;
    return CATEGORIES.map((c) => ({
      category: c,
      value: rand(28, 120),
    }));
  }, [seed]);
}

function useRadialData(seed: number) {
  return useMemo(() => {
    void seed;
    return [
      { name: "Rotación", value: rand(55, 95), fill: palette[0] },
      { name: "Margen", value: rand(40, 90), fill: palette[1] },
      { name: "Cobertura", value: rand(45, 92), fill: palette[2] },
      { name: "Servicio", value: rand(60, 98), fill: palette[3] },
    ];
  }, [seed]);
}

function useDonutData(seed: number) {
  return useMemo(() => {
    void seed;
    return CATEGORIES.slice(0, 4).map((c, i) => ({
      category: c,
      value: rand(15, 90),
      fill: palette[i % palette.length],
    }));
  }, [seed]);
}

function useRadarData(seed: number) {
  return useMemo(() => {
    void seed;
    const axes = ["Ventas", "Margen", "Costo", "SKUs", "Rotación"];
    return axes.map((axis) => ({
      axis,
      value: rand(35, 95),
    }));
  }, [seed]);
}

function AreaSlide({ seed }: { seed: number }) {
  const data = useAreaData(seed);
  const cats = CATEGORIES.slice(0, 3);
  const config: ChartConfig = cats.reduce<ChartConfig>((acc, c, i) => {
    acc[c] = { label: c, color: palette[i] };
    return acc;
  }, {});
  return (
    <ChartContainer config={config} className="!aspect-auto h-full w-full">
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        {cats.map((c, i) => (
          <Area
            key={c}
            dataKey={c}
            type="natural"
            stroke={palette[i]}
            strokeWidth={2.5}
            fill={palette[i]}
            fillOpacity={0.7}
            stackId="stack"
            isAnimationActive
            animationDuration={CHART_ANIM_MS}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

function BarSlide({ seed }: { seed: number }) {
  const data = useBarData(seed);
  const config: ChartConfig = data.reduce<ChartConfig>((acc, d, i) => {
    acc[d.category] = { label: d.category, color: palette[i % palette.length] };
    return acc;
  }, {});
  return (
    <ChartContainer config={config} className="!aspect-auto h-full w-full">
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="category" tickLine={false} axisLine={false} fontSize={11} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          isAnimationActive
          animationDuration={CHART_ANIM_MS}
          fill={palette[0]}
        >
          {data.map((d, i) => (
            <Cell key={d.category} fill={palette[i % palette.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function RadialSlide({ seed }: { seed: number }) {
  const data = useRadialData(seed);
  const config: ChartConfig = data.reduce<ChartConfig>((acc, d) => {
    acc[d.name] = { label: d.name, color: d.fill };
    return acc;
  }, {});
  return (
    <ChartContainer config={config} className="!aspect-auto h-full w-full">
      <RadialBarChart
        data={data}
        innerRadius="35%"
        outerRadius="100%"
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          dataKey="value"
          background={{ fill: "hsl(var(--muted))" }}
          cornerRadius={8}
          isAnimationActive
          animationDuration={CHART_ANIM_MS}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </RadialBarChart>
    </ChartContainer>
  );
}

function DonutSlide({ seed }: { seed: number }) {
  const data = useDonutData(seed);
  const config: ChartConfig = data.reduce<ChartConfig>((acc, d) => {
    acc[d.category] = { label: d.category, color: d.fill };
    return acc;
  }, {});
  return (
    <ChartContainer config={config} className="!aspect-auto h-full w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
          isAnimationActive
          animationDuration={CHART_ANIM_MS}
        >
          {data.map((d) => (
            <Cell key={d.category} fill={d.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

function RadarSlide({ seed }: { seed: number }) {
  const data = useRadarData(seed);
  const config: ChartConfig = {
    value: { label: "Portafolio", color: palette[0] },
  };
  return (
    <ChartContainer config={config} className="!aspect-auto h-full w-full">
      <RadarChart data={data} margin={{ top: 12, right: 16, bottom: 12, left: 16 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="axis" fontSize={11} />
        <Radar
          dataKey="value"
          stroke={palette[0]}
          strokeWidth={2}
          fill={palette[1]}
          fillOpacity={0.55}
          isAnimationActive
          animationDuration={CHART_ANIM_MS}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </RadarChart>
    </ChartContainer>
  );
}

function renderSlide(key: SlideKey, seed: number) {
  switch (key) {
    case "area":
      return <AreaSlide seed={seed} />;
    case "bar":
      return <BarSlide seed={seed} />;
    case "radial":
      return <RadialSlide seed={seed} />;
    case "donut":
      return <DonutSlide seed={seed} />;
    case "radar":
      return <RadarSlide seed={seed} />;
  }
}

const EXIT_MS = 450;

export function AuthChartSlideshow() {
  const [index, setIndex] = useState(0);
  const [seed, setSeed] = useState(0);
  // Two-phase rotation: first `entered` flips to false so the chart
  // fades + slides out; after EXIT_MS we swap to the next slide and
  // flip `entered` back to true to animate the new chart in. CSS
  // transitions get the full duration, so the swap is perceivable.
  const [entered, setEntered] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => {
      setEntered(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % SLIDES.length);
        setSeed((s) => s + 1);
        setEntered(true);
      }, EXIT_MS);
      return () => clearTimeout(swap);
    }, SLIDE_MS);
    return () => clearInterval(tick);
  }, []);

  const current = SLIDES[index]!;

  return (
    <div className="relative flex h-full w-full flex-col bg-muted/40 p-8 lg:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-foreground/[0.06]"
      />
      <div className="relative z-10 flex items-baseline justify-between gap-4">
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            entered
              ? "translate-x-0 opacity-100"
              : "-translate-x-3 opacity-0"
          )}
        >
          <h2 className="text-lg font-semibold tracking-tight">
            {current.title}
          </h2>
          <p className="text-sm text-muted-foreground">{current.subtitle}</p>
        </div>
        <span className="rounded-full border bg-background/60 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
          Demo
        </span>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div
          className={cn(
            "aspect-[5/4] w-full max-w-[460px] transition-all duration-500 ease-out",
            entered
              ? "translate-x-0 opacity-100"
              : "translate-x-6 opacity-0"
          )}
        >
          {/* Keying the chart by slide+seed remounts it so recharts
              replays its from-0 entry animation on every rotation. */}
          <div key={`${current.key}-${seed}`} className="h-full w-full">
            {renderSlide(current.key, seed)}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-1.5">
        {SLIDES.map((s, i) => (
          <span
            key={s.key}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-foreground" : "w-3 bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
