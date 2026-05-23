import {
  ArrowRight,
  BarChart3,
  Boxes,
  Database,
  LineChart,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentMetadata } from "src/hooks";
import { APP_NAME, APP_TAGLINE, ROUTES } from "src/lib/consts";

import Footer from "./public/_components/Footer";
import { Button } from "@/components/ui/button";


const NAV_LINKS = [
  { label: "Producto", href: "#producto" },
  { label: "Soluciones", href: "#soluciones" },
  { label: "Recursos", href: "#recursos" },
  { label: "Precios", href: "#precios" },
];

const USE_CASES = [
  {
    icon: Boxes,
    title: "Inventario",
    description:
      "Scorecard, drivers y rendimiento por categoría en un solo cubo accionable.",
  },
  {
    icon: LineChart,
    title: "Ventas",
    description:
      "Tendencia mensual, portafolio por categoría y métricas comparables al instante.",
  },
  {
    icon: BarChart3,
    title: "Performance",
    description:
      "Radial charts y métricas de inventario para identificar oportunidades en segundos.",
  },
  {
    icon: Database,
    title: "Data mining",
    description:
      "Explora categorías, segmenta tu catálogo y descubre patrones ocultos.",
  },
  {
    icon: Sparkles,
    title: "AI insights",
    description:
      "Recomendaciones automáticas sobre qué optimizar primero en tu cubo.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad",
    description:
      "Tus datos quedan protegidos, con control de acceso por organización.",
  },
];

