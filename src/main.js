import "@fontsource/manrope/latin-800.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  enableSmoothScroll,
  disableSmoothScroll,
  scrollTo,
  startScroll,
  stopScroll,
} from "./motion/scroll";
import { siteConfig } from "./site-config";
gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add("js-enhanced");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const mm = gsap.matchMedia();
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
const header = document.querySelector(".site-header");
ScrollTrigger.create({
  start: 40,
  end: "max",
  onUpdate: (self) => header?.classList.toggle("scrolled", self.scroll() > 40),
});
const menu = document.querySelector("#mobile-menu");
const menuButton = document.querySelector(".menu-toggle");
let menuOpen = false;
let previousOverflow = "";
let menuTween;
const main = document.querySelector("main");
const footer = document.querySelector(".footer-shell");
const menuClose = document.createElement("button");
menuClose.className = "menu-close";
menuClose.type = "button";
menuClose.textContent = "Close navigation ×";
menu?.prepend(menuClose);
if (menu) {
  menu.setAttribute("data-lenis-prevent", "");
  menu.setAttribute("role", "dialog");
  menu.setAttribute("aria-label", "Site navigation");
  menu.setAttribute("aria-modal", "true");
}
function closeMenu({ immediate = false, restore = true } = {}) {
  if (!menuOpen) return;
  menuOpen = false;
  startScroll();
  menuButton.setAttribute("aria-expanded", "false");
  menuTween?.kill();
  const finish = () => {
    menu.hidden = true;
    gsap.set(menu, { clearProps: "opacity,transform" });
    document.body.style.overflow = previousOverflow;
    main.inert = false;
    footer.inert = false;
    header.inert = false;
    if (restore) menuButton.focus();
  };
  if (immediate || reduced.matches) finish();
  else
    menuTween = gsap.to(menu, {
      opacity: 0,
      y: -8,
      duration: 0.25,
      ease: "power2.in",
      onComplete: finish,
    });
}
function openMenu() {
  menuOpen = true;
  stopScroll();
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  menu.hidden = false;
  menuButton.setAttribute("aria-expanded", "true");
  main.inert = true;
  footer.inert = true;
  header.inert = true;
  menuTween?.kill();
  if (!reduced.matches) {
    menuTween = gsap.fromTo(
      menu,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
    );
    gsap.fromTo(
      menu.querySelectorAll("nav a"),
      { opacity: 0, y: 13 },
      { opacity: 1, y: 0, stagger: 0.035, duration: 0.45, ease: "power3.out" },
    );
  }
  menuClose.focus();
}
menuButton?.addEventListener("click", () =>
  menuOpen ? closeMenu() : openMenu(),
);
menuClose.addEventListener("click", () => closeMenu());
menu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu({ immediate: true, restore: false });
});
document.addEventListener("keydown", (event) => {
  if (!menuOpen) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    return;
  }
  if (event.key === "Tab") {
    const focusable = [
      ...menu.querySelectorAll("a[href],button:not([disabled])"),
    ];
    const first = focusable[0],
      last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
matchMedia("(min-width:1001px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu({ immediate: true });
});
// Progressive enhancement: controls remain usable with native details/links.
function setupTabs(selector, onChange) {
  const tabs = [...document.querySelectorAll(selector)];
  if (!tabs.length) return () => {};
  function activate(tab, { focus = false } = {}) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
    onChange?.(tab);
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      let index;
      if (event.key === "ArrowRight") index = (i + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        index = (i - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") index = 0;
      else if (event.key === "End") index = tabs.length - 1;
      if (index !== undefined) {
        event.preventDefault();
        activate(tabs[index], { focus: true });
      }
    });
  });
  return (index) => activate(tabs[index]);
}
const selectStage = setupTabs("[data-stage]", (tab) => {
  if (!reduced.matches)
    gsap.fromTo(
      document.getElementById(tab.getAttribute("aria-controls")),
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" },
    );
  document
    .querySelectorAll("[data-story-stage]")
    .forEach((story) =>
      story.classList.toggle(
        "active",
        story.dataset.storyStage === tab.dataset.stage,
      ),
    );
});
setupTabs("[data-pricing-mode]", (tab) => {
  if (!reduced.matches)
    gsap.fromTo(
      document.getElementById(tab.getAttribute("aria-controls")),
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
    );
  ScrollTrigger.refresh();
});
const animateDetails = new WeakMap();
document.querySelectorAll(".faq-list details").forEach((details) => {
  const summary = details.querySelector("summary");
  const content = details.querySelector(".accordion-content");
  if (!content) return;
  summary.addEventListener("click", (event) => {
    if (reduced.matches) return;
    event.preventDefault();
    const expanding = !details.open || details.dataset.closing === "true";
    animateDetails.get(details)?.kill();
    delete details.dataset.closing;
    if (expanding) {
      const wasOpen = details.open;
      details.open = true;
      gsap.set(content, {
        height: wasOpen ? content.getBoundingClientRect().height : 0,
      });
      animateDetails.set(
        details,
        gsap.to(content, {
          height: content.scrollHeight,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(content, { clearProps: "height" });
            ScrollTrigger.refresh();
          },
        }),
      );
    } else {
      details.dataset.closing = "true";
      animateDetails.set(
        details,
        gsap.to(content, {
          height: 0,
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => {
            details.open = false;
            delete details.dataset.closing;
            gsap.set(content, { clearProps: "height" });
            ScrollTrigger.refresh();
          },
        }),
      );
    }
  });
});
reduced.addEventListener("change", () => {
  document.querySelectorAll(".accordion-content").forEach((content) => {
    gsap.killTweensOf(content);
    gsap.set(content, { clearProps: "height" });
  });
  document.querySelectorAll(".faq-list details").forEach((d) => {
    if (d.dataset.closing) {
      d.open = false;
      delete d.dataset.closing;
    }
  });
});
const scene = document.querySelector(".scene");
mm.add("(prefers-reduced-motion: no-preference)", () => {
  const cleanup = [];
  enableSmoothScroll();
  if (document.querySelector(".detail-page"))
    gsap.from(".detail-page", {
      opacity: 0,
      y: 12,
      duration: 0.65,
      ease: "power3.out",
    });
  cleanup.push(disableSmoothScroll);
  if (document.querySelector(".hero")) {
    const heading = document.querySelector(".hero h1");
    heading.setAttribute(
      "aria-label",
      heading.textContent.replace(/\s+/g, " ").trim(),
    );
    const split = new SplitType(heading, {
      types: "words",
      wordClass: "hero-word",
    });
    split.words.forEach((word) => word.setAttribute("aria-hidden", "true"));
    cleanup.push(() => {
      split.revert();
      heading.removeAttribute("aria-label");
    });
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .from(
        ".hero-word",
        { yPercent: 110, duration: 0.95, stagger: 0.07 },
        0.05,
      )
      .from(
        ".hero-top,.hero-description,.hero-actions",
        { opacity: 0, y: 14, duration: 0.75, stagger: 0.1 },
        0.3,
      )
      .from(".bag-float", { opacity: 0, rotationY: -15, duration: 1.2 }, 0.15)
      .from(
        ".hero-store-window",
        { opacity: 0, y: 17, rotation: -7, duration: 0.9 },
        0.7,
      )
      .from(
        ".hero-expertise,.hero-bottom",
        { opacity: 0, duration: 0.7 },
        0.85,
      );
  }
  gsap.utils.toArray(".reveal").forEach((element) =>
    gsap.from(element, {
      y: 20,
      opacity: 0,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 94%", once: true },
    }),
  );
  // Scrub the storefront into its resting composition; no perpetual motion.
  if (document.querySelector(".hero-store-window")) {
    gsap.to(".hero-store-window", {
      rotation: 0, y: -22, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
    });
  }
  document.querySelectorAll(".service-art svg").forEach((art) => {
    const paths = [...art.querySelectorAll("path")].filter(path => path.getTotalLength() > 80);
    paths.forEach(path => {
      const length = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
        strokeDashoffset: 0, duration: 1.1, ease: "power2.out",
        scrollTrigger: { trigger: art, start: "top 85%", once: true },
        onComplete: () => gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" }),
      });
    });
  });
  const track = document.querySelector(".timeline");
  if (track) {
    gsap.to(".timeline-progress", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: track,
        start: "top 75%",
        end: "bottom 55%",
        scrub: 0.5,
      },
    });
    document.querySelectorAll(".timeline-item").forEach((item) =>
      ScrollTrigger.create({
        trigger: item,
        start: "top 75%",
        end: "bottom 35%",
        toggleClass: "active",
      }),
    );
  }
  document.querySelectorAll("[data-story-stage]").forEach((story) =>
    ScrollTrigger.create({
      trigger: story,
      start: "top 78%",
      onEnter: () => selectStage(Number(story.dataset.storyStage)),
      onEnterBack: () => selectStage(Number(story.dataset.storyStage)),
    }),
  );
  const clickHandler = (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (
      !link ||
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const id = link.getAttribute("href");
    const target = id === "#" ? 0 : document.getElementById(id.slice(1));
    if (target === null) return;
    event.preventDefault();
    closeMenu({ immediate: true, restore: false });
    scrollTo(target, {
      onComplete: () => {
        history.pushState(null, "", id);
        if (target instanceof HTMLElement) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.addEventListener(
            "blur",
            () => target.removeAttribute("tabindex"),
            { once: true },
          );
        }
      },
    });
  };
  document.addEventListener("click", clickHandler);
  return () => {
    document.removeEventListener("click", clickHandler);
    cleanup.forEach((fn) => fn());
  };
});
mm.add(
  "(min-width:1001px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
  () => {
    const cleanups = [];
    const processLayout = document.querySelector(".process-layout");
    const processIntro = document.querySelector(".process-intro");
    if (processLayout && processIntro) {
      gsap.set(processIntro, { position: "relative", top: 0 });
      ScrollTrigger.create({
        trigger: processLayout,
        start: "top 110px",
        end: () =>
          "+=" +
          Math.max(0, processLayout.offsetHeight - processIntro.offsetHeight),
        pin: processIntro,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
    }

    document.querySelectorAll(".magnetic").forEach((button) => {
      const move = (event) => {
        const r = button.getBoundingClientRect();
        gsap.to(button, {
          x: (event.clientX - r.left - r.width / 2) * 0.1,
          y: (event.clientY - r.top - r.height / 2) * 0.13,
          duration: 0.35,
          ease: "power2.out",
        });
      };
      const leave = () =>
        gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
      button.addEventListener("pointermove", move);
      button.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        button.removeEventListener("pointermove", move);
        button.removeEventListener("pointerleave", leave);
      });
    });
    document.querySelectorAll(".service-panel").forEach((card) => {
      const enter = () =>
        gsap.to(card.querySelector(".service-arrow"), {
          x: 4,
          y: -4,
          duration: 0.35,
          ease: "power3.out",
        });
      const leave = () =>
        gsap.to(card.querySelector(".service-arrow"), {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        });
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointerleave", leave);
      });
    });
    gsap.utils.toArray(".work-image").forEach((image) => {
      const object = image.querySelector(".chair-object,.assembly-art");
      if (object)
        gsap.fromTo(
          object,
          { y: 8 },
          {
            y: -8,
            ease: "none",
            scrollTrigger: {
              trigger: image,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  },
);
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting)
        document.querySelectorAll(".header nav a").forEach((link) => {
          if (link.hash === `#${entry.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
    });
  },
  { rootMargin: "-15% 0px -60% 0px" },
);
sections.forEach((s) => observer.observe(s));
document
  .querySelectorAll("textarea,.comparison-wrap")
  .forEach((element) => element.setAttribute("data-lenis-prevent", ""));
const form = document.querySelector("#brief-form");
document.querySelectorAll("[data-enquiry-plan]").forEach((link) =>
  link.addEventListener("click", () => {
    if (form) form.dataset.plan = link.dataset.enquiryPlan;
  }),
);
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const brief = document.querySelector("#project-brief").value.trim();
    if (!brief) {
      document
        .querySelector("#project-brief")
        .setCustomValidity("Please describe your project.");
      document.querySelector("#project-brief").reportValidity();
      return;
    }
    const value = (id) =>
      document.querySelector(id)?.value.trim() || "Not provided";
    const service = value("#project-type");
    document.querySelector("#prepared-brief").value =
      `Project enquiry for HUR Solution\nName: ${value("#client-name")}\nReply email: ${value("#reply-email")}\nWebsite: ${value("#store-url")}\nService: ${service}\nScope framework: ${form.dataset.plan || "Not selected"}\nBudget: ${value("#project-budget")}\nTimeline: ${value("#project-timeline")}\n\n${brief}`;
    document.querySelector("#email-enquiry").href =
      `mailto:${siteConfig.email}?subject=${encodeURIComponent("Project enquiry — " + service)}&body=${encodeURIComponent(document.querySelector("#prepared-brief").value)}`;
    document.querySelector("#brief-result").hidden = false;
    document.querySelector("#prepared-brief").focus();
    ScrollTrigger.refresh();
  });
  document
    .querySelector("#project-brief")
    .addEventListener("input", (event) => event.target.setCustomValidity(""));
  document.querySelector("#copy-brief").addEventListener("click", async () => {
    const text = document.querySelector("#prepared-brief");
    try {
      await navigator.clipboard.writeText(text.value);
      document.querySelector("#copy-status").textContent =
        "Copied. Your brief has not been sent.";
    } catch {
      text.focus();
      text.select();
      document.querySelector("#copy-status").textContent =
        "Select and copy the brief manually.";
    }
  });
}
const libraryCleanup = [];
window.addEventListener("hur:scroll-top", () => scrollTo(0, { offset: 0 }));
let sceneUnmount;
let sceneLoading = false;
async function loadScene() {
  if (
    !scene ||
    reduced.matches ||
    sceneUnmount ||
    sceneLoading ||
    document.hidden
  )
    return;
  sceneLoading = true;
  try {
    const canvas = document.createElement("canvas");
    const supported = canvas.getContext("webgl2");
    if (!supported) return;
    supported.getExtension("WEBGL_lose_context")?.loseContext();
    const { mountShopifyScene } = await import("./motion/ShopifyScene.jsx");
    if (!reduced.matches) sceneUnmount = mountShopifyScene(scene);
  } catch (error) {
    console.warn(
      "3D unavailable; keeping the static storefront illustration.",
      error,
    );
  } finally {
    sceneLoading = false;
  }
}
if (scene) {
  const optIn = document.createElement("button");
  optIn.type = "button";
  optIn.className = "explore-three";
  optIn.textContent = "Explore in 3D";
  optIn.hidden = reduced.matches || matchMedia("(min-width:1001px)").matches;
  scene.append(optIn);
  optIn.addEventListener("click", () => {
    optIn.disabled = true;
    loadScene().finally(() => {
      optIn.hidden = !!sceneUnmount;
      optIn.disabled = false;
    });
  });
  const observer3d = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        matchMedia("(min-width:1001px)").matches &&
        !navigator.connection?.saveData
      ) {
        const schedule =
          window.requestIdleCallback || ((fn) => setTimeout(fn, 400));
        schedule(loadScene, { timeout: 1800 });
      }
    },
    { rootMargin: "80px" },
  );
  observer3d.observe(scene);
  libraryCleanup.push(() => observer3d.disconnect());
  reduced.addEventListener("change", () => {
    optIn.hidden = reduced.matches;
    if (reduced.matches) {
      sceneUnmount?.();
      sceneUnmount = undefined;
    } else if (matchMedia("(min-width:1001px)").matches) loadScene();
  });
}
let slidersLoading = false;
const sliderObserver = new IntersectionObserver(
  async (entries) => {
    if (!entries.some((entry) => entry.isIntersecting) || slidersLoading)
      return;
    slidersLoading = true;
    sliderObserver.disconnect();
    try {
      const { mountSliders } = await import("./motion/sliders");
      libraryCleanup.push(mountSliders(reduced));
      ScrollTrigger.refresh();
    } catch (error) {
      console.warn("Slider unavailable; preserving static projects", error);
    }
  },
  { rootMargin: "180px" },
);
document
  .querySelectorAll(".portfolio-swiper,.reviews-swiper")
  .forEach((element) => sliderObserver.observe(element));
libraryCleanup.push(() => sliderObserver.disconnect());
let controlLoading = false;
const loadControl = async () => {
  if (scrollY < 900 || controlLoading) return;
  controlLoading = true;
  window.removeEventListener("scroll", loadControl);
  try {
    const { mountScrollControl } = await import("./motion/ScrollControl.jsx");
    libraryCleanup.push(mountScrollControl());
  } catch (error) {
    console.warn("Optional scroll control unavailable", error);
  }
};
window.addEventListener("scroll", loadControl, { passive: true });
libraryCleanup.push(() => window.removeEventListener("scroll", loadControl));
loadControl();
// GSAP owns page exits; component and 3D transforms stay with their own libraries.
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (
    !link ||
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    link.target ||
    link.hasAttribute("download") ||
    reduced.matches
  )
    return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || url.pathname === location.pathname)
    return;
  event.preventDefault();
  gsap.to(main, {
    opacity: 0,
    y: -5,
    duration: 0.2,
    ease: "power2.in",
    onComplete: () => location.assign(url.href),
  });
});
window.addEventListener("pagehide", (event) => {
  if (event.persisted) {
    gsap.killTweensOf(main);
    gsap.set(main, { clearProps: "opacity,transform" });
    return;
  }
  observer.disconnect();
  mm.revert();
  disableSmoothScroll();
  sceneUnmount?.();
  libraryCleanup.forEach((fn) => fn());
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    gsap.set(main, { clearProps: "opacity,transform" });
    ScrollTrigger.refresh();
  }
});
