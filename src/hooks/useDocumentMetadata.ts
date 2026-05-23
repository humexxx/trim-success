import { useEffect } from "react";

import { APP_DESCRIPTION, APP_NAME, TITLE_SEPARATOR } from "src/lib/consts";

interface Options {
  /**
   * Page title — automatically suffixed with " · {APP_NAME}". Pass the
   * brand name explicitly (or skip the suffix) by setting `bare: true`.
   */
  title: string;
  /** SEO meta description. Keep under ~160 chars. */
  description?: string;
  /** If true, don't append the brand suffix to the title. */
  bare?: boolean;
}

/**
 * Sets `<title>` and `<meta name="description">` for the lifetime of
 * the calling component. Both are restored to their previous values on
 * unmount so transient route changes never leak stale metadata.
 *
 * Accepts either:
 *   - a plain string (just the page title), or
 *   - an `Options` object for finer control (description, no suffix).
 *
 * The second arg is a shorthand for `description` when the first is a
 * string — kept for callsite ergonomics.
 */
function useDocumentMetadata(input: string | Options, description?: string) {
  const opts: Options =
    typeof input === "string" ? { title: input, description } : input;

  const title = opts.bare
    ? opts.title
    : `${opts.title}${TITLE_SEPARATOR}${APP_NAME}`;
  const desc = opts.description ?? APP_DESCRIPTION;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    // Reuse the existing description meta tag if one already exists
    // (e.g. set in index.html) so we don't duplicate the node.
    const existing = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    const previousDesc = existing?.content ?? null;
    let created = false;
    let meta = existing;

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
      created = true;
    }
    meta.content = desc;

    return () => {
      document.title = previousTitle;
      if (created) {
        meta?.parentNode?.removeChild(meta);
      } else if (meta && previousDesc !== null) {
        meta.content = previousDesc;
      }
    };
  }, [title, desc]);
}

export default useDocumentMetadata;
