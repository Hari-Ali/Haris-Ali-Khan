import { defineConfig } from "vite";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
function entries(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((item) =>
    item.isDirectory()
      ? entries(`${path}/${item.name}`)
      : item.name === "index.html"
        ? [resolve(path, item.name)]
        : [],
  );
}
export default defineConfig({
  build: {
    rollupOptions: {
      input: [
        resolve("index.html"),
        ...["services", "journal", "case-studies"].flatMap(entries),
      ],
    },
  },
});
