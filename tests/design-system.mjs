import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const base = process.env.TEST_URL || "http://127.0.0.1:4173";
const artifacts = process.env.DESIGN_QA_DIR || "/tmp/hur-design";
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const errors = [];
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
page.on("pageerror", error => errors.push(error.message));
const noOverflow = async label => assert.equal(
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  false, label + ": page overflow"
);
const accessible = async label => {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  assert.deepEqual(results.violations.map(v => ({
    id: v.id, impact: v.impact, elements: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary }))
  })), [], label + ": accessibility violations");
};
try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 900 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await noOverflow(width + "px");
    assert.equal(await page.locator(".hero-brand").textContent(), "HUR Solution");
    assert.equal(await page.locator(".hero").evaluate(el => Math.round(el.getBoundingClientRect().width)), width);
    assert.equal(await page.locator("body").evaluate(el => getComputedStyle(el).fontFamily.includes("Outfit")), true);
    assert.equal(await page.locator(".stack-fallback").evaluate(el => el.complete && el.naturalWidth > 0), true);
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: artifacts + "/home-" + width + ".png" });
    }
    await accessible(width + "px default");
    await page.locator(".service-content h3").first().evaluate(el => el.textContent = "ShopifyThemeDevelopment".repeat(12));
    await noOverflow(width + "px long content");
    console.log(width + "px: full-width hero, Outfit, assets, contrast/accessibility, and long content passed");
  }
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator("#reply-email").fill("invalid");
  await page.getByRole("button", { name: "Prepare email enquiry" }).click();
  assert.equal(await page.locator("#reply-email").getAttribute("aria-invalid"), "true");
  assert.equal(await page.locator("#reply-email-error").isVisible(), true);
  assert.ok((await page.locator("#reply-email").getAttribute("aria-describedby")).includes("reply-email-error"));
  await page.locator("#reply-email").fill("reader@example.com");
  assert.equal(await page.locator("#reply-email").getAttribute("aria-invalid"), null);
  await page.locator("#project-brief").fill("  ");
  await page.getByRole("button", { name: "Prepare email enquiry" }).click();
  assert.equal(await page.locator("#project-brief-error").isVisible(), true);
  await page.locator("#project-brief").fill("A clearer Shopify storefront.");
  assert.equal(await page.locator("#project-brief-error").isVisible(), false);
  await page.keyboard.press("Tab");
  assert.equal(await page.getByRole("button", { name: "Prepare email enquiry" }).evaluate(el =>
    el.matches(":focus-visible") && getComputedStyle(el).outlineStyle !== "none"
  ), true);
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#brief-result").isVisible(), true);
  await accessible("form result");
  await noOverflow("form result");
  await page.goto(base, { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addStyleTag({ content: "body * {line-height:1.5 !important;letter-spacing:0.12em !important;word-spacing:0.16em !important} p {margin-bottom:2em !important}" });
  await noOverflow("text spacing");
  await page.goto(base, { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    const sizes = [...document.querySelectorAll("body *")].filter(el =>
      [...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
    ).map(el => [el, parseFloat(getComputedStyle(el).fontSize)]);
    sizes.forEach(([el, size]) => el.style.fontSize = size * 2 + "px");
  });
  await noOverflow("200% text resizing");
  assert.equal(await page.locator(".header").evaluate(header => {
    const bounds = header.getBoundingClientRect();
    const children = [...header.children].filter(el => getComputedStyle(el).display !== "none");
    return children.every(el => {
      const rect = el.getBoundingClientRect();
      return rect.top >= bounds.top && rect.bottom <= bounds.bottom && rect.left >= bounds.left && rect.right <= bounds.right;
    });
  }), true, "200% text resizing: header controls must fit");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 900 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForSelector(".stack-card[data-top]");
    for (let image = 0; image < 3; image++) {
      await page.waitForTimeout(1300);
      await accessible(width + "px hero image " + image);
      await noOverflow(width + "px hero image " + image);
      if (image < 2) await page.getByRole("button", { name: "Next image" }).click();
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base + "/journal/planning-a-shopify-redesign/", { waitUntil: "networkidle" });
  await accessible("journal detail");
  await noOverflow("journal detail");
  await page.goto(base + "/services/custom-theme-development/", { waitUntil: "networkidle" });
  await accessible("service detail");
  await noOverflow("service detail");
  assert.deepEqual(errors, []);
  console.log("Form errors, keyboard focus/submission, text spacing, 200% text resizing, and detail-page accessibility passed");
} finally {
  await browser.close();
}
