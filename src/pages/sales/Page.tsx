import { useMemo } from "react";

import { EDriverType } from "@shared/enums";
import {
  ArrowUpRight,
  DollarSign,
  Package,
  Percent,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { useDocumentMetadata } from "src/hooks";
import { ROUTES } from "src/lib/consts";
import {
  compactCurrencyFmt,
  currencyFmt,
  percentFmt,
} from "src/lib/formatters";

import { MonthlyTrendChart, PortfolioRadar } from "./components";
import { MetricBarChart } from "../inventory/inventory-performance/components/MetricBarChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";



interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

function KpiCard({ label, value, hint, icon, trend }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
            {icon}
          </span>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-semibold tabular-nums tracking-tight">
            {value}
          </div>
          {(hint || trend) && (
            <div className="flex items-center gap-2 text-xs">
              {trend && (
                <Badge
                  variant={trend.positive ? "default" : "destructive"}
                  className="gap-0.5 font-medium"
                >
                  <ArrowUpRight
                    className={cn("h-3 w-3", !trend.positive && "rotate-180")}
                  />
                  {trend.value}
                </Badge>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const SalesMainPage = () => {
  useDocumentMetadata(
    "Ventas",
    "Resumen de ventas, margen y comportamiento por categoría sobre el cubo activo."
  );
  const cube = useCube();

  const summary = useMemo(() => {
    if (!cube.data?.baseData?.categoriesData) return null;
    const { rows, totals } = cube.data.baseData.categoriesData;
    const totalSales = Number(totals[EDriverType.SALES] ?? 0);
    const totalCost = Number(totals[EDriverType.COST_SALES] ?? 0);
    const totalGrossMargin = Number(totals[EDriverType.GROSS_MARGIN] ?? 0);
    const totalSkus = Number(totals[EDriverType.SKUS] ?? 0);
    const grossMarginPct = totalSales > 0 ? totalGrossMargin / totalSales : 0;
    const avgPerSku = totalSkus > 0 ? totalSales / totalSkus : 0;

    const byCategory = [...rows]
      .map((r) => ({
        category: r.category,
        sales: Number(r[EDriverType.SALES] ?? 0),
        cost: Number(r[EDriverType.COST_SALES] ?? 0),
        grossMargin: Number(r[EDriverType.GROSS_MARGIN] ?? 0),
        skus: Number(r[EDriverType.SKUS] ?? 0),
      }))
      .sort((a, b) => b.sales - a.sales);

    return {
      totalSales,
      totalCost,
      totalGrossMargin,
      totalSkus,
      grossMarginPct,
      avgPerSku,
      byCategory,
    };
  }, [cube.data]);

  if (cube.isCubeLoading) {
    // Skeleton mirrors the real layout: KPI strip + two equal chart
    // cards, so the page doesn't jump when data arrives.
    return (
      <PageWrapper title="Ventas">
        <PageHeader
          title="Resumen de ventas"
          description="Comportamiento comercial por categoría — KPIs, tendencia mensual y portafolio."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-56" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </PageWrapper>
    );
  }

  if (!summary || summary.totalSales === 0) {
    return (
      <PageWrapper title="Ventas">
        <PageHeader
          title="Ventas"
          description="Resumen del comportamiento comercial por categoría"
        />
        <Card className="mt-8 border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                Aún no hay datos de ventas
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                El módulo de ventas usa la misma fuente de datos que
                inventario. Sube un archivo Excel desde el importador para
                desbloquear el resumen.
              </p>
            </div>
            <Link to={ROUTES.INVENTORY.IMPORT}>
              <Button>Ir al importador</Button>
            </Link>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const chartDataset = [
    ...summary.byCategory.map((c) => ({
      category: c.category,
      value: c.sales,
    })),
    { category: "Total", value: summary.totalSales },
  ];

  return (
    <PageWrapper title="Ventas">
      <PageHeader
        title="Resumen de ventas"
        description="Comportamiento comercial por categoría — KPIs, tendencia mensual y portafolio."
      />

      <section
        aria-label="Indicadores clave"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <KpiCard
          label="Ventas totales"
          value={compactCurrencyFmt.format(summary.totalSales)}
          hint={`${summary.byCategory.length} categorías`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KpiCard
          label="Margen bruto"
          value={compactCurrencyFmt.format(summary.totalGrossMargin)}
          hint="del total"
          trend={{
            value: percentFmt.format(summary.grossMarginPct),
            positive: true,
          }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiCard
          label="Costo de ventas"
          value={compactCurrencyFmt.format(summary.totalCost)}
          hint="del total"
          trend={{
            value: percentFmt.format(
              summary.totalSales > 0
                ? summary.totalCost / summary.totalSales
                : 0
            ),
            positive: false,
          }}
          icon={<Percent className="h-4 w-4" />}
        />
        <KpiCard
          label="SKUs activos"
          value={summary.totalSkus.toLocaleString("en-US")}
          hint={`Promedio ${currencyFmt.format(summary.avgPerSku)} / SKU`}
          icon={<Package className="h-4 w-4" />}
        />
      </section>

      {/* Two-tab split: the trend/portfolio pair lives in tab 1, the
          ranking pair in tab 2. Inside each tab the two cards share the
          same grid column so they always read as a matched pair. */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Tendencia y portafolio</TabsTrigger>
          <TabsTrigger value="ranking">Ventas y ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MonthlyTrendChart byCategory={summary.byCategory} />
            <PortfolioRadar byCategory={summary.byCategory} />
          </div>
        </TabsContent>

        <TabsContent value="ranking" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">
                  Ventas por categoría
                </CardTitle>
                <CardDescription className="text-xs">
                  Ventas totales del año actual por categoría, ordenadas de
                  mayor a menor.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-4 pt-0">
                <MetricBarChart
                  dataset={chartDataset}
                  label="Ventas"
                  chartColor={1}
                  formatValue={(v) => compactCurrencyFmt.format(v)}
                  isExpanded={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">Top categorías</CardTitle>
                <CardDescription className="text-xs">
                  Ranking por ventas con margen porcentual.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-4 pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Ventas</TableHead>
                      <TableHead className="text-right">Margen %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.byCategory.map((c) => {
                      const marginPct =
                        c.sales > 0 ? c.grossMargin / c.sales : 0;
                      return (
                        <TableRow key={c.category}>
                          <TableCell className="font-medium">
                            {c.category}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {compactCurrencyFmt.format(c.sales)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {percentFmt.format(marginPct)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default SalesMainPage;
