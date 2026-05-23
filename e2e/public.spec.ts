import { expect, test } from "@playwright/test";

/**
 * Public landing page + error page smoke tests. No backend dependencies.
 */

test.describe("Landing page", () => {
  test("renders hero, lead form and feature cards", async ({ page }) => {
    await page.goto("/");

    // Top bar
    await expect(
      page.getByRole("link", { name: "ScorChain" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Inicia sesión" })
    ).toBeVisible();

    // Hero
    await expect(
      page.getByRole("heading", { name: /Maneja tu inventario con/i })
    ).toBeVisible();

    // Lead form inputs in the timeline
    await expect(page.getByPlaceholder("Email")).toBeVisible();
    await expect(page.getByPlaceholder("Negocio")).toBeVisible();
    await expect(page.getByPlaceholder("Lugar")).toBeVisible();

    // Servicios section header (Footer also has one — scope to <main>)
    await expect(
      page.getByRole("main").getByRole("heading", { name: "Servicios" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Ir a Inventario/i })
    ).toBeVisible();
  });

  test("top-bar Inicia sesión button navigates to /login", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Inicia sesión" }).click();

    await expect(page).toHaveURL(/\/login$/);
  });
});
