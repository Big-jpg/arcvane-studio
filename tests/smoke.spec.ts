import { expect, test } from "@playwright/test";

test.describe("ArcVane public smoke coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
  });

  test("primary navigation reflects the coastal collection site map", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const primaryNav = page.getByRole("navigation", { name: "Primary navigation" });

    await expect(primaryNav.getByRole("link", { name: "Collection" })).toHaveAttribute(
      "href",
      "/products",
    );
    await expect(primaryNav.getByRole("link", { name: "Materials" })).toHaveAttribute(
      "href",
      "/materials",
    );
    await expect(primaryNav.getByRole("link", { name: "Process" })).toHaveAttribute(
      "href",
      "/production",
    );
    await expect(primaryNav.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    await expect(primaryNav.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );

    await expect(primaryNav.getByRole("link", { name: "Custom" })).toHaveCount(0);
    await expect(primaryNav.getByRole("link", { name: "Fitting Guide" })).toHaveCount(0);
    await expect(primaryNav.getByRole("link", { name: "FAQ" })).toHaveCount(0);
    await expect(primaryNav.getByRole("link", { name: "Shop" })).toHaveCount(0);
  });

  test("home page loads coastal lighting content", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Light first." })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Not a lamp\. A lighting language/i }),
    ).toBeVisible();
    await expect(page.getByText(/Western Australian coast/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore the collection/i })).toBeVisible();
  });

  test("collection page loads current product names", async ({ page }) => {
    await page.goto("/products");

    await expect(
      page.getByRole("heading", { name: /Coastal lighting pieces, released in small runs/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Shell Fan/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Coral Veil/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Dune Rib/i })).toBeVisible();
  });

  test("product detail page loads", async ({ page }) => {
    await page.goto("/products/shell-fan");

    await expect(page.getByRole("heading", { name: "Shell Fan" })).toBeVisible();
    await expect(page.getByText(/Clear PLA, translucent shell-diffusion finish/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: "LED-only safety" })).toBeVisible();
  });

  test("materials page loads", async ({ page }) => {
    await page.goto("/materials");

    await expect(
      page.getByRole("heading", { name: /Translucent PLA, treated like a coastal material/i }),
    ).toBeVisible();
    await expect(page.getByText(/ArcVane uses clear PLA, matte finishes/i)).toBeVisible();
  });

  test("process page loads", async ({ page }) => {
    await page.goto("/production");

    await expect(
      page.getByRole("heading", {
        name: /Made slowly, packed simply, released in small runs/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/No offshore catalogue\. No sprawling options matrix/i),
    ).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", {
        name: /Coastal lighting from a small Western Australian studio/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/ArcVane makes compact lighting pieces shaped by shell/i),
    ).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");

    await expect(
      page.getByRole("heading", { name: /Product questions, order support/i }),
    ).toBeVisible();
    await expect(page.getByText(/ArcVane is a small studio/i)).toBeVisible();
  });

  test("fulfilment page covers shipping and pickup", async ({ page }) => {
    await page.goto("/shipping");

    await expect(page.getByRole("heading", { name: /Compact delivery/i })).toBeVisible();
    await expect(page.getByText(/delivery where available/i)).toBeVisible();
    await expect(page.getByText(/arranged local pickup/i)).toBeVisible();
  });

  test("demoted public routes redirect to canonical pages", async ({ page }) => {
    await page.goto("/custom");
    await expect(page).toHaveURL(/\/contact$/);

    await page.goto("/pickup");
    await expect(page).toHaveURL(/\/shipping$/);
  });

  test("sitemap omits demoted public routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);

    const sitemap = await response.text();
    expect(sitemap).toContain("/shipping");
    expect(sitemap).not.toContain("/custom");
    expect(sitemap).not.toContain("/pickup");
  });

  test("legacy admin product route redirects to admin-lite catalogue", async ({ request }) => {
    const response = await request.get("/admin/products", { maxRedirects: 0 });

    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe("/admin-lite/products");
  });
});
