import fs from "node:fs";
import path from "node:path";
import { products } from "../src/data.js";

const root = path.resolve("dist");
const issues = [];
let references = 0;
function check(reference, from) {
  if (!reference || /^(data:|https?:|#)/.test(reference)) return;
  references++;
  if (reference.startsWith("/"))
    issues.push(`Absolute deployment path: ${reference}`);
  const target = path.resolve(
    path.dirname(from),
    decodeURIComponent(reference.split(/[?#]/)[0]),
  );
  if (!target.startsWith(root + path.sep) || !fs.existsSync(target))
    issues.push(`Missing asset: ${reference}`);
}
const htmlPath = path.join(root, "index.html");
if (!fs.existsSync(htmlPath)) throw new Error("Build first: pnpm build");
const html = fs.readFileSync(htmlPath, "utf8");
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g))
  check(match[1], htmlPath);
for (const filename of fs.readdirSync(path.join(root, "assets"))) {
  if (!filename.endsWith(".css")) continue;
  const file = path.join(root, "assets", filename);
  for (const match of fs
    .readFileSync(file, "utf8")
    .matchAll(/url\(["']?([^"')]+)["']?\)/g))
    check(match[1], file);
}
const images = [
  ...new Set(products.map((product) => product.image)),
  "brand/hero",
  "brand/hero-mobile",
  "brand/support-detail",
  "brand/women-campaign",
];
for (const name of images) {
  const file = path.join(root, "images", `${name}.webp`);
  if (!fs.existsSync(file)) issues.push(`Missing image: ${name}`);
  else if (fs.statSync(file).size > 250000)
    issues.push(`Image exceeds 250 kB: ${name}`);
}
if (issues.length) throw new Error(issues.join("\n"));
if (!fs.existsSync(path.join(root, "images/brand/logo-original.png")))
  throw new Error("Original brand mark is missing");
console.log(
  `Static build verified: ${references} asset references, ${images.length} optimized images, original brand mark, relative deployment paths.`,
);
