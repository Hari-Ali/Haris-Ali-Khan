import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
let lenis;
let tick;
export function enableSmoothScroll() {
  if (lenis) return;
  lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
    autoResize: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
}
export function disableSmoothScroll() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = undefined;
  tick = undefined;
}
export function scrollTo(target, { offset = -100, onComplete } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 0.9, onComplete });
    return;
  }
  const top =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + scrollY;
  window.scrollTo({ top: Math.max(0, top + offset), behavior: "instant" });
  onComplete?.();
}
export function stopScroll() {
  lenis?.stop();
}
export function startScroll() {
  lenis?.start();
}
