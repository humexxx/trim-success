/**
 * Stable category → chart-palette mapping.
 *
 * Charts across the app (bar / radial / donut / area / radar) share the
 * same five `--chart-N` CSS tokens. To make a category visually
 * recognizable wherever it appears, we always derive its color from a
 * deterministic index based on the alphabetical position of its name
 * within the full category list. So "Producto Principal" gets the same
 * coral whether it shows up in the inventory dashboard, the sales bar
 * chart, the data-mining donut, or the portfolio radar.
 *
 * Wrapping past chart-5 (more than 5 categories) is intentional —
 * better to repeat a color than introduce a sixth unsanctioned hue.
 */

/** Hard cap mirrors the number of `--chart-N` CSS variables defined. */
const PALETTE_SIZE = 5;

/** "Total" rows in our datasets are visualized in a neutral tone. */
const TOTAL_TOKEN = "hsl(var(--muted-foreground))";

/**
 * Returns the canonical color for `category` given the FULL list of
 * categories that will appear together (typically the user's category
 * catalog from `cubeParameters.categories`). The mapping is stable
 * across renders as long as `allCategories` stays the same.
 *
 * Pass any string for the special "Total" row to get the neutral tone.
 */
export function colorForCategory(
  category: string,
  allCategories: readonly string[]
): string {
  if (category === "Total") return TOTAL_TOKEN;
  const sorted = [...new Set(allCategories)].sort((a, b) =>
    a.localeCompare(b)
  );
  const idx = sorted.indexOf(category);
  if (idx < 0) return TOTAL_TOKEN;
  return `hsl(var(--chart-${(idx % PALETTE_SIZE) + 1}))`;
}

/**
 * Pre-computed `category → color` map. Useful when you need to feed
 * Recharts `ChartConfig` or want to avoid recomputing the sort on
 * every render.
 */
export function buildCategoryColorMap(
  allCategories: readonly string[]
): Record<string, string> {
  return Object.fromEntries(
    allCategories.map((c) => [c, colorForCategory(c, allCategories)])
  );
}
