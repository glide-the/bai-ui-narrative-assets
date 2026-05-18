/**
 * Generates narrative SVG assets + `app/narrative/assets/manifestData.ts`.
 * Run: pnpm narrative:generate-assets (from repo root)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(repoRoot, "public", "narrative", "assets");
const symbolsDir = path.join(assetsDir, "symbols");
const uiDir = path.join(assetsDir, "ui");
const manifestTsOut = path.join(repoRoot, "app", "narrative", "assets", "manifestData.ts");

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

const ink = "#11100D";
const clay = "#9B3F2F";

/** Minimal paper-cut silhouettes: readable at small UI sizes */
const symbolSvgs = {
  "a1-feather-crown.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="羽冠"><path fill="${ink}" d="M64 8 L88 52 L72 48 L64 38 L56 48 L40 52 Z M48 56 Q64 44 80 56 L76 72 Q64 62 52 72 Z M52 76 H76 L80 96 Q64 88 48 96 Z M56 100 H72 V118 H56Z"/></svg>`,
  "a2-profile-headwear.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="侧面头饰"><path fill="${ink}" d="M24 88 Q24 40 72 32 Q96 34 104 56 L104 88 Q80 72 56 72 Q36 72 24 88Z M72 32 L96 24 L100 44 Z"/></svg>`,
  "a3-round-earrings.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="圆耳环"><circle cx="40" cy="64" r="18" fill="none" stroke="${ink}" stroke-width="10"/><circle cx="88" cy="64" r="18" fill="none" stroke="${ink}" stroke-width="10"/><path fill="${ink}" d="M40 46 V28 H88 V46"/></svg>`,
  "a4-garment-edge.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="衣边垂饰"><path fill="${ink}" d="M8 24 H120 V40 H8Z M16 44 L32 120 H48 L40 44 Z M56 44 L64 120 H80 L72 44 Z M88 44 L96 120 H112 L104 44 Z"/></svg>`,
  "a5-collar.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="项圈"><path fill="none" stroke="${ink}" stroke-width="12" d="M24 40 Q64 88 104 40"/><circle cx="64" cy="36" r="10" fill="${ink}"/></svg>`,
  "a6-curved-sash.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="弯腰带"><path fill="none" stroke="${ink}" stroke-width="14" stroke-linecap="round" d="M16 24 Q64 96 112 32"/></svg>`,
  "a7-waist-ornament.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="腰饰"><ellipse cx="64" cy="64" rx="48" ry="20" fill="none" stroke="${ink}" stroke-width="10"/><path fill="${ink}" d="M40 64 L48 100 H80 L88 64 Z"/></svg>`,
  "a8-crown-ornament.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="冠饰"><path fill="${ink}" d="M32 96 L40 40 L52 72 L64 28 L76 72 L88 40 L96 96 Z"/></svg>`,
  "b1-mortar.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="研臼"><path fill="${ink}" d="M24 48 Q64 24 104 48 L96 96 Q64 112 32 96 Z"/><path fill="${ink}" d="M72 32 L88 8 L96 40 Z"/></svg>`,
  "b2-umbrella.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="伞"><path fill="${ink}" d="M16 56 Q64 8 112 56 L104 60 Q64 24 24 60 Z"/><rect x="60" y="56" width="8" height="56" fill="${ink}"/></svg>`,
  "b3-flute.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="长笛"><rect x="16" y="56" width="96" height="16" rx="4" fill="${ink}"/><circle cx="32" cy="64" r="3" fill="#F4EEDF"/><circle cx="48" cy="64" r="3" fill="#F4EEDF"/><circle cx="64" cy="64" r="3" fill="#F4EEDF"/></svg>`,
  "b4-flower-vine.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="花藤"><path fill="none" stroke="${ink}" stroke-width="6" d="M8 104 Q40 40 120 16"/><circle cx="32" cy="72" r="10" fill="${ink}"/><circle cx="72" cy="48" r="8" fill="${ink}"/><circle cx="104" cy="32" r="8" fill="${clay}"/></svg>`,
  "b5-cat.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="猫"><ellipse cx="64" cy="72" rx="40" ry="28" fill="${ink}"/><path fill="${ink}" d="M40 48 L32 16 L52 40 Z M88 48 L96 16 L76 40 Z"/><path fill="${ink}" d="M48 80 Q64 96 80 80"/></svg>`,
  "b6-bird.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="鸟"><path fill="${ink}" d="M16 72 Q48 32 112 48 L96 64 Q56 56 24 80 Z"/><circle cx="96" cy="44" r="4" fill="#F4EEDF"/></svg>`,
  "b7-clay-pot.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="陶罐"><path fill="${ink}" d="M40 40 H88 L96 88 Q64 120 32 88 Z"/><ellipse cx="64" cy="40" rx="28" ry="8" fill="${ink}"/></svg>`,
  "b8-seated-animal.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="家畜"><ellipse cx="64" cy="80" rx="44" ry="24" fill="${ink}"/><rect x="32" y="56" width="64" height="28" rx="8" fill="${ink}"/><circle cx="40" cy="48" r="8" fill="${ink}"/></svg>`,
  "b9-standing-dog.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="犬"><path fill="${ink}" d="M32 96 V56 L48 40 H80 L88 56 V96 H72 V72 H56 V96 Z"/><circle cx="72" cy="48" r="6" fill="#F4EEDF"/></svg>`,
  "c1-open-palm.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="掌心"><path fill="${ink}" d="M64 112 L40 96 L36 48 L48 32 L56 40 L64 24 L72 40 L80 32 L92 48 L88 96 Z"/></svg>`,
  "c2-ox-horn.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="牛角骨"><path fill="${ink}" d="M24 96 Q8 40 48 16 Q40 56 56 96 Z M104 96 Q120 40 80 16 Q88 56 72 96 Z"/></svg>`,
  "c3-sun-spiral.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="日纹螺旋"><path fill="none" stroke="${ink}" stroke-width="8" d="M64 16 A48 48 0 1 1 63.9 16"/><circle cx="64" cy="64" r="12" fill="${clay}"/></svg>`,
  "c4-elephant-totem.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="象首图腾"><path fill="${ink}" d="M32 88 V48 Q32 24 64 24 Q96 24 96 48 V88 H80 V64 H48 V88 Z"/><path fill="${ink}" d="M96 56 L112 40 V72 L96 64 Z"/></svg>`,
  "c5-flower-ritual.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="花祭饰"><circle cx="64" cy="64" r="12" fill="${clay}"/><path fill="${ink}" d="M64 20 L72 52 L104 52 L80 72 L88 104 L64 84 L40 104 L48 72 L24 52 L56 52 Z"/></svg>`,
  "c6-double-dance.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="双人舞"><circle cx="40" cy="40" r="16" fill="${ink}"/><circle cx="88" cy="40" r="16" fill="${ink}"/><path fill="${ink}" d="M24 64 Q40 104 64 88 Q88 104 104 64 V112 H24Z"/></svg>`,
  "c7-horned-skull.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="角颅"><circle cx="64" cy="64" r="36" fill="${ink}"/><path fill="#F4EEDF" d="M48 56 H80 V72 H48Z"/><path fill="${ink}" d="M32 32 L16 8 L40 40 Z M96 32 L112 8 L88 40 Z"/></svg>`,
  "c8-peacock.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="孔雀"><ellipse cx="56" cy="72" rx="28" ry="20" fill="${ink}"/><path fill="${ink}" d="M72 64 Q104 24 112 72 Q96 56 80 80 Z"/><circle cx="44" cy="64" r="4" fill="#F4EEDF"/></svg>`,
};

