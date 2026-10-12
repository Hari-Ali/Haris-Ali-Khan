import { ArrowUpRight, ArrowRight, ArrowLeft, ArrowUp, Menu, X } from "lucide";

const nodes = { arrowUpRight: ArrowUpRight, arrowRight: ArrowRight, arrowLeft: ArrowLeft, arrowUp: ArrowUp, menu: Menu, close: X };

export function iconMarkup(name, className = "arrow") {
  const content = nodes[name].map(([tag, attributes]) =>
    "<" + tag + " " + Object.entries(attributes).map(([key, value]) => key + '="' + value + '"').join(" ") + "/>"
  ).join("");
  return '<svg class="' + className + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + content + "</svg>";
}
