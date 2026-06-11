import { expect, test } from "@playwright/test";

/**
 * Public landing page smoke tests. No backend dependencies.
 */

test.describe("Landing page", () => {
  test("renders top bar, hero and footer", async ({ page }) => {
    await page.goto("/");

    // Top bar — the brand mark appears in the header and the footer,
    // and "Iniciar sesión" appears as top-bar, hero and footer CTAs.
    await expect(
      page.getByRole("link", { name: "TrimSuccess" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Iniciar sesión" }).first()
    ).toBeVisible();

    // Hero
    await expect(
      page.getByRole("heading", { level: 1, name: /Tu inventario/i })
    ).toBeVisible();

    // Footer
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("top-bar Iniciar sesión button navigates to /login", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Iniciar sesión" }).first().click();

    await expect(page).toHaveURL(/\/login$/);
  });
});
