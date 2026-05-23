import { useMemo, useState } from "react";

import { EDriverType } from "@shared/enums";
import { EInventoryPerformaceMetricType } from "@shared/enums/EInventoryPerformaceMetricType";
import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  DollarSign,
  Layers,
  Package,
  Percent,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";

import { compactCurrencyFmt, percentFmt } from "src/lib/formatters";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { GraphContainer } from "./components";
import {
  ICCGraph,
  ICCvsSalesGraph,
  ICRGraph,
  InventoryValueAddedGraph,
  InventoryValueOverSalesGraph,
} from "../inventory-performance/components";

// Re-alias the shared formatter so existing local callsites
// (`compactCurrency.format(...)`) keep working without churn.
const compactCurrency = compactCurrencyFmt;

interface KpiTileProps {
  label: string;
  value: string;
  hint?: string;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
  accent?: string;
}

function KpiTile({ label, value, hint, trend, icon, accent }: KpiTileProps) {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border text-foreground",
              accent ?? "bg-muted/40"
            )}
          >
            {icon}
          </span>
        </div>
        <div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight">
            {value}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            {trend && (
              <Badge
                variant={trend.positive ? "default" : "destructive"}
                className="gap-0.5 px-1.5 font-medium"
              >
                {trend.positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {trend.value}
              </Badge>
            )}
            {hint && <span className="text-muted-foreground">{hint}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Page = () => {
  const cube = useCube();
  const [expandedGraph, setExpandedGraph] = useState("");

  const kpis = useMemo(() => {
    if (!cube.data) return null;
    const t = cube.data.baseData.categoriesData.totals;
    const totalSales = Number(t[EDriverType.SALES] ?? 0);
    const totalGrossMargin = Number(t[EDriverType.GROSS_MARGIN] ?? 0);
    const totalSkus = Number(t[EDriverType.SKUS] ?? 0);
    const totalIcc =
      Number(cube.data.scorecardData.inventoryCosts.totals.total ?? 0) +
      Number(cube.data.scorecardData.storingCosts.totals.total ?? 0);
    return {
      totalSales,
      totalGrossMargin,
      totalSkus,
      totalIcc,
      grossMarginPct: totalSales ? totalGrossMargin / totalSales : 0,
      iccPct: totalSales ? totalIcc / totalSales : 0,
      categoryCount: cube.data.cubeParameters.categories.length,
    };
  }, [cube.data]);

  const graphs = useMemo(() => {
    if (!cube.data) return [];
    return [
      {
        key: EInventoryPerformaceMetricType.ICR_PERCENTAGE,
        title: "Inventory Carry Rate",
        description:
          "% costo de mantener inventario sobre el valor del inventario.",
        component: (
          <ICRGraph
            isExpanded={
              expandedGraph === EInventoryPerformaceMetricType.ICR_PERCENTAGE
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) => x.key === EInventoryPerformaceMetricType.ICR_PERCENTAGE
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: "icc",
        title: "Inventory Carry Cost",
        description: "Storing + Inventory costs por categoría.",
        component: (
          <ICCGraph
            isExpanded={expandedGraph === "icc"}
            scorecard={cube.data.scorecardData}
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: EInventoryPerformaceMetricType.ICC_OVER_SALES,
        title: "ICC vs. Ventas",
        description: "Qué porción de cada venta absorbe el costo de inventario.",
        component: (
          <ICCvsSalesGraph
            isExpanded={
              expandedGraph === EInventoryPerformaceMetricType.ICC_OVER_SALES
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) => x.key === EInventoryPerformaceMetricType.ICC_OVER_SALES
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES,
        title: "Valor de inventario vs. Ventas",
        description:
          "Relación entre el valor del inventario y las ventas mensuales.",
        component: (
          <InventoryValueOverSalesGraph
            isExpanded={
              expandedGraph ===
              EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) =>
                  x.key ===
                  EInventoryPerformaceMetricType.INVENTORY_VALUE_OVER_AVG_SALES
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
      {
        key: EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED,
        title: "Inventory Value Added (IVA)",
        description: "Gross margin menos el costo total de mantener inventario.",
        component: (
          <InventoryValueAddedGraph
            isExpanded={
              expandedGraph ===
              EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED
            }
            data={
              cube.data.inventoryPerformanceData.rows.find(
                (x) =>
                  x.key === EInventoryPerformaceMetricType.INVENTORY_VALUE_ADDED
              )!
            }
            categories={cube.data.cubeParameters.categories}
          />
        ),
      },
    ].sort((a, b) => {
      if (expandedGraph === a.key) return -1;
      if (expandedGraph === b.key) return 1;
      return 0;
    });
  }, [cube.data, expandedGraph]);

  if (cube.isCubeLoading || !cube.data || !kpis) return null;

  return (
    <PageWrapper
      title="Panel"
      description="Visión general del cubo: scorecard, drivers, rendimiento por categoría y series temporales."
    >
      <PageHeader
        title="Panel"
        description="Vista general del comportamiento del inventario y su impacto en el negocio."
      />

      {/* Header chips: shortcuts to related sections. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link to={ROUTES.INVENTORY.IMPORT}>
          <Badge variant="outline" className="cursor-pointer gap-1">
            <Layers className="h-3 w-3" />
            Archivos importados
          </Badge>
        </Link>
        <Link to={ROUTES.INVENTORY.DATA_MINING}>
          <Badge variant="outline" className="cursor-pointer gap-1">
            <Boxes className="h-3 w-3" />
            Data Mining
          </Badge>
        </Link>
      </div>

      {/* KPI strip — the "wow" moment with the biggest, most readable numbers
          on the page. Everything else supports these four. */}
      <section
        aria-label="Indicadores clave"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <KpiTile
          label="Ventas totales"
          value={compactCurrency.format(kpis.totalSales)}
          hint={`${kpis.categoryCount} categorías · ${kpis.totalSkus.toLocaleString("en-US")} SKUs`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KpiTile
          label="Margen bruto"
          value={compactCurrency.format(kpis.totalGrossMargin)}
          hint="del total de ventas"
          trend={{ value: percentFmt.format(kpis.grossMarginPct), positive: true }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiTile
          label="Costo de inventario (ICC)"
          value={compactCurrency.format(kpis.totalIcc)}
          hint="del total de ventas"
          trend={{
            value: percentFmt.format(kpis.iccPct),
            positive: false,
          }}
          icon={<Percent className="h-4 w-4" />}
        />
        <KpiTile
          label="Categorías"
          value={String(kpis.categoryCount)}
          hint={`${kpis.totalSkus.toLocaleString("en-US")} SKUs activos`}
          icon={<Package className="h-4 w-4" />}
        />
      </section>

      {/* Chart grid — 5 metric breakdowns, click to expand. */}
      <section className="mt-8">
        <header className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold tracking-tight">
            Indicadores de desempeño
          </h2>
          <span className="text-xs text-muted-foreground">
            Click en{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">↗</code>{" "}
            para expandir un gráfico
          </span>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {graphs.map((g) => (
            <GraphContainer
              key={g.key}
              title={g.title}
              description={g.description}
              isExpanded={expandedGraph === g.key}
              setIsExpanded={() =>
                setExpandedGraph(expandedGraph === g.key ? "" : g.key)
              }
            >
              {g.component}
            </GraphContainer>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
};

export default Page;
