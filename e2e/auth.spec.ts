import { expect, test } from "@playwright/test";

/**
 * Smoke tests for the auth pages. These do NOT hit Firebase — they only
 * assert that the login-02 shell renders, validation fires on empty
 * submit, and links between the auth pages wire up correctly.
 *
 * Tests against actual Firebase auth (real sign-in / sign-up) live in
 * a separate file gated by demo credentials so they don't run on CI.
 *
 * Note: the dev server renders the "Entrar como Demo/Admin" quick-login
 * buttons, whose accessible names contain "Entrar" — every locator for
 * the submit button must use `exact: true`.
 */

test.describe("Sign in page", () => {
  test("renders login-02 layout with brand and form", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("link", { name: "TrimSuccess" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Inicia sesión" })
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Contraseña")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Entrar", exact: true })
    ).toBeVisible();
  });

  test("validates empty submit with field-level errors", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "Entrar", exact: true }).click();

    await expect(page.getByText("Email requerido")).toBeVisible();
    await expect(page.getByText("Contraseña requerida")).toBeVisible();
  });

  test("validates malformed email", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Contraseña").fill("anything");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();

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
});

test.describe("Legacy auth routes", () => {
  // Registration is disabled and /sign-in was renamed — both legacy
  // paths must land on the canonical /login.
  test("/sign-up redirects to /login", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("heading", { name: "Inicia sesión" })
    ).toBeVisible();
  });

  test("/sign-in redirects to /login", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("heading", { name: "Inicia sesión" })
    ).toBeVisible();
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

  test("back link returns to /login", async ({ page }) => {
    await page.goto("/forgot-password");

    await page.getByRole("link", { name: "Volver al inicio de sesión" }).click();

    await expect(page).toHaveURL(/\/login$/);
  });
});
