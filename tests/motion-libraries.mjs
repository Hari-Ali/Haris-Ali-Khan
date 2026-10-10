import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.TEST_URL || "http://127.0.0.1:4173";
try {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForSelector(".webgl-ready canvas", { timeout: 30000 });
  assert.ok(
    (await page.locator(".hero-word").count()) > 0,
    "SplitType words missing",
  );
  assert.ok(
    await page.locator("html").evaluate((e) => e.classList.contains("lenis")),
    "Lenis not active",
  );
  assert.equal(
    await page.locator(".webgl-ready canvas").count(),
    1,
    "R3F canvas missing",
  );
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/tmp/hur-webgl-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Explore in 3D" }).click();
  await page.waitForSelector(".webgl-ready canvas");
  await page.locator(".portfolio-swiper").scrollIntoViewIfNeeded();
  await page.waitForSelector(".portfolio-swiper.swiper-initialized");
  await page.waitForTimeout(500);
  const active = await page
    .locator(".portfolio-swiper .swiper-slide-active")
    .evaluate((e) => e.textContent);
  await page.getByRole("button", { name: "Next design study" }).click();
  await page.waitForTimeout(800);
  assert.notEqual(
    await page
      .locator(".portfolio-swiper .swiper-slide-active")
      .evaluate((e) => e.textContent),
    active,
    "Portfolio slide did not change",
  );
  await page.locator(".reviews-swiper").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Next review placeholder" }).click();
  await page.waitForTimeout(800);
  assert.equal(
    await page
      .locator(".reviews-swiper .swiper-slide-active")
      .evaluate((e) => e === e.parentNode.children[1]),
    true,
  );
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: "Return to page top" }).click();
  await page.waitForTimeout(1200);
  assert.ok(
    (await page.evaluate(() => scrollY)) < 5,
    "Motion scroll control failed",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .locator(".header nav")
    .getByRole("link", { name: "Process", exact: true })
    .click();
  await page.waitForTimeout(1100);
  assert.ok(
    (await page.locator(".pin-spacer").count()) > 0,
    "GSAP pin missing",
  );
  await page.locator("#services").scrollIntoViewIfNeeded();
  await page.getByRole("link", { name: "Explore the service" }).first().click();
  await page.waitForURL("**/services/custom-theme-development/");
  await page.goBack({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  assert.ok(
    (await page
      .locator("main")
      .evaluate((e) => Number(getComputedStyle(e).opacity))) > 0.9,
    "Back navigation restored an invisible page",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  assert.equal(
    await page.locator(".webgl-bag").count(),
    0,
    "Reduced motion must remove 3D",
  );
  assert.equal(
    await page.locator("html").evaluate((e) => e.classList.contains("lenis")),
    false,
    "Reduced motion must restore native scrolling",
  );
  assert.equal(
    await page.locator(".hero-word").count(),
    0,
    "SplitType must revert",
  );
  assert.deepEqual(errors, []);
  console.log(
    "R3F/Three/Drei, Lenis, SplitType, both Swipers, Motion control, and reduced-motion cleanup passed",
  );
} finally {
  await browser.close();
}
