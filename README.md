# HUR Solution — premium Shopify & digital studio

A complete multi-page editorial redesign for Haris Ali Khan. Built with Vite, semantic HTML, CSS, JavaScript, GSAP/ScrollTrigger, and locally served Satoshi, Inter, and IBM Plex Mono. The palette is charcoal/off-white with restrained #ED176A accents and a light case-study section.

## Run and deploy

Node.js 22.12+ is required; this environment uses Node.js 24.

```sh
npm ci --cache /tmp/haris-npm-cache --no-audit --no-fund
npm run dev -- --port 5173
npm run build
npm run preview -- --port 4173
```

Build outputs the homepage, six service pages, three original journal guides, and a noindex case-study framework into `dist/`. Deploy that directory to a static host with directory-index support. `predev` and `prebuild` regenerate pages automatically. No backend credentials are required for the email-draft fallback.

## Structure and editing

The homepage keeps the requested complete sequence: hero → trust → about → seven-step process → six services → work → cases → reviews → FAQ → pricing → journal → contact → footer.

- `src/home.html`: editable homepage template; preserves the existing HUR hero, profile, design studies, FAQ, and enquiry flow.
- `scripts/site-content.mjs`: service copy, ordered process steps, FAQ answers, and original article content.
- `scripts/templates.mjs`: shared metadata, navigation, header, footer, and icon helper.
- `scripts/generate-pages.mjs`: composes the homepage and generates crawlable detail pages and sitemap.
- `src/style.css`: typography, grid, layout, materials, responsive breakpoints, and motion fallbacks.
- `src/main.js`: menus, tabs, accessible controls, GSAP effects, and enquiry preparation.
- `src/site-config.js`: verified contact email; booking URL and form endpoint remain unconfigured.

`index.html`, `services/*/index.html`, `journal/*/index.html`, and the case-study framework are generated files. Make content edits in the template/data modules and run `npm run generate` instead of editing outputs directly.

## Honest placeholders

Client-logo slots, case-story fields, testimonial/video layouts, social profiles, and package terms are visibly labeled placeholders. No competitor client, review, ranking, performance metric, or price is claimed as HUR's. Forme and Assembly remain original design studies, not delivered client projects. Statistics are omitted until verified. Package prices say **Request a Quote**, with project/retainer tabs and a proposed-scope comparison.

The pasted competitor HTML and full redesign brief guide section order and content density. Both live websites remained blocked by the environment's proxy, and the brief's referenced mobile screenshot was not attached. Existing HUR source copy and verified contact details are retained; current live-site projects and indexed URLs could not be audited.

The six requested service categories are included. Final technical feasibility, checkout-plan limitations, payment terms, delivery, and support are confirmed in the project scope. Before replacing the live site, review final business content, inventory existing URLs, map redirects, and connect Search Console.

## Contact and booking

Book a Call links into contact until a booking URL is provided. The form includes name, reply email, website, service, budget, timeline, project details, and the selected pricing framework. It prepares a mailto draft to `alikhanharis515@gmail.com`; it does not send, store, or transmit enquiries automatically. A copy fallback is available. Direct web submissions need a verified backend endpoint and implementation. Social icons have no unverified destination links.

## Motion and accessibility

The Shopify bag uses genuine CSS 3D surfaces, a vector mark, studio shading, and GSAP motion; no WebGL/model download is needed. The storefront overlay is an original design study. GSAP provides restrained masked entrances, viewport reveals, timeline progress, sequential storefront/code/responsive/check stages, anchor scrolling, and desktop-only pointer effects. Native wheel/touch scrolling is preserved. Continuous decorative motion pauses offscreen and in hidden tabs.

Reduced-motion users get static visuals and native navigation. Mobile menu uses focus containment, Escape dismissal, inert background content, and focus restoration. Pricing/stage tabs support arrow/Home/End keys and ARIA relationships. FAQ starts with native details semantics and adds reversible height animation. A no-JavaScript navigation/email fallback is available.

## SEO

Each service and guide has its own title, description, canonical, Open Graph metadata, and descriptive URL. Organization metadata is used on the homepage; Article metadata is used for guides. Sitemap includes ten real content URLs and excludes the noindex placeholder case study. No review, rating, or ineligible FAQ rich-result claims are generated. Satoshi attribution/source is in `public/fonts/NOTICE.txt`; Inter and IBM Plex Mono licenses are retained in their packages. The site is not affiliated with Shopify.

## Browser tests

With Chromium installed and production preview running:

```sh
npm test
```

`CHROME_PATH` overrides `/usr/bin/chromium`; `TEST_URL` overrides `http://127.0.0.1:4173`. Checks cover 1440, 1024, 768, 390, 375, and 320px layouts; section order; all seven steps/six services; mobile navigation; pricing/stage keyboard controls; FAQ; full email draft; all ten detail pages; metadata; and the no-JavaScript fallback. Lab performance scores do not establish deployed Core Web Vitals or search rankings.

Latest local mobile Lighthouse audit: **98 performance, 100 accessibility, 100 best practices, 100 SEO**; LCP 1.9s, TBT 100ms, CLS 0.001. The animated mobile-menu focus trap, Escape dismissal, and focus restoration were also checked. These are local lab observations, not production field measurements.
