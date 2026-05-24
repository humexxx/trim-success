import { ReactNode } from "react";

import { ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_NAME } from "src/lib/consts";

import Footer from "./Footer";
import { Button } from "@/components/ui/button";


interface Props {
  /** Page title shown as the H1. */
  title: string;
  /** Short paragraph under the H1. */
  description?: string;
  /** Right-side metadata column (e.g. "Last updated: …"). Optional. */
  meta?: ReactNode;
  children: ReactNode;
}

/**
 * Shared shell for the public marketing / legal / changelog pages.
 * Keeps the same header + footer the landing uses, so navigating from
 * the landing to e.g. /about doesn't feel like a different app.
 *
 * The body content is constrained to a readable `max-w-3xl` column —
 * these pages are mostly prose, not dashboards.
 */
export default function PublicPageLayout({
  title,
  description,
  meta,
  children,
}: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-neutral-900 antialiased">
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-neutral-900 text-white">
              <Zap className="h-3.5 w-3.5" />
            </span>
            {APP_NAME}
          </Link>
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-sm text-neutral-500 hover:text-neutral-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20">
        <header className="mb-12">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-lg text-neutral-500">{description}</p>
          )}
          {meta && (
            <div className="mt-6 text-xs uppercase tracking-widest text-neutral-400">
              {meta}
            </div>
          )}
        </header>

        <div className="prose prose-neutral max-w-none prose-headings:mt-12 prose-headings:mb-3 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:text-neutral-600 prose-p:leading-relaxed prose-li:text-neutral-600 prose-a:text-neutral-900 prose-a:underline-offset-4 prose-strong:text-neutral-900">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
