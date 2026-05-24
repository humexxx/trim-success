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

const CATEGORIES = [
  "Categoría 1",
  "Categoría 2",
  "Categoría 3",
  "Categoría 4",
  "Categoría 5",
];

const SLIDE_MS = 5500;
const CHART_ANIM_MS = 700;
// How many times to re-randomize the chart's data WITHIN a single
// slide cycle (in addition to the initial value on entry). Refreshes
// are spaced evenly between slide-in and slide-out, so the user sees
// the chart morph N+1 times before the next slide takes over.
const MID_SLIDE_REFRESHES = 3;

const rand = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

// Lighter five-stop monochrome ramp — soft mid-grays so the chart
// recedes behind the form rather than dominating the screen.
const palette = [
  "hsl(0 0% 42%)",
  "hsl(0 0% 55%)",
  "hsl(0 0% 67%)",
  "hsl(0 0% 78%)",
  "hsl(0 0% 86%)",
];

type SlideKey = "area" | "bar" | "radial" | "donut" | "radar";

const SLIDES: {
  key: SlideKey;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    key: "area",
    title: "Tendencia mensual",
    subtitle: "Ventas estimadas por categoría",
    description:
      "Curva mensual de ventas por categoría para identificar estacionalidad y picos.",
  },
  {
    key: "bar",
    title: "Ventas por categoría",
    subtitle: "Comparativa del periodo activo",
    description:
      "Total de ventas de cada categoría en el rango — ideal para detectar líderes y rezagados.",
  },
  {
    key: "radial",
    title: "Indicadores clave",
    subtitle: "Cumplimiento por driver",
    description:
      "Cumplimiento de los drivers críticos del negocio sobre el objetivo definido.",
  },
  {
    key: "donut",
    title: "Portafolio",
    subtitle: "Participación por categoría",
    description:
      "Peso relativo de cada categoría sobre el total para entender la concentración del portafolio.",
  },
  {
    key: "radar",
    title: "Perfil de inventario",
    subtitle: "Forma del portafolio actual",
    description:
      "Forma multidimensional del portafolio: ventas, margen, costo, SKUs y rotación normalizados.",
  },
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
  // `seed` bumps both on slide change AND mid-slide so recharts gets a
  // second data refresh inside each cycle — the user sees the chart
  // animate from value A → value B without the slide type changing.
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

  // Mid-slide data refreshes: schedule MID_SLIDE_REFRESHES seed bumps
  // evenly between slide-in and slide-out. Each bump leaves `index`
  // untouched so the wrapper key doesn't change — recharts keeps the
  // instance and animates from the current values to the new ones.
  useEffect(() => {
    const step = SLIDE_MS / (MID_SLIDE_REFRESHES + 1);
    const timers = Array.from({ length: MID_SLIDE_REFRESHES }, (_, i) =>
      setTimeout(() => setSeed((s) => s + 1), step * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [index]);

  const current = SLIDES[index]!;

  return (
    <div className="relative flex h-full w-full flex-col bg-muted/40 p-8 lg:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-foreground/[0.06]"
      />
      <div
        className={cn(
          "relative z-10 transition-all duration-500 ease-out",
          entered ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
        )}
      >
        <h2 className="text-lg font-semibold tracking-tight">
          {current.title}
        </h2>
        <p className="text-sm text-muted-foreground">{current.subtitle}</p>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5">
        <div
          className={cn(
            "aspect-[5/4] w-full max-w-[360px] transition-all duration-500 ease-out",
            entered ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
          )}
        >
          {/* Key only on slide type — remounts on rotation (recharts
              plays its from-0 entry) but stays put when `seed` changes
              mid-slide, so the data refresh interpolates instead. */}
          <div key={current.key} className="h-full w-full">
            {renderSlide(current.key, seed)}
          </div>
        </div>
        <p
          className={cn(
            "max-w-[420px] text-balance text-center text-xs leading-relaxed text-muted-foreground transition-all duration-500 ease-out",
            entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          {current.description}
        </p>
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
