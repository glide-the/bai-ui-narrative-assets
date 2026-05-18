import { CHAPTERS } from "../data/chapters";
import { SYMBOL_BY_ID } from "../data/symbols";
import type { NarrativeRuntimeState } from "../core/stateManager";
import type { UiFileKey } from "../assets/manifestData";

/** 每章符号热点在场景中的相对坐标（百分比） */
const HOTSPOTS: Record<string, Array<{ id: string; left: number; top: number }>> = {
  "chapter-01": [
    { id: "B6", left: 18, top: 38 },
    { id: "B7", left: 46, top: 52 },
    { id: "C3", left: 72, top: 30 },
  ],
  "chapter-02": [
    { id: "A1", left: 50, top: 22 },
    { id: "A3", left: 38, top: 40 },
    { id: "A5", left: 50, top: 48 },
    { id: "A8", left: 50, top: 14 },
    { id: "A4", left: 62, top: 58 },
    { id: "A6", left: 30, top: 62 },
  ],
  "chapter-03": [
    { id: "C1", left: 48, top: 58 },
    { id: "C2", left: 22, top: 36 },
    { id: "C3", left: 70, top: 28 },
    { id: "C4", left: 52, top: 40 },
    { id: "C6", left: 58, top: 68 },
  ],
  "chapter-04": [
    { id: "B7", left: 30, top: 50 },
    { id: "B4", left: 70, top: 36 },
    { id: "C3", left: 50, top: 18 },
    { id: "B3", left: 18, top: 60 },
    { id: "A6", left: 82, top: 62 },
  ],
  "chapter-05": [
    { id: "B2", left: 24, top: 30 },
    { id: "B4", left: 12, top: 70 },
    { id: "B5", left: 40, top: 62 },
    { id: "B6", left: 58, top: 34 },
    { id: "B7", left: 72, top: 58 },
    { id: "B9", left: 86, top: 72 },
    { id: "C5", left: 50, top: 48 },
  ],
  "chapter-06": [
    { id: "A4", left: 28, top: 42 },
    { id: "A7", left: 62, top: 44 },
    { id: "B7", left: 48, top: 68 },
    { id: "C7", left: 78, top: 30 },
    { id: "B4", left: 14, top: 58 },
    { id: "C3", left: 40, top: 22 },
  ],
  "chapter-07": [
    { id: "A1", left: 20, top: 24 },
    { id: "A3", left: 36, top: 40 },
    { id: "A8", left: 52, top: 20 },
    { id: "B4", left: 14, top: 58 },
    { id: "B7", left: 70, top: 52 },
    { id: "B9", left: 82, top: 68 },
    { id: "C1", left: 48, top: 62 },
    { id: "C3", left: 60, top: 36 },
    { id: "C8", left: 78, top: 28 },
  ],
};

type SceneActions = {
  setCompare: (v: number) => void;
  getCompare: () => number;
};

export function mountScene(root: HTMLElement, actions: SceneActions) {
  const wrap = document.createElement("div");
  wrap.className = "sceneWrap";
  wrap.innerHTML = `
    <div class="scene scene--grid" id="sceneRoot" aria-label="叙事场景区">
      <div class="scene__bg" id="sceneBg"></div>
      <div class="scene__layer" id="sceneDecor"></div>
      <div class="scene__compare" id="sceneCompare" hidden>
        <div class="compare" id="compareBox" style="--compare:50">
          <div class="compare__label compare__label--l">传统民居</div>
          <div class="compare__label compare__label--r">现代楼房</div>
          <div class="compare__viewport" id="compareViewport">
            <div class="compare__traditional" id="compareTrad"></div>
            <div class="compare__modern" id="compareModern"></div>
            <div class="compare__handle" id="compareHandle" role="slider" tabindex="0"
              aria-valuemin="0" aria-valuemax="100" aria-label="传统与现代对照"></div>
          </div>
          <input type="range" class="compare__range" id="compareRange" min="0" max="100" value="50"
            aria-label="拖动查看传统与现代的变化" />
        </div>
      </div>
      <div class="scene__hotspots" id="sceneHotspots"></div>
  `;
  root.appendChild(wrap);

  const range = wrap.querySelector("#compareRange") as HTMLInputElement;
  const handle = wrap.querySelector("#compareHandle") as HTMLElement;
  range.addEventListener("input", (e) => {
    actions.setCompare(Number((e.target as HTMLInputElement).value));
  });
  handle.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 10 : 5;
    const cur = actions.getCompare();
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      actions.setCompare(cur - step);
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      actions.setCompare(cur + step);
    }
  });
}

function setBackground(el: HTMLElement | null, url: string) {
  if (!el) return;
  el.style.backgroundImage = url ? `url(${url})` : "none";
}

