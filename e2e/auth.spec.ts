import { expect, test } from "@playwright/test";

/**
 * Smoke tests for the migrated auth pages. These do NOT hit Firebase —
 * they only assert that the login-02 shell renders, validation fires on
 * empty submit, and links between the auth pages wire up correctly.
 *
 * Tests against actual Firebase auth (real sign-in / sign-up) live in
 * a separate file gated by demo credentials so they don't run on CI.
 */

test.describe("Sign in page", () => {
  test("renders login-02 layout with brand, form and hero", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("link", { name: "ScorChain" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Inicia sesión" })
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Contraseña")).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

    // Hero image only shows on the lg breakpoint; default Playwright
    // viewport is 1280x720 which crosses our lg:1024px breakpoint. The
    // image is marked aria-hidden (decorative), so query by selector.
    await expect(page.locator("img[alt='']")).toBeVisible();
  });

  test("validates empty submit with field-level errors", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Email requerido")).toBeVisible();
    await expect(page.getByText("Contraseña requerida")).toBeVisible();
  });

  test("validates malformed email", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Contraseña").fill("anything");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Formato de email inválido")).toBeVisible();
  });

  test("forgot-password link navigates", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: "¿Olvidaste tu contraseña?" }).click();

    await expect(page).toHaveURL(/\/forgot-password$/);
    await expect(
      page.getByRole("heading", { name: "Recupera tu contraseña" })
    ).toBeVisible();
  });

  test("sign-up link navigates", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: "Regístrate" }).click();

    await expect(page).toHaveURL(/\/sign-up$/);
    await expect(
      page.getByRole("heading", { name: "Crea tu cuenta" })
    ).toBeVisible();
  });
});

test.describe("Sign up page", () => {
  test("renders all required fields", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Contraseña", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Confirmar contraseña")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Registrarme" })
    ).toBeVisible();
  });

  test("rejects mismatched passwords", async ({ page }) => {
    await page.goto("/sign-up");

    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Contraseña", { exact: true }).fill("Password123!");
    await page.getByLabel("Confirmar contraseña").fill("Different456!");
    await page.getByRole("button", { name: "Registrarme" }).click();

    await expect(page.getByText("Las contraseñas no coinciden")).toBeVisible();
  });

  test("rejects passwords shorter than 8 chars", async ({ page }) => {
    await page.goto("/sign-up");

    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Contraseña", { exact: true }).fill("short");
    await page.getByLabel("Confirmar contraseña").fill("short");
    await page.getByRole("button", { name: "Registrarme" }).click();

    await expect(
      page.getByText("La contraseña debe tener al menos 8 caracteres")
    ).toBeVisible();
  });

  test("back-to-sign-in link navigates", async ({ page }) => {
    await page.goto("/sign-up");

    await page.getByRole("link", { name: "Inicia sesión" }).click();

    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("Forgot password page", () => {
  test("renders email field + back link", async ({ page }) => {
    await page.goto("/forgot-password");

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Enviar email de recuperación" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Volver al inicio de sesión" })
    ).toBeVisible();
  });

  test("validates email format before submit", async ({ page }) => {
    await page.goto("/forgot-password");

    await page.getByLabel("Email").fill("bad");
    await page
      .getByRole("button", { name: "Enviar email de recuperación" })
      .click();

    await expect(page.getByText("Formato de email inválido")).toBeVisible();
  });
});
