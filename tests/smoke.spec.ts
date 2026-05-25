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
    await expect(primaryNav.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
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

    await expect(
      page.getByRole("heading", {
        name: /Small-batch lighting objects shaped by coastal forms/i,
      }),
    ).toBeVisible();
    await expect(page.getByText(/Shell-like PLA diffusers/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Shop current collection/i })).toBeVisible();
  });

  test("collection page loads current product names", async ({ page }) => {
    await page.goto("/products");

    await expect(
      page.getByRole("heading", { name: /Coastal lighting objects, kept deliberately small/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Shell Fan/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Coral Veil/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Dune Rib/i })).toBeVisible();
  });

  test("product detail page loads", async ({ page }) => {
    await page.goto("/products/shell-fan");

    await expect(page.getByRole("heading", { name: "Shell Fan" })).toBeVisible();
    await expect(page.getByText(/Clear PLA, translucent shell-diffusion finish/i)).toBeVisible();
    await expect(page.getByText("LED bulbs only", { exact: true })).toBeVisible();
  });

  test("materials page loads", async ({ page }) => {
    await page.goto("/materials");

    await expect(
      page.getByRole("heading", { name: /PLA treated as a coastal material/i }),
    ).toBeVisible();
    await expect(page.getByText(/ArcVane uses clear PLA, matte PLA/i)).toBeVisible();
  });

  test("process page loads", async ({ page }) => {
    await page.goto("/production");

    await expect(
      page.getByRole("heading", {
        name: /Made after order, with the discipline of a compact collection/i,
      }),
    ).toBeVisible();
    await expect(page.getByText(/ArcVane produces finished lighting objects in small batches/i)).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", {
        name: /Coastal lighting objects from a small Western Australian studio/i,
      }),
    ).toBeVisible();
    await expect(page.getByText(/ArcVane Studio designs compact E27 lighting objects/i)).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
    await expect(page.getByText(/ArcVane operates as a small studio/i)).toBeVisible();
  });
});
