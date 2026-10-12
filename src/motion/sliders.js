import Swiper from "swiper";
import { A11y, Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { iconMarkup } from "../icons";
export function mountSliders(reduced) {
  const instances = [];
  function setup(selector, label, breakpoints) {
    const track = document.querySelector(selector);
    if (!track) return;
    const wrapper = track.querySelector(".swiper-wrapper");
    if (!wrapper) return;
    const controls = document.createElement("div");
    controls.className = "showcase-controls";
    controls.innerHTML = `<button type="button" class="showcase-prev" aria-label="Previous ${label}" title="Previous ${label}">${iconMarkup("arrowLeft")}</button><div class="showcase-pagination"></div><button type="button" class="showcase-next" aria-label="Next ${label}" title="Next ${label}">${iconMarkup("arrowRight")}</button>`;
    track.after(controls);
    const swiper = new Swiper(track, {
      modules: [A11y, Navigation, Pagination, Keyboard],
      speed: reduced.matches ? 0 : 650,
      slidesPerView: 1,
      spaceBetween: 24,
      breakpoints,
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: {
        enabled: true,
        containerMessage: label,
        prevSlideMessage: `Previous ${label}`,
        nextSlideMessage: `Next ${label}`,
      },
      navigation: {
        prevEl: controls.querySelector(".showcase-prev"),
        nextEl: controls.querySelector(".showcase-next"),
      },
      pagination: {
        el: controls.querySelector(".showcase-pagination"),
        clickable: true,
      },
      watchOverflow: true,
    });
    const change = () => {
      swiper.params.speed = reduced.matches ? 0 : 650;
    };
    reduced.addEventListener("change", change);
    instances.push(() => {
      reduced.removeEventListener("change", change);
      swiper.destroy(true, true);
      controls.remove();
    });
  }
  setup(".portfolio-swiper", "design study", {
    1001: { slidesPerView: 2, spaceBetween: 30 },
  });
  setup(".reviews-swiper", "review placeholder", {
    701: { slidesPerView: 1, spaceBetween: 28 },
  });
  return () => instances.forEach((cleanup) => cleanup());
}
