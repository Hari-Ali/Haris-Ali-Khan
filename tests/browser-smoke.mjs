import { chromium } from "playwright";
import assert from "node:assert/strict";
import { services, articles } from "../scripts/site-content.mjs";
const base = process.env.TEST_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const errors = [];
const page = await browser.newPage();
page.on("pageerror", (e) => errors.push(e.message));
try {
  for (const width of [1440, 1024, 768, 390, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${width}px overflow`,
    );
    assert.equal(await page.locator("h1").count(), 1);
    assert.deepEqual(
      await page
        .locator("main > section[id]")
        .evaluateAll((sections) => sections.map((s) => s.id)),
      [
        "studio",
        "process",
        "services",
        "work",
        "cases",
        "reviews",
        "faq",
        "pricing",
        "journal",
        "contact",
      ],
    );
    assert.equal(await page.locator(".timeline-item").count(), 7);
    assert.equal(await page.locator(".service-panel").count(), 6);
    if (width <= 1000) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      assert.equal(await page.locator("main").evaluate((e) => e.inert), true);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
      assert.equal(await page.locator("#mobile-menu").isVisible(), false);
      assert.equal(await page.locator("main").evaluate((e) => e.inert), false);
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page
        .locator("#mobile-menu")
        .getByRole("link", { name: "Pricing", exact: false })
        .click();
      assert.equal(await page.locator("#mobile-menu").isVisible(), false);
    }
    await page.getByRole("tab", { name: "Monthly Retainer" }).click();
    assert.equal(await page.locator("#pricing-retainer").isVisible(), true);
    assert.equal(await page.locator("#pricing-project").isVisible(), false);
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.locator("#pricing-project").isVisible(), true);
    await page.getByText("See the development approach", {exact:false}).click();
    await page.getByRole("tab", { name: "02 / THE CODE" }).click();
    assert.equal(await page.locator("#stage-1").isVisible(), true);
    await page.keyboard.press("End");
    assert.equal(await page.locator("#stage-3").isVisible(), true);
    await page.locator("#faq summary").first().click();
    assert.equal(
      await page.locator("#faq details").first().getAttribute("open"),
      "",
    );
    await page.locator("#client-name").fill("Haris & team");
    await page.locator("#reply-email").fill("client@example.com");
    await page.locator("#store-url").fill("https://example.com/");
    await page
      .locator("#project-brief")
      .fill("Custom storefront & clear navigation.");
    await page
      .locator("#pricing-project")
      .getByRole("link", { name: "Discuss Professional" })
      .click();
    await page.getByRole("button", { name: "Prepare email enquiry" }).click();
    const mail = decodeURIComponent(
      await page.locator("#email-enquiry").getAttribute("href"),
    );
    for (const text of [
      "alikhanharis515@gmail.com",
      "client@example.com",
      "Haris & team",
      "Professional / project",
      "Custom storefront & clear navigation.",
    ])
      assert.ok(mail.includes(text), `Missing ${text}`);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${width}px expanded overflow`,
    );
    if (width === 1440 || width === 390) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `/tmp/hur-full-${width}.png`,
        fullPage: true,
      });
    }
    console.log(
      `${width}px: section order, menu, tabs, FAQ, and enquiry passed`,
    );
  }
  for (const path of [
    ...services.map((s) => `/services/${s.slug}/`),
    ...articles.map((a) => `/journal/${a.slug}/`),
    "/case-studies/project-template/",
  ]) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200, path);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      `https://hursolution.com${path}`,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      path,
    );
    if (path.startsWith("/case-studies"))
      assert.equal(
        await page.locator('meta[name="robots"]').getAttribute("content"),
        "noindex,follow",
      );
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base, { waitUntil: "networkidle" });
  await page
    .getByRole("link", { name: "Discuss a project", exact: true })
    .first()
    .click();
  await page.waitForTimeout(1100);
  assert.equal(await page.evaluate(() => location.hash), "#contact");
  await page.locator("#faq summary").first().click();
  await page.waitForTimeout(550);
  assert.equal(
    await page.locator("#faq details").first().getAttribute("open"),
    "",
  );
  await page.locator("#faq summary").first().click();
  await page.waitForTimeout(550);
  assert.equal(
    await page.locator("#faq details").first().getAttribute("open"),
    null,
  );
  const nojs = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  await nojs.goto(base);
  assert.equal(
    await nojs.getByRole("link", { name: "Email HUR Solution" }).isVisible(),
    true,
  );
  assert.equal(await nojs.locator("h1").isVisible(), true);
  await nojs.close();
  assert.deepEqual(errors, []);
  console.log(
    "Detail pages, animated navigation/accordion, no-JS fallback, and JavaScript checks passed.",
  );
} finally {
  await browser.close();
}
