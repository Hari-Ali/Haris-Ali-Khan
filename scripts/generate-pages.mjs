import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { services, steps, faqs, articles } from "./site-content.mjs";
import { arrow, escape, head, header, footer, end } from "./templates.mjs";
const icon = (i) =>
  `<svg class="service-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${['<rect x="7" y="8" width="26" height="24" rx="1"/><path d="M7 15h26M15 15v17"/>', '<path d="m14 10-10 10 10 10m12-20 10 10-10 10m-3-24-6 28"/>', '<circle cx="20" cy="20" r="14"/><path d="m20 20 9-9M9 20h3m8 8v3"/>', '<path d="M5 7h4l4 20h18l4-14H10M17 32h1m11 0h1"/>', '<rect x="3" y="7" width="12" height="26" rx="2"/><rect x="25" y="7" width="12" height="26" rx="2"/><path d="M15 17h10m-10 7h10"/>', '<path d="M8 22v-4a12 12 0 0 1 24 0v4M8 17H4v12h7V17H8m24 0h4v12h-7V17h3m0 12c0 5-6 5-9 5"/>'][i]}</svg>`;
const serviceArt = () => '';
function pricing(mode) {
  const names = ["Starter", "Professional", "Enterprise"];
  const descriptions =
    mode === "project"
      ? [
          "A focused fix, setup, or refinement.",
          "A connected storefront experience.",
          "A build shaped around complex requirements.",
        ]
      : [
          "A place for recurring small improvements.",
          "A framework for ongoing storefront refinement.",
          "A framework for larger continuous development.",
        ];
  return `<div class="pricing-grid">${names.map((name, i) => `<article class="price-card ${i === 1 ? "price-featured" : ""}"><div class="price-top"><span>0${i + 1}</span><span>${i === 1 ? "BROADER SCOPE" : "SCOPE FRAMEWORK"}</span></div><h3>${name}</h3><p>${descriptions[i]}</p><strong>Request a Quote</strong><small>${mode === "project" ? "ONE-TIME PROJECT" : "MONTHLY RETAINER"} / TERMS TO CONFIRM</small><ul>${(i === 0 ? ["Defined priorities", "Agreed delivery window", "Scoped review rounds"] : i === 1 ? ["Connected page experience", "Custom features by scope", "Testing & handover planning"] : ["Complex feature planning", "Integration review", "Agreed support approach"]).map((f) => `<li>${f}</li>`).join("")}</ul><a class="button ${i === 1 ? "primary" : "outline"}" href="#contact" data-enquiry-plan="${name} / ${mode}">Discuss ${name} ${arrow}</a></article>`).join("")}</div>`;
}
let template = readFileSync("src/home.html", "utf8");
const parts = {
  HEAD: head(
    "HUR Solution | Shopify & Web Development",
    "HUR Solution by Haris Ali Khan. Shopify storefronts, custom web design, and thoughtful development for ambitious brands. Tell us about your next project.",
    "/",
    {
      schema: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "HUR Solution",
        url: "https://hursolution.com/",
        email: "alikhanharis515@gmail.com",
        founder: { "@type": "Person", name: "Haris Ali Khan" },
      },
    },
  ),
  HEADER: header(),
  FOOTER: footer(),
  END: end,
  ARROW: arrow,
  PROCESS: steps
    .map(
      ([title, description], i) =>
        `<article class="timeline-item reveal"><span class="timeline-number">0${i + 1}</span><div><h3>${title}</h3><p>${description}</p></div><span class="timeline-dot" aria-hidden="true"></span></article>`,
    )
    .join(""),
  SERVICES: services
    .map(
      (s, i) =>
        `<article class="service-panel service service-${i} reveal"><div class="service-panel-top"><span>0${i + 1} / ${s.tag}</span>${icon(i)}</div>${serviceArt(i)}<div class="service-content"><h3>${s.title}</h3><p>${s.description}</p><details class="service-scope"><summary>Possible scope +</summary><ul>${s.features.map((f) => `<li>${escape(f)}</li>`).join("")}</ul></details><a href="/services/${s.slug}/">Explore the service <span class="service-arrow">${arrow}</span></a></div></article>`,
    )
    .join(""),
  FAQ: faqs
    .map(
      ([q, a]) =>
        `<details><summary>${escape(q)}<b aria-hidden="true">+</b></summary><div class="accordion-content"><p>${escape(a)}</p></div></details>`,
    )
    .join(""),
  PRICING_PROJECT: pricing("project"),
  PRICING_RETAINER: pricing("retainer"),
  ARTICLES: articles
    .map(
      (a, i) =>
        `<article class="journal-card reveal"><span class="journal-number">0${i + 1}</span><span class="eyebrow">${a.category}</span><h3><a href="/journal/${a.slug}/">${a.title}</a></h3><p>${a.description}</p><a class="journal-link" href="/journal/${a.slug}/">Read article ${arrow}</a></article>`,
    )
    .join(""),
};
for (const [key, value] of Object.entries(parts))
  template = template.replaceAll(`{{${key}}}`, value);
