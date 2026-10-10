export const arrow =
  '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
export const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export const nav = [
  ["Studio", "#studio"],
  ["Process", "#process"],
  ["Expertise", "#services"],
  ["Work", "#work"],
  ["Cases", "#cases"],
  ["FAQ", "#faq"],
  ["Pricing", "#pricing"],
];
export function header(home = true) {
  const base = home ? "" : "/";
  return `<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="header wrap"><a class="logo" href="/" aria-label="HUR Solution home">hur <span>solution</span></a><nav aria-label="Main navigation">${nav.map(([n, id]) => `<a href="${base}${id}">${n}</a>`).join("")}</nav><a class="header-cta magnetic" href="${base}#contact">Book a Call ${arrow}</a><button class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation"><span></span><span></span></button></div></header><div id="mobile-menu" class="mobile-menu" hidden><nav aria-label="Mobile navigation">${nav.map(([n, id], i) => `<a href="${base}${id}"><small>0${i + 1}</small>${n}${arrow}</a>`).join("")}</nav><a class="button primary" href="${base}#contact">Discuss a project ${arrow}</a><a class="menu-email" href="mailto:alikhanharis515@gmail.com">alikhanharis515@gmail.com</a></div><noscript><div class="nojs-note wrap">Browse: <a href="/#studio">Studio</a> · <a href="/#services">Services</a> · <a href="/#work">Work</a> · <a href="/#pricing">Pricing</a> · <a href="mailto:alikhanharis515@gmail.com">Email HUR Solution</a></div><style>#brief-form{display:none}</style></noscript>`;
}
export function footer() {
  return `<footer class="footer-shell"><div class="wrap footer-grid"><div><a class="logo" href="/">hur <span>solution</span></a><p>Independent design & development.<br>Digital, with distinction.</p></div><div><span class="eyebrow">SERVICES</span><a href="/services/custom-theme-development/">Shopify themes</a><a href="/services/liquid-development/">Liquid development</a><a href="/services/speed-performance/">Performance</a></div><div><span class="eyebrow">EXPLORE</span><a href="/#work">Design studies</a><a href="/#cases">Case studies</a><a href="/#journal">Journal</a><a href="/#process">Our process</a></div><div><span class="eyebrow">GET IN TOUCH</span><a href="mailto:alikhanharis515@gmail.com">alikhanharis515@gmail.com</a><a href="/#contact">Project enquiry ${arrow}</a><span class="footer-note">Social profiles pending confirmation.</span><div class="social-placeholders" aria-label="Social profile placeholders"><span title="LinkedIn URL pending" role="img" aria-label="LinkedIn profile placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m0-10v1m5 9v-7m0 3c0-4 5-4 5 0v4"/></svg></span><span title="GitHub URL pending" role="img" aria-label="GitHub profile placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 20c-5 1-5-2-7-2m14 3v-4c2-1 4-3 4-6 0-2-1-3-2-4V3l-4 2h-4L6 3v4c-1 1-2 2-2 4 0 3 2 5 4 6v4"/></svg></span></div></div></div><div class="wrap oversized-wordmark" aria-hidden="true">HUR SOLUTION</div><div class="wrap footer-bottom"><span>© <span id="year"></span> HUR Solution</span><span>DESIGNED WITH INTENTION.</span><a href="#">Back to top ↑</a></div></footer>`;
}
export function head(
  title,
  description,
  path,
  { noindex = false, type = "website", schema = null } = {},
) {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#09090B"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="https://hursolution.com${path}">${noindex ? '<meta name="robots" content="noindex,follow">' : ""}<meta property="og:type" content="${type}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="https://hursolution.com${path}"><meta property="og:image" content="https://hursolution.com/social-card.png"><meta name="twitter:card" content="summary_large_image"><link rel="preload" href="/fonts/Satoshi-Variable.woff2" as="font" type="font/woff2" crossorigin><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/src/style.css">${schema ? `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>` : ""}</head><body>`;
}
export const end =
  '<script type="module" src="/src/main.js"></script></body></html>';