const uiSvgs = {
  "rice-paper-texture.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" fill="#F4EEDF"/><rect width="100%" height="100%" filter="url(#n)" opacity="0.08"/></svg>`,
  "stone-texture.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><filter id="s"><feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="2"/></filter><rect width="100%" height="100%" fill="#9A968A" opacity="0.25"/><rect width="100%" height="100%" filter="url(#s)" opacity="0.12"/></svg>`,
  "cloth-overlay.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><defs><pattern id="w" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8 L8 0" stroke="#4A3428" stroke-width="1" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#w)"/></svg>`,
  "ancient-road.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 120" preserveAspectRatio="none"><path fill="none" stroke="#11100D" stroke-width="4" stroke-dasharray="12 8" d="M0 60 Q160 20 320 60 T640 60"/></svg>`,
  "erhai-waterline.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 80" preserveAspectRatio="none"><path fill="none" stroke="#263C50" stroke-width="3" opacity="0.55" d="M0 40 Q80 20 160 40 T320 40 T480 40 T640 40"/><path fill="none" stroke="#263C50" stroke-width="2" opacity="0.35" d="M0 52 Q120 72 240 52 T480 52 T640 52"/></svg>`,
  "bai-village.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 200"><rect x="20" y="80" width="120" height="100" fill="#11100D"/><rect x="160" y="60" width="140" height="120" fill="#11100D"/><polygon points="160,60 230,20 300,60" fill="#11100D"/><rect x="320" y="90" width="100" height="90" fill="#11100D"/><rect x="440" y="70" width="52" height="110" fill="#11100D"/></svg>`,
  "benzhu-gate.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><rect x="40" y="40" width="240" height="180" fill="none" stroke="#11100D" stroke-width="8"/><path fill="#11100D" d="M120 220 V120 H200 V220"/><rect x="20" y="20" width="280" height="30" fill="#11100D"/></svg>`,
  "three-tea-cups.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120"><path fill="#11100D" d="M40 100 V48 Q40 32 56 32 H72 Q88 32 88 48 V100 Z"/><text x="52" y="116" font-size="12" fill="#9B3F2F" font-family="system-ui">苦</text><path fill="#11100D" d="M136 100 V40 Q136 24 152 24 H168 Q184 24 184 40 V100 Z"/><text x="148" y="116" font-size="12" fill="#9B3F2F" font-family="system-ui">甜</text><path fill="#11100D" d="M232 100 V36 Q232 20 248 20 H264 Q280 20 280 36 V100 Z"/><text x="248" y="116" font-size="12" fill="#9B3F2F" font-family="system-ui">味</text></svg>`,
  "flower-vine-accent.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><path fill="none" stroke="#11100D" stroke-width="5" d="M0 180 C100 40 300 20 400 100"/><circle cx="120" cy="100" r="14" fill="#9B3F2F"/><circle cx="240" cy="60" r="12" fill="#11100D"/></svg>`,
  "houses-compare.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect x="16" y="60" width="160" height="120" fill="#11100D"/><rect x="224" y="40" width="160" height="140" fill="#263C50"/><rect x="260" y="80" width="40" height="50" fill="#F4EEDF" opacity="0.3"/></svg>`,
  "screen-wall-frame.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520"><rect x="8" y="8" width="384" height="504" fill="none" stroke="#11100D" stroke-width="6"/><rect x="24" y="24" width="352" height="472" fill="none" stroke="#9A968A" stroke-width="2"/></svg>`,
  "chapter-rail-bg.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 92"><rect width="1440" height="92" fill="#D8B982" opacity="0.35"/><line x1="0" y1="1" x2="1440" y2="1" stroke="#4A3428" stroke-width="2" opacity="0.2"/></svg>`,
  "panel-bg.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 700"><rect width="360" height="700" fill="#FFF8E8" stroke="#9A968A" stroke-width="2"/></svg>`,
  "button-bg.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44"><rect x="2" y="2" width="156" height="40" rx="6" fill="#F4EEDF" stroke="#11100D" stroke-width="2"/></svg>`,
  "tab-bg.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 36"><rect width="120" height="36" rx="8" fill="#D8B982" opacity="0.5"/></svg>`,
  "selected-highlight.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 8"><rect width="120" height="8" rx="4" fill="#9B3F2F"/></svg>`,
  "hotspot-ring.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="40" fill="none" stroke="#9B3F2F" stroke-width="4" stroke-dasharray="8 6"/></svg>`,
  "popover-frame.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220"><rect x="4" y="4" width="312" height="212" rx="10" fill="#FFF8E8" stroke="#11100D" stroke-width="3"/></svg>`,
  "progress-marker.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#9B3F2F"/><circle cx="12" cy="12" r="4" fill="#F4EEDF"/></svg>`,
  "chapter-badge.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#11100D"/><text x="24" y="30" text-anchor="middle" fill="#F4EEDF" font-size="14" font-family="system-ui">01</text></svg>`,
};

function rel(p) {
  return p.replace(/\\/g, "/");
}

/** Writes manifest TS; paths use `NARRATIVE_PUBLIC_BASE` (see `app/narrative/config.ts`). */
function writeManifestTs(manifest) {
  const symKeys = Object.keys(manifest.symbolFiles).sort();
  const symLines = symKeys
    .map((k) => `    ${k}: p("${rel(manifest.symbolFiles[k])}"),`)
    .join("\n");
  const uiKeys = Object.keys(manifest.uiFiles).sort();
  const uiLines = uiKeys
    .map((k) => `    ${JSON.stringify(k)}: p("${rel(manifest.uiFiles[k])}"),`)
    .join("\n");

  const ts = `/** Auto-generated by scripts/narrative-generate-assets.mjs — do not hand-edit */
import { NARRATIVE_PUBLIC_BASE } from "../config";

function p(rel: string) {
  return \`\${NARRATIVE_PUBLIC_BASE}/\${rel}\`;
}

const manifestData = {
  version: ${manifest.version},
  symbolFiles: {
${symLines}
  },
  uiFiles: {
${uiLines}
  },
} as const;

export type UiFileKey = keyof typeof manifestData.uiFiles;

export default manifestData;
`;
  fs.mkdirSync(path.dirname(manifestTsOut), { recursive: true });
  fs.writeFileSync(manifestTsOut, ts, "utf8");
  console.log("Wrote manifest:", manifestTsOut);
}

function main() {
  ensureDir(symbolsDir);
  ensureDir(uiDir);
  const manifest = { version: 1, symbolFiles: {}, uiFiles: {} };

  const idByFilename = {
    "a1-feather-crown.svg": "A1",
    "a2-profile-headwear.svg": "A2",
    "a3-round-earrings.svg": "A3",
    "a4-garment-edge.svg": "A4",
    "a5-collar.svg": "A5",
    "a6-curved-sash.svg": "A6",
    "a7-waist-ornament.svg": "A7",
    "a8-crown-ornament.svg": "A8",
    "b1-mortar.svg": "B1",
    "b2-umbrella.svg": "B2",
    "b3-flute.svg": "B3",
    "b4-flower-vine.svg": "B4",
    "b5-cat.svg": "B5",
    "b6-bird.svg": "B6",
    "b7-clay-pot.svg": "B7",
    "b8-seated-animal.svg": "B8",
    "b9-standing-dog.svg": "B9",
    "c1-open-palm.svg": "C1",
    "c2-ox-horn.svg": "C2",
    "c3-sun-spiral.svg": "C3",
    "c4-elephant-totem.svg": "C4",
    "c5-flower-ritual.svg": "C5",
    "c6-double-dance.svg": "C6",
    "c7-horned-skull.svg": "C7",
    "c8-peacock.svg": "C8",
  };

  for (const [name, body] of Object.entries(symbolSvgs)) {
    const fp = path.join(symbolsDir, name);
    fs.writeFileSync(fp, body, "utf8");
    const sid = idByFilename[name];
    if (sid) manifest.symbolFiles[sid] = rel(`assets/symbols/${name}`);
  }
  for (const [name, body] of Object.entries(uiSvgs)) {
    const fp = path.join(uiDir, name);
    fs.writeFileSync(fp, body, "utf8");
    const key = name.replace(".svg", "");
    manifest.uiFiles[key] = rel(`assets/ui/${name}`);
  }

  writeManifestTs(manifest);
  console.log(
    "Wrote",
    Object.keys(symbolSvgs).length,
    "symbol svgs,",
    Object.keys(uiSvgs).length,
    "ui svgs under",
    assetsDir,
  );
}

main();
