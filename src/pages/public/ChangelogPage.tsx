import { useMemo } from "react";

// `?raw` is a Vite feature — it imports the file as a literal string at
// build time. Saves us shipping a markdown parser or hitting the
// filesystem at runtime; the CHANGELOG is bundled into the page itself.
// CHANGELOG lives at the repo root, hence the `../../../` hop.
import { useDocumentMetadata } from "src/hooks";
import { APP_NAME } from "src/lib/consts";

import PublicPageLayout from "./_components/PublicPageLayout";
import changelogSource from "../../../CHANGELOG.md?raw";

interface Section {
  /** Version + date heading, e.g. "1.0.0 (2026-05-23)". */
  heading: string;
  /** Markdown body of the section (everything until the next version heading). */
  body: string;
}

/**
 * Split CHANGELOG.md into one section per release. standard-version
 * emits headings like `### 0.50.2 (2025-02-14)` and `## [1.0.0](url)`,
 * so the regex accepts either flavor.
 */
function parseSections(md: string): Section[] {
  const lines = md.split("\n");
  const sections: Section[] = [];
  let current: Section | null = null;

  const HEADING = /^#{2,3}\s+\[?(\d+\.\d+\.\d+)/;

  for (const line of lines) {
    const match = line.match(HEADING);
    if (match) {
      if (current) sections.push(current);
      current = { heading: line.replace(/^#{2,3}\s+/, ""), body: "" };
    } else if (current) {
      current.body += line + "\n";
    }
  }
  if (current) sections.push(current);
  return sections;
}

/**
 * Lightweight markdown → JSX renderer for the changelog body. We
 * intentionally support only the markdown that standard-version emits
 * (bullet list of commits, each with an optional `[hash](url)` link)
 * — no full parser dep, no XSS surface.
 */
function ChangelogBody({ body }: { body: string }) {
  const items = useMemo(
    () =>
      body
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("* ") || line.startsWith("- "))
        .map((line) => line.slice(2)),
    [body]
  );

  if (items.length === 0) {
    return <p className="text-sm italic text-neutral-400">Sin cambios.</p>;
  }

  return (
    <ul className="space-y-1.5 text-sm text-neutral-600">
      {items.map((raw, i) => (
        <li key={i} className="leading-relaxed">
          {renderInline(raw)}
        </li>
      ))}
    </ul>
  );
}

/**
 * Inline renderer: turns `[text](url)` segments into real anchors and
 * leaves the rest as plain text. Backticks become inline code.
 */
function renderInline(input: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push(input.slice(lastIndex, match.index));
    }
    if (match[1] && match[2]) {
      parts.push(
        <a
          key={key++}
          href={match[2]}
          target="_blank"
          rel="noreferrer"
          className="text-neutral-900 underline-offset-4 hover:underline"
        >
          {match[1]}
        </a>
      );
    } else if (match[3]) {
      parts.push(
        <code
          key={key++}
          className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[12px]"
        >
          {match[3]}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < input.length) parts.push(input.slice(lastIndex));
  return parts;
}

export default function ChangelogPage() {
  useDocumentMetadata(
    "Changelog",
    `Historial de cambios de ${APP_NAME} — bumps generados automáticamente desde el log de commits.`
  );

  const sections = useMemo(() => parseSections(changelogSource), []);

  return (
    <PublicPageLayout
      title="Changelog"
      description={`Cada release de ${APP_NAME} viene de un commit de Conventional Commits — esta página se regenera sola.`}
    >
      {sections.length === 0 ? (
        <p>Aún no hay releases publicados.</p>
      ) : (
        <div className="not-prose space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold tracking-tight">
                {s.heading}
              </h2>
              <div className="mt-3">
                <ChangelogBody body={s.body} />
              </div>
            </section>
          ))}
        </div>
      )}
    </PublicPageLayout>
  );
}
