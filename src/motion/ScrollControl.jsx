import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide";
function ScrollControl() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 1200);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="floating-scroll-control"
          aria-label="Return to page top"
          title="Return to page top"
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : 8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduced ? {} : { y: -3 }}
          whileTap={reduced ? {} : { scale: 0.97 }}
          onClick={() => window.dispatchEvent(new Event("hur:scroll-top"))}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {ArrowUp.map(([tag, attributes], key) => React.createElement(tag, { ...attributes, key }))}
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
export function mountScrollControl() {
  const host = document.createElement("div");
  host.className = "scroll-control-root";
  document.body.append(host);
  const root = createRoot(host);
  root.render(<ScrollControl />);
  return () => {
    root.unmount();
    host.remove();
  };
}
