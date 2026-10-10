# HUR Solution — independent design & development studio

An editorial agency website for Haris Ali Khan. Built with Vite, HTML/CSS/JavaScript, and GSAP. Charcoal and off-white with restrained blue accents; Satoshi headings and Inter UI/body text are served locally.

## Development

Node.js 22.12+ is required; this environment uses Node.js 24.

```sh
npm ci --cache /tmp/haris-npm-cache --no-audit --no-fund
npm run dev -- --port 5173
npm run build
npm run preview -- --port 4173
```

Deploy the generated `dist/` directory to a static host. No backend secrets are required.

## Motion

GSAP handles masked headline entrances, ScrollTrigger reveals, subtle project parallax, anchor scrolling using ScrollToPlugin, magnetic CTAs, service hover responses, and gently floating Shopify bag artwork. Ordinary wheel/touch scrolling stays native. The bag uses CSS 3D surfaces and an inline vector mark, with no WebGL/model download. Continuous motion pauses offscreen and in hidden tabs. Reduced-motion preferences disable animations and preserve native navigation. Fine-pointer effects are disabled on touch devices.

## Content & enquiries

Enquiries prepare an email draft addressed to `alikhanharis515@gmail.com`; they are not sent or stored. A copy fallback is available. A hosted endpoint is required for direct browser submissions.

Forme and Assembly are expressly identified as design studies, not completed client projects. Confirm service descriptions and replace concepts with verified project information before launch. The website is not affiliated with Shopify.

The supplied competitor and existing live site were blocked by environment network policy. This design is original; current-site content and indexed URLs have not been audited. Before replacing the live site, inventory its URLs, map redirects, review canonical/metadata, and connect Search Console.

## Fonts & SEO

Satoshi is designed by Deni Anggara / Indian Type Foundry. See `public/fonts/NOTICE.txt` for attribution and source. Inter is included through @fontsource, with its license retained in that package.

SEO includes semantic HTML, a canonical URL for https://hursolution.com/, Organization JSON-LD, page/social metadata, a social preview PNG, favicon, robots.txt, and sitemap.xml. These are foundations; search rankings are not guaranteed.

## Validation

Production build passed. Chromium functional checks at 1440px, 768px, 390px, and 320px verified local fonts, no horizontal overflow, GSAP anchor navigation, accordion behavior, and correctly encoded email enquiries. Reduced-motion checks verified a static bag and usable native navigation. No JavaScript errors were observed.

A local mobile Lighthouse audit scored 100 for performance, accessibility, best practices, and SEO, with LCP 1.5s, TBT 20ms, and CLS 0.013. These are lab results, not deployed Core Web Vitals.

## Editing

- `index.html`: content, semantic structure, inline bag mark, contact settings, metadata.
- `src/style.css`: typography, layouts, CSS 3D bag, responsive states.
- `src/main.js`: GSAP effects, reduced-motion handling, enquiry preparation.
- `public/`: local Satoshi font, previews, favicon, sitemap, robots.txt.
