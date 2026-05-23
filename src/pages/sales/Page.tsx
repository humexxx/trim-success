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
import { PageContent, PageHeader, PageWrapper } from "src/components/layout";
import { useCube } from "src/context/hooks";
import { ROUTES } from "src/lib/consts";
import { useDocumentMetadata } from "src/hooks";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MetricBarChart } from "../inventory/inventory-performance/components/MetricBarChart";

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const compactCurrencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const percentFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

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
                    className={trend.positive ? "h-3 w-3" : "h-3 w-3 rotate-180"}
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
  useDocumentMetadata("Ventas - ScorChain");
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
    return (
      <PageWrapper title="Ventas">
        <PageHeader title="Ventas" />
        <Alert>
          <AlertDescription>Cargando datos del cubo...</AlertDescription>
        </Alert>
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
        <PageContent>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Aún no hay datos de ventas</h2>
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
        </PageContent>
      </PageWrapper>
    );
  }

  // Chart dataset: sales per category + a Total row at the end (consistent
  // with the existing MetricBarChart pattern used in inventory).
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
        title="Ventas"
        description="Resumen del comportamiento comercial por categoría"
      />
      <PageContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Ventas totales"
            value={compactCurrencyFmt.format(summary.totalSales)}
            hint={`${summary.byCategory.length} categorías`}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <KpiCard
            label="Margen bruto"
            value={compactCurrencyFmt.format(summary.totalGrossMargin)}
            hint={`${percentFmt.format(summary.grossMarginPct)} del total`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            label="Costo de ventas"
            value={compactCurrencyFmt.format(summary.totalCost)}
            hint={`${percentFmt.format(
              summary.totalSales > 0
                ? summary.totalCost / summary.totalSales
                : 0
            )} del total`}
            icon={<Percent className="h-4 w-4" />}
          />
          <KpiCard
            label="SKUs activos"
            value={summary.totalSkus.toLocaleString("en-US")}
            hint={`Promedio ${currencyFmt.format(summary.avgPerSku)} / SKU`}
            icon={<Package className="h-4 w-4" />}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-base font-semibold">Ventas por categoría</h3>
                <span className="text-xs text-muted-foreground">USD</span>
              </div>
              <MetricBarChart
                dataset={chartDataset}
                label="Ventas"
                color="#0f172a"
                formatValue={(v) => compactCurrencyFmt.format(v)}
                isExpanded={false}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-base font-semibold">Top categorías</h3>
                <span className="text-xs text-muted-foreground">
                  por ventas
                </span>
              </div>
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
                    const marginPct = c.sales > 0 ? c.grossMargin / c.sales : 0;
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
      </PageContent>
    </PageWrapper>
  );
};

export default SalesMainPage;