const LandingPage = () => {
  // Landing page owns the bare brand title — no page-name suffix.
  useDocumentMetadata({
    title: `${APP_NAME} · ${APP_TAGLINE}`,
    description:
      "Sube tu inventario y obtén scorecard, drivers, rendimiento por categoría y ventas en un solo cubo.",
    bare: true,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-neutral-900 antialiased">
      {/* Sticky translucent nav */}
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-neutral-900 text-white">
                <Zap className="h-3.5 w-3.5" />
              </span>
              {APP_NAME}
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.SIGN_IN}
              className="hidden text-sm text-neutral-500 transition-colors hover:text-neutral-900 sm:inline-flex sm:px-3"
            >
              Inicia sesión
            </Link>
            <Link to={ROUTES.SIGN_IN}>
              <Button
                size="sm"
                className="h-8 rounded-full bg-neutral-900 px-4 text-[13px] font-medium text-white hover:bg-neutral-800"
              >
                Empieza ahora
                <ArrowRight className="ml-1 !h-3 !w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-neutral-200/80">
          {/* Soft radial spotlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.10) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          {/* Grid lines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 75%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-24 text-center sm:pt-32">
            <Link
              to="#producto"
              className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs text-neutral-600 backdrop-blur transition-colors hover:border-neutral-300 hover:text-neutral-900"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Nuevo · AI insights en cada cubo
              <ArrowRight className="h-3 w-3" />
            </Link>

            <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Tu inventario,
              <br />
              en un solo cubo.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-neutral-500 sm:text-lg">
              {APP_NAME} unifica scorecard, drivers, rendimiento por categoría y
              ventas — listo para que tomes decisiones basadas en datos en
              minutos, no semanas.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={ROUTES.SIGN_IN}>
                <Button
                  size="lg"
                  className="h-11 rounded-full bg-neutral-900 px-6 text-[14px] font-medium text-white hover:bg-neutral-800"
                >
                  Empieza gratis
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#producto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-full border-neutral-200 bg-white px-6 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900"
                >
                  Ver demo
                </Button>
              </a>
            </div>

            <p className="mt-6 text-xs text-neutral-400">
              Listo en menos de 5 minutos · Sin tarjeta de crédito
            </p>
          </div>

          {/* Faux product card */}
          <div className="relative mx-auto max-w-5xl px-6 pb-24">
            <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-[0_30px_120px_-20px_rgba(80,80,160,0.18)]">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="ml-3 font-mono text-neutral-500">
                      scorchain.app/cubo
                    </span>
                  </div>
                  <span className="hidden text-xs text-neutral-400 sm:inline">
                    Q4 · 2026
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { label: "Cubo activo", value: "$24.8M", delta: "+12.4%" },
                    { label: "SKUs activos", value: "1,284", delta: "+3.1%" },
                    { label: "Rotación", value: "5.2x", delta: "+0.8x" },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-lg border border-neutral-200 bg-white p-4"
                    >
                      <div className="text-xs text-neutral-500">
                        {kpi.label}
                      </div>
                      <div className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                        {kpi.value}
                      </div>
                      <div className="mt-1 text-xs text-emerald-600">
                        {kpi.delta}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fake sparkline-ish bars */}
                <div className="mt-6 flex h-28 items-end gap-1.5">
                  {[
                    32, 48, 40, 64, 56, 72, 60, 84, 76, 92, 70, 88, 96, 80, 100,
                    74, 90,
                  ].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-gradient-to-t from-neutral-200 to-neutral-900/70"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logo / proof strip */}
        <section className="border-b border-neutral-200/80 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:justify-between">
            <p className="text-sm text-neutral-500">
              Diseñado para equipos que necesitan ver y decidir rápido
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-neutral-400">
              <span>Retail</span>
              <span>·</span>
              <span>Distribución</span>
              <span>·</span>
              <span>Manufactura</span>
              <span>·</span>
              <span>Ecommerce</span>
            </div>
          </div>
        </section>

        {/* USE CASES grid */}
        <section
          id="producto"
          className="border-b border-neutral-200/80 bg-white py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                Producto
              </span>
              <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Una plataforma. Todas las vistas.
              </h2>
              <p className="mt-4 text-neutral-500">
                Cada módulo de {APP_NAME} habla el mismo idioma — el cubo. Sin
                exportar a Excel, sin reconciliar reportes.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
              {USE_CASES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group relative bg-white p-6 transition-colors hover:bg-neutral-50 sm:p-8"
                >
                  <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors group-hover:border-neutral-300 group-hover:text-neutral-900">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Big feature bento */}
        <section
          id="soluciones"
          className="border-b border-neutral-200/80 bg-neutral-50 py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                Velocidad
              </span>
              <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                De Excel al cubo en 5 minutos.
              </h2>
              <p className="mt-4 text-neutral-500">
                Importa tu inventario y obtén scorecard, drivers y rendimiento
                listos. No hay configuración, no hay fricción.
              </p>
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-white p-8 lg:col-span-2">
                <div className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-500">
                  <Zap className="h-3 w-3 text-emerald-500" />
                  Import
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Sube tu archivo. El cubo se arma solo.
                </h3>
                <p className="mt-3 max-w-lg text-sm text-neutral-500">
                  Conectamos columnas automáticamente y validamos tu data antes
                  de moverla al cubo activo — sin sorpresas.
                </p>
                <div className="mt-6 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
                  inventario_q4.xlsx
                  <div className="mx-auto mt-2 h-1 w-32 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-full w-2/3 rounded-full bg-neutral-900" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-8">
                <div className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-500">
                  <Lock className="h-3 w-3" />
                  Seguro
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Tu data, tu control.
                </h3>
                <p className="mt-3 text-sm text-neutral-500">
                  Aislamiento por organización, autenticación moderna y backups
                  diarios desde el día cero.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Encriptado en reposo y en tránsito
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section
          id="precios"
          className="relative overflow-hidden border-b border-neutral-200/80 bg-white"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 100%, rgba(99,102,241,0.10) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Empieza a ver tu inventario claro.
            </h2>
            <p className="mt-4 text-neutral-500">
              Crea tu cubo gratis y pruébalo con tu propia data hoy mismo.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={ROUTES.SIGN_IN}>
                <Button
                  size="lg"
                  className="h-11 rounded-full bg-neutral-900 px-6 text-[14px] font-medium text-white hover:bg-neutral-800"
                >
                  Empieza gratis
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#recursos">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-full border-neutral-200 bg-white px-6 text-[14px] font-medium text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900"
                >
                  Hablar con ventas
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
