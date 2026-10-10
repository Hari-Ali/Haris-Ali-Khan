# HUR Solution — premium Shopify & digital studio

A complete multi-page editorial redesign for Haris Ali Khan. Built with Vite, semantic HTML, CSS, JavaScript, GSAP/ScrollTrigger, and locally served Manrope ExtraBold, DM Sans, and IBM Plex Mono. The visual system uses ink charcoal, mineral blue, off-white, and contrasting paper sections.

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
- `src/style.css`: baseline components, accessibility, library islands, and motion fallbacks.
- `src/atelier.css`: the complete editorial art direction, typography, asymmetric service compositions, and responsive layouts.
- `src/main.js`: menus, tabs, accessible controls, GSAP effects, and enquiry preparation.
- `src/site-config.js`: verified contact email; booking URL and form endpoint remain unconfigured.

`index.html`, `services/*/index.html`, `journal/*/index.html`, and the case-study framework are generated files. Make content edits in the template/data modules and run `npm run generate` instead of editing outputs directly.

## Honest placeholders

Client-logo slots, case-story fields, testimonial/video layouts, social profiles, and package terms are visibly labeled placeholders. No competitor client, review, ranking, performance metric, or price is claimed as HUR's. Forme and Assembly remain original design studies, not delivered client projects. Statistics are omitted until verified. Package prices say **Request a Quote**, with project/retainer tabs and a proposed-scope comparison.

The pasted competitor HTML and full redesign brief guide section order and content density. Both live websites remained blocked by the environment's proxy, and the brief's referenced mobile screenshot was not attached. Existing HUR source copy and verified contact details are retained; current live-site projects and indexed URLs could not be audited.

The six requested service categories are included. Final technical feasibility, checkout-plan limitations, payment terms, delivery, and support are confirmed in the project scope. Before replacing the live site, review final business content, inventory existing URLs, map redirects, and connect Search Console.

## Contact and booking

Book a Call links into contact until a booking URL is provided. The form includes name, reply email, website, service, budget, timeline, project details, and the selected pricing framework. It prepares a mailto draft to `alikhanharis515@gmail.com`; it does not send, store, or transmit enquiries automatically. A copy fallback is available. Direct web submissions need a verified backend endpoint and implementation. Social icons have no unverified destination links.

## Motion libraries and accessibility

Each library owns a separate responsibility:

- **GSAP + ScrollTrigger**: main entrances, page exits/entrances, viewport reveals, timeline progress, desktop process pinning, and storefront storytelling.
- **SplitType**: accessible word-level hero reveals; the original heading is preserved as its accessible name and splitting is reverted for reduced motion.
- **Lenis**: desktop wheel smoothing tied to GSAP’s ticker and ScrollTrigger updates. Touch scrolling stays native; reduced motion removes Lenis. Menus and textareas keep native nested scrolling.
- **Three.js + React Three Fiber + Drei**: a real extruded Shopify bag with modeled handles, separate side materials, SVG-derived logo geometry, a PerspectiveCamera, studio lighting, and ContactShadows. The scene is a lazy React island; semantic page content remains prerendered HTML.
- **Motion for React**: a scroll-aware return-to-top component with controlled presence/hover/press transitions, loaded only after scrolling.
- **Swiper**: accessible, non-autoplay portfolio/review sliders with touch gestures, keyboard navigation, pagination, and previous/next controls, loaded near their sections.

Desktop 3D loads on idle when visible. Mobile offers **Explore in 3D** so the initial load remains light. The mobile scene uses DPR 1 and omits contact shadows; desktop DPR is capped at 1.5. Rendering stops offscreen or in hidden tabs. Reduced-motion users and browsers without WebGL retain the static bag/storefront illustration. No external model, texture, or HDR download is needed. The heavy Three.js scene is a separate dynamic chunk, not part of initial page JavaScript.

Native content, pricing, FAQ, contact, and the requested section order remain intact. GSAP owns page motion, R3F owns the 3D object, Motion owns its button, and Swiper owns slides; effects are not layered over the same transforms. Ordinary touch scrolling is preserved. The mobile menu retains focus containment, Escape dismissal, inert background content, and focus restoration. Tabs support arrow/Home/End keys; FAQ retains native details semantics and reduced-motion fallback. No-JavaScript navigation/email remains available.

## SEO

Each service and guide has its own title, description, canonical, Open Graph metadata, and descriptive URL. Organization metadata is used on the homepage; Article metadata is used for guides. Sitemap includes ten real content URLs and excludes the noindex placeholder case study. No review, rating, or ineligible FAQ rich-result claims are generated. Manrope, DM Sans, and IBM Plex Mono licenses are retained in their packages. The unused legacy Satoshi asset retains its attribution in `public/fonts/NOTICE.txt`. The site is not affiliated with Shopify.

## Browser tests

With Chromium installed and production preview running:

```sh
npm test
```

`CHROME_PATH` overrides `/usr/bin/chromium`; `TEST_URL` overrides `http://127.0.0.1:4173`. Checks cover 1440, 1024, 768, 390, 375, and 320px layouts; section order; all seven steps/six services; mobile navigation; pricing/stage keyboard controls; FAQ; full email draft; all ten detail pages; metadata; and the no-JavaScript fallback. Lab performance scores do not establish deployed Core Web Vitals or search rankings.


The dedicated library test is `npm run test:motion`. It verifies actual WebGL rendering using Chromium’s software renderer, Lenis activation, SplitType markup, both Swipers, Motion’s scroll control, and runtime reduced-motion cleanup. Browser lab measurements depend on rendering support and hardware; production Core Web Vitals must be checked after deployment.

Latest mobile lab audit after the editorial overhaul: **96 performance, 100 accessibility, 100 best practices, 100 SEO**; LCP 1.9s, TBT 150ms, CLS 0.044. This measures the initial mobile experience before opting into 3D; desktop automatically loads the WebGL scene. The separate WebGL test validates the real renderer, while deployed GPU performance and field Core Web Vitals remain to be measured.
