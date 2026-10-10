# HUR Solution — digital agency website

Responsive agency website for Haris Ali Khan, built with Vite and plain HTML, CSS, and JavaScript. Includes lightweight CSS 3D artwork, pointer interaction, viewport reveals, reduced-motion support, services, concept showcases, process/FAQ accordions, and email enquiries.

## Run

Use Node.js 22.12+ (this environment uses Node.js 24).

```sh
npm ci --cache /tmp/haris-npm-cache --no-audit --no-fund
npm run dev -- --port 5173
npm run build
npm run preview -- --port 4173
```

Deploy `dist/` to a static host. No backend credentials required. Fonts are served locally. Animations pause when offscreen or in a hidden tab and are disabled for reduced-motion users.

## Enquiries

The form prepares a `mailto:` draft addressed to `alikhanharis515@gmail.com`; it does not send or store enquiries. Users can copy the brief if no email app is configured. A hosted form endpoint is needed if direct web submissions are desired.

## Content and launch

Services are proposed website copy and should be confirmed by the owner. Forma and Orbital are explicitly labeled design concepts, not completed client work. Replace with verified projects when available. Both supplied external websites were blocked by the development environment's network policy, so this is an original design, not a verified reproduction of the reference.

Technical SEO includes a canonical URL for https://hursolution.com/, metadata, Organization JSON-LD, social preview, robots.txt, and sitemap.xml. Before replacing an existing live site, inventory its indexed URLs and implement appropriate redirects, verify actual services and project claims, and connect Search Console. Rankings and live Core Web Vitals are not established by local checks.

## Edit

- `index.html`: brand copy, sections, contact address, and structured metadata.
- `src/style.css`: layouts, visual direction, responsive breakpoints, CSS 3D effects.
- `src/main.js`: interaction, visibility handling, and email draft generation.
- `public/`: favicon, social preview, sitemap, and robots.txt.