export function updateScene(state: NarrativeRuntimeState, getAssetUrl: (key: UiFileKey) => string) {
  const ch = CHAPTERS[state.chapterIndex];
  const sceneRoot = document.getElementById("sceneRoot");
  const sceneBg = document.getElementById("sceneBg");
  const sceneDecor = document.getElementById("sceneDecor");
  const hotspots = document.getElementById("sceneHotspots");
  const compareWrap = document.getElementById("sceneCompare");
  const compareBox = document.getElementById("compareBox") as HTMLElement | null;
  const compareTrad = document.getElementById("compareTrad");
  const compareModern = document.getElementById("compareModern");
  const compareRange = document.getElementById("compareRange") as HTMLInputElement | null;
  const compareHandle = document.getElementById("compareHandle") as HTMLElement | null;

  if (sceneRoot) {
    sceneRoot.classList.toggle("scene--modernVeil", state.showModern);
  }

  const rice = getAssetUrl("rice-paper-texture");
  const stone = getAssetUrl("stone-texture");
  const cloth = getAssetUrl("cloth-overlay");

  setBackground(sceneBg, rice);
  if (sceneDecor) {
    sceneDecor.innerHTML = "";
    sceneDecor.style.opacity = "1";
  }

  const isHousing = ch.scene === "housing";
  if (compareWrap) compareWrap.hidden = !isHousing;

  const addImg = (cls: string, src: string, style: Partial<CSSStyleDeclaration> = {}) => {
    if (!sceneDecor) return;
    const img = document.createElement("img");
    img.className = cls;
    img.src = src;
    img.alt = "";
    Object.assign(img.style, style);
    sceneDecor.appendChild(img);
  };

  if (ch.scene === "road") {
    addImg("scene__img scene__img--wide", getAssetUrl("ancient-road"), {
      position: "absolute",
      left: "4%",
      top: "46%",
      width: "92%",
      height: "auto",
      opacity: "0.85",
    });
    addImg("scene__img scene__img--wide", getAssetUrl("erhai-waterline"), {
      position: "absolute",
      left: "4%",
      top: "58%",
      width: "92%",
      height: "auto",
      opacity: "0.75",
    });
    addImg("scene__img scene__cloth", cloth, {
      position: "absolute",
      inset: "0",
      opacity: "0.25",
      pointerEvents: "none",
    });
  } else if (ch.scene === "village") {
    addImg("scene__img scene__img--wide", getAssetUrl("bai-village"), {
      position: "absolute",
      left: "10%",
      bottom: "8%",
      width: "80%",
      height: "auto",
      opacity: "0.9",
    });
    addImg("scene__img", stone, {
      position: "absolute",
      inset: "0",
      opacity: "0.2",
    });
  } else if (ch.scene === "benzhu") {
    addImg("scene__img", getAssetUrl("benzhu-gate"), {
      position: "absolute",
      left: "18%",
      top: "10%",
      width: "64%",
      height: "auto",
    });
  } else if (ch.scene === "tea") {
    addImg("scene__img", getAssetUrl("three-tea-cups"), {
      position: "absolute",
      left: "22%",
      top: "28%",
      width: "56%",
      height: "auto",
    });
  } else if (ch.scene === "flowers") {
    addImg("scene__img scene__img--wide", getAssetUrl("flower-vine-accent"), {
      position: "absolute",
      left: "0",
      bottom: "0",
      width: "100%",
      height: "55%",
      objectFit: "cover",
    });
  } else if (ch.scene === "housing") {
    const url = getAssetUrl("houses-compare");
    const p = state.compare;
    if (compareBox) compareBox.style.setProperty("--compare", String(p));
    if (compareTrad) {
      compareTrad.style.backgroundImage = `url(${url})`;
      compareTrad.style.backgroundSize = "cover";
      compareTrad.style.backgroundPosition = "left center";
      compareTrad.style.clipPath = `inset(0 calc(100% - ${p}%) 0 0)`;
    }
    if (compareModern) {
      compareModern.style.backgroundImage = `linear-gradient(90deg, rgba(38,60,80,0.15), rgba(38,60,80,0.55)), url(${url})`;
      compareModern.style.backgroundSize = "cover";
      compareModern.style.backgroundPosition = "right center";
      compareModern.style.clipPath = `inset(0 0 0 ${p}%)`;
    }
    if (compareRange) {
      compareRange.value = String(p);
      compareRange.setAttribute("aria-valuenow", String(p));
    }
    if (compareHandle) {
      compareHandle.style.left = `${p}%`;
      compareHandle.setAttribute("aria-valuenow", String(p));
    }
  }

  if (ch.scene === "interface") {
    addImg("scene__img", getAssetUrl("screen-wall-frame"), {
      position: "absolute",
      left: "8%",
      top: "6%",
      width: "84%",
      height: "86%",
      objectFit: "contain",
      opacity: "0.35",
    });
  }

  if (!hotspots) return;
  hotspots.innerHTML = "";
  const spots = HOTSPOTS[ch.id] ?? [];
  for (const spot of spots) {
    const sym = SYMBOL_BY_ID[spot.id];
    if (!sym?.assetPath) continue;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hotspot";
    b.style.left = `${spot.left}%`;
    b.style.top = `${spot.top}%`;
    b.dataset.symbolId = spot.id;
    b.setAttribute("aria-label", `${sym.name}，点击查看符号意义`);
    b.innerHTML = `<span class="hotspot__ring" aria-hidden="true"></span>
      <img class="hotspot__icon" src="${sym.assetPath}" alt="" />`;
    b.addEventListener("click", () => {
      window.__narrativeOpenSymbol?.(spot.id);
    });
    b.addEventListener("mouseenter", () => {
      b.title = "点击查看符号意义";
    });
    hotspots.appendChild(b);
  }
}

export function wireSceneSymbolOpener(fn: (id: string) => void) {
  window.__narrativeOpenSymbol = fn;
}