writeFileSync("index.html", template);
function save(path, html) {
  mkdirSync(path, { recursive: true });
  writeFileSync(`${path}/index.html`, html);
}
for (const s of services) {
  const path = `/services/${s.slug}/`;
  save(
    `services/${s.slug}`,
    head(`${s.title} | HUR Solution`, s.description, path) +
      header(false) +
      `<main id="main" class="detail-page wrap"><div class="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/#services">Services</a><span>/ ${s.title}</span></div><span class="eyebrow">${s.tag}</span><h1>${s.title}</h1><p class="detail-lead">${s.description}</p><div class="detail-columns"><section><h2>A considered approach.</h2><p>${s.detail}</p><h2>Discuss your scope.</h2><p>Share your current storefront, the outcome you need, and any timing constraints. We confirm technical feasibility, deliverables, and fees before work begins.</p><a href="/#contact" class="button primary">Discuss a project ${arrow}</a></section><aside><span class="eyebrow">POSSIBLE SCOPE</span><ul>${s.features.map((f) => `<li>${escape(f)}</li>`).join("")}</ul><p>Final deliverables and support terms are defined in your proposal.</p><a href="/#services">Explore all services ${arrow}</a></aside></div></main>` +
      footer() +
      end,
  );
}
for (const a of articles) {
  const path = `/journal/${a.slug}/`;
  save(
    `journal/${a.slug}`,
    head(`${a.title} | HUR Journal`, a.description, path, {
      type: "article",
      schema: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.description,
        author: { "@type": "Person", name: "Haris Ali Khan" },
        publisher: {
          "@type": "Organization",
          name: "HUR Solution",
          url: "https://hursolution.com/",
        },
        mainEntityOfPage: `https://hursolution.com${path}`,
      },
    }) +
      header(false) +
      `<main id="main" class="detail-page article-page wrap"><div class="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/#journal">Journal</a></div><span class="eyebrow">${a.category} / HUR JOURNAL</span><h1>${a.title}</h1><p class="detail-lead">${a.description}</p><p class="article-author">BY HARIS ALI KHAN / ${Math.max(
        2,
        Math.ceil(
          a.sections
            .map((s) => s[1])
            .join(" ")
            .split(" ").length / 180,
        ),
      )} MIN READ</p><div class="article-content">${a.sections.map(([h, p]) => `<section><h2>${h}</h2><p>${p}</p></section>`).join("")}<div class="article-end"><p>Have a storefront question?</p><a class="button primary" href="/#contact">Discuss your project ${arrow}</a></div></div></main>` +
      footer() +
      end,
  );
}
save(
  "case-studies/project-template",
  head(
    "Project Case Study Framework | HUR Solution",
    "An editable framework for a verified HUR Solution project. Client details and outcomes are pending.",
    "/case-studies/project-template/",
    { noindex: true },
  ) +
    header(false) +
    `<main id="main" class="detail-page wrap"><div class="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/#cases">Case studies</a></div><span class="placeholder-label">EDITABLE FRAMEWORK / NOT A CLIENT CLAIM</span><h1>Your verified<br>project story.</h1><p class="detail-lead">This page is intentionally excluded from indexing until verified project details are supplied.</p><div class="case-template-image"><span>PROJECT SCREENSHOT / PLACEHOLDER</span></div><div class="detail-columns"><section><h2>The Challenge</h2><p>Add the actual brief, business problem, and constraints.</p><h2>What We Built</h2><p>Describe the features, design decisions, and implementation HUR Solution genuinely delivered.</p><h2>The Result</h2><p>Include supported outcomes and their evidence. Add measured figures only if verified.</p></section><aside><span class="eyebrow">PROJECT DETAILS</span><ul><li>Client / To confirm</li><li>Industry / To confirm</li><li>Services / To confirm</li><li>Live website / To confirm</li></ul><a href="/#contact">Discuss a project ${arrow}</a></aside></div></main>` +
    footer() +
    end,
);
const urls = [
  "/",
  ...services.map((s) => `/services/${s.slug}/`),
  ...articles.map((a) => `/journal/${a.slug}/`),
];
writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>https://hursolution.com${path}</loc></url>`).join("")}</urlset>`,
);
