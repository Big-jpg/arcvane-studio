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
      "/process",
    );
    await expect(primaryNav.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");

    await expect(primaryNav.getByRole("link", { name: "Custom" })).toHaveCount(0);
    await expect(primaryNav.getByRole("link", { name: "Fitting Guide" })).toHaveCount(0);
    await expect(primaryNav.getByRole("link", { name: "FAQ" })).toHaveCount(0);
    await expect(primaryNav.getByRole("link", { name: "Shop" })).toHaveCount(0);
  });

  test("home page loads and scroll-driven time-state changes are applied", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Light, shaped for the room it enters." }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /A lighting system, not a single object/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore the light/i })).toBeVisible();

    await page.locator("#chapter-dawn").scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.time)).toBe("dawn");

    await page.locator("#chapter-midday").scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.time)).toBe("midday");

    await page.locator("#chapter-dusk").scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.time)).toBe("dusk");

    await page.locator("#chapter-evening").scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.time)).toBe("evening");
  });

  test("mobile chapters prioritize imagery and concise copy", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const dawnChapter = page.locator("#chapter-dawn");

    await expect(
      dawnChapter
        .getByText("Softens first light into a quiet, structured glow.")
        .filter({ visible: true }),
    ).toHaveCount(1);
    await expect(
      dawnChapter
        .getByText(/Some rooms need presence before brightness/i)
        .filter({ visible: true }),
    ).toHaveCount(0);
    await expect(
      dawnChapter.getByText(/Bedrooms · reading corners/i).filter({ visible: true }),
    ).toHaveCount(1);
    await expect(
      dawnChapter
        .getByRole("img", { name: /Dawn ArcVane shade study/i })
        .filter({ visible: true }),
    ).toHaveCount(1);
  });

  test("collection introduction adapts for mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/products");

    await expect(
      page.getByText("Shades, diffusers, and stands designed for changing domestic light."),
    ).toBeVisible();
    await expect(page.getByText("Modular forms")).toBeVisible();
    await expect(page.getByText("Material-led")).toBeVisible();
    await expect(page.getByText("Small-run")).toBeVisible();
    await expect(
      page.getByText(/A decorative component system, not a complete electrical lamp/i),
    ).toBeHidden();
  });

  test("reduced motion keeps homepage assembly visible without sequential reveal", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await expect(
      page.getByRole("img", { name: /Scroll-led drawing of the ArcVane tripod stand/i }),
    ).toBeVisible();
    await expect
      .poll(() => page.locator('svg[aria-label^="Scroll-led drawing"] .opacity-0').count())
      .toBe(0);
  });

  test("collection page loads product cards with time-state labels", async ({ page }) => {
    await page.goto("/products");

    await expect(
      page.getByRole("heading", { name: /Objects for shaping domestic light/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Shell Fan/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Coral Veil/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Dune Rib/i })).toBeVisible();
    await expect(page.getByText(/Dawn \/ Midday/i).first()).toBeVisible();
    await expect(page.getByText(/Dusk \/ Evening/i).first()).toBeVisible();
  });

  test("product detail page loads finish selector, object details, and cart action", async ({ page }) => {
    await page.goto("/products/shell-fan");

    await expect(page.getByRole("heading", { name: "Shell Fan" })).toBeVisible();
    await expect(page.getByText(/Best in Dawn \/ Midday/i)).toBeVisible();
    await expect(page.getByText("Material finish", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Object details" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Add to selection/i })).toBeVisible();
  });

  test("materials page loads the swatch grid", async ({ page }) => {
    await page.goto("/materials");

    await expect(page.getByRole("heading", { name: /Material finishes/i })).toBeVisible();
    await expect(page.getByText(/Every form begins with a material decision/i)).toBeVisible();
    await expect(page.locator("article")).toHaveCount(6);
    await expect(
      page.getByRole("button", { name: /Show Back light view for Translucent PLA/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Choose a finished form/i })).toHaveAttribute(
      "href",
      "/products",
    );
    await expect(page.getByRole("link", { name: /Follow the studio work/i })).toHaveAttribute(
      "href",
      "/process",
    );
    await expect(page.getByRole("link", { name: /Return to the changing room/i })).toHaveAttribute(
      "href",
      "/#chapter-dawn",
    );
  });

  test("process page loads through the canonical process route", async ({ page }) => {
    await page.goto("/process");

    await expect(
      page.getByRole("heading", {
        name: /Made slowly, packed simply, released in small runs/i,
      }),
    ).toBeVisible();
    await expect(page.getByText(/No offshore catalogue\. No sprawling options matrix/i)).toBeVisible();
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

  test("cart page remains available", async ({ page }) => {
    await page.goto("/cart");

    await expect(page.getByRole("heading", { name: "Your Selection", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your selection is empty", exact: true })).toBeVisible();
  });

  test("admin-lite routes do not inherit the storefront data-time attribute", async ({ page }) => {
    await page.goto("/admin-lite");

    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.time ?? null)).toBeNull();
  });

  test("sitemap uses the canonical process route and omits demoted public routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);

    const sitemap = await response.text();
    expect(sitemap).toContain("/process");
    expect(sitemap).toContain("/shipping");
    expect(sitemap).not.toContain("/production");
    expect(sitemap).not.toContain("/custom");
    expect(sitemap).not.toContain("/pickup");
  });

  test("legacy admin product route redirects to admin-lite catalogue", async ({ request }) => {
    const response = await request.get("/admin/products", { maxRedirects: 0 });

    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe("/admin-lite/products");
  });
});
