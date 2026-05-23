import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDashed,
  Loader2,
  Package,
  ShoppingCart,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "src/components/layout";
import { useAuth } from "src/context/hooks";
import { useCubeSummary, useDocumentMetadata } from "src/hooks";
import { ROUTES } from "src/lib/consts";
import { compactCurrencyFmt, percentFmt } from "src/lib/formatters";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  metrics: { label: string; value: string | number; hint?: string }[];
  status: "ready" | "empty" | "loading" | "comingSoon";
  cta: string;
  disabled?: boolean;
  /** Render a small "Beta" chip next to the title. */
  beta?: boolean;
}

function ModuleCard({
  icon,
  title,
  description,
  to,
  metrics,
  status,
  cta,
  disabled,
  beta,
}: ModuleCardProps) {
  const statusMeta: Record<
    ModuleCardProps["status"],
    { label: string; tone: string; Icon: React.ComponentType<{ className?: string }> }
  > = {
    ready: { label: "Datos cargados", tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", Icon: CheckCircle2 },
    empty: { label: "Sin datos", tone: "bg-muted text-muted-foreground", Icon: CircleDashed },
    loading: { label: "Cargando", tone: "bg-muted text-muted-foreground", Icon: Loader2 },
    comingSoon: { label: "Próximamente", tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400", Icon: CircleDashed },
  };
  const s = statusMeta[status];

  const inner = (
    <Card
      className={cn(
        "group relative h-full overflow-hidden transition-all",
        !disabled && "hover:border-foreground/40 hover:shadow-md",
        disabled && "opacity-60"
      )}
    >
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted/40 text-foreground">
            {icon}
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              s.tone
            )}
          >
            <s.Icon
              className={cn(
                "h-3 w-3",
                status === "loading" && "animate-spin"
              )}
            />
            {s.label}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            {beta && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
                Beta
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 border-t pt-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {m.label}
              </dt>
              <dd className="mt-0.5 text-base font-semibold tabular-nums">
                {m.value}
              </dd>
              {m.hint && (
                <dd className="text-[11px] text-muted-foreground">{m.hint}</dd>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-medium">
            {cta}
          </span>
          <ArrowRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              !disabled && "group-hover:translate-x-1 group-hover:text-foreground"
            )}
          />
        </div>
      </CardContent>
    </Card>
  );

  if (disabled) return inner;
  return (
    <Link to={to} className="block h-full">
      {inner}
    </Link>
  );
}

// Local alias for the legacy `compactCurrency` name used in this file.
const compactCurrency = compactCurrencyFmt;

const ModuleSelector = () => {
  const { currentUser } = useAuth();
  const probe = useCubeSummary();

  useDocumentMetadata(
    "Inicio",
    "Elige el módulo en el que vas a trabajar. Tus datos se mantienen sincronizados entre Inventario y Ventas."
  );

  const displayName =
    currentUser?.displayName?.split(" ")[0] ??
    currentUser?.email?.split("@")[0] ??
    "";

  const inventoryStatus: ModuleCardProps["status"] = probe.loading
    ? "loading"
    : probe.hasData
      ? "ready"
      : "empty";

  // Helper: a metric value that gracefully degrades while loading or
  // when the cube hasn't been seeded yet. Keeps the JSX below readable.
  const pending = "—";

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <div className="mt-4 flex flex-col gap-8">
        <PageHeader
          title={displayName ? `Hola, ${displayName}` : "Seleccionar Módulo"}
          description="Elige el módulo en el que vas a trabajar. Tus datos se mantienen sincronizados entre ambos."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ModuleCard
            icon={<Package className="h-5 w-5" />}
            title="Inventario"
            description="Análisis de costos de mantener inventario, scorecard, drivers y rendimiento por categoría."
            to={
              probe.hasData
                ? ROUTES.INVENTORY.DASHBOARD
                : ROUTES.INVENTORY.IMPORT
            }
            status={inventoryStatus}
            cta={probe.hasData ? "Ver panel" : "Importar datos"}
            metrics={[
              {
                label: "Categorías",
                value: probe.summary
                  ? probe.summary.categoryCount
                  : pending,
                hint: probe.summary
                  ? "agrupando el catálogo"
                  : "Pendiente de importar",
              },
              {
                label: "SKUs activos",
                value: probe.summary
                  ? probe.summary.totalSkus.toLocaleString("en-US")
                  : pending,
                hint: probe.summary
                  ? "en el cubo actual"
                  : "Sube tu primer XLSX",
              },
            ]}
          />

          <ModuleCard
            icon={<ShoppingCart className="h-5 w-5" />}
            title="Ventas"
            description="Resumen de ventas, margen y comportamiento por categoría. Comparte fuente de datos con Inventario."
            to={ROUTES.SALES}
            status={probe.hasData ? "ready" : "empty"}
            cta={probe.hasData ? "Ver resumen" : "Sube datos primero"}
            beta
            metrics={[
              {
                label: "Ventas",
                value: probe.summary
                  ? compactCurrency.format(probe.summary.totalSales)
                  : pending,
                hint: probe.summary
                  ? "del periodo cargado"
                  : "Sin datos",
              },
              {
                label: "Margen",
                value: probe.summary
                  ? percentFmt.format(probe.summary.grossMarginPct)
                  : pending,
                hint: probe.summary
                  ? compactCurrency.format(probe.summary.totalGrossMargin)
                  : "—",
              },
            ]}
            disabled={!probe.hasData}
          />
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <BarChart3 className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="space-y-1 text-sm">
              <p className="font-medium">¿Listo para arrancar?</p>
              <p className="text-muted-foreground">
                Sube un Excel con el modelo de datos esperado para desbloquear
                ambos módulos.{" "}
                <Link
                  to={ROUTES.INVENTORY.IMPORT}
                  className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Ir al importador <Upload className="h-3 w-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleSelector;
