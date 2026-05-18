import manifestData from "../assets/manifestData";
import type { UiFileKey } from "../assets/manifestData";
import { EventBus } from "./eventBus";
import { createStateManager } from "./stateManager";
import { mountHeader, updateHeader } from "../ui/headerBar";
import { mountNarrative, updateNarrative } from "../ui/narrativePanel";
import { mountScene, updateScene, wireSceneSymbolOpener } from "../ui/sceneCanvas";
import { mountChapterRail, updateChapterRail } from "../ui/chapterRail";
import { mountPopover, updatePopover } from "../ui/symbolDetailPopover";
import { mountModernCanvas, updateModernCanvas } from "../ui/modernCanvasOverlay";
import { saveLastChapter } from "../storage/saveSystem";
import { LAYOUT } from "../config";

function getAssetUrl(key: UiFileKey) {
  return manifestData.uiFiles[key] ?? "";
}

export function startApp(root: HTMLElement | null) {
  if (!root) return null;

  const bus = new EventBus();
  const sm = createStateManager(bus);
  const {
    state,
    setChapter,
    nextChapter,
    prevChapter,
    toggleModern,
    beginExperience,
    openSymbol,
    closeSymbol,
    setCompare,
    getCompare,
    resetStory,
  } = sm;

  const actions = {
    setChapter,
    toggleModern,
    resetStory,
    setCompare,
    getCompare,
    closeSymbol,
    saveNow: () => {
      saveLastChapter(state.chapterIndex);
    },
  };

  const shell = document.createElement("div");
  shell.className = "shell";
  shell.innerHTML = `
    <div class="splash" id="splash">
      <div class="splash__card">
        <p class="splash__kicker">单屏叙事原型 · 1440×900</p>
        <h1 class="splash__title">洱海边的三重回声</h1>
        <p class="splash__subtitle">从白族文化到现代文明的视觉叙事</p>
        <p class="splash__hint">资产由仓库内脚本生成，无外链图库。若直接打开文件遇到模块加载限制，请用本地静态服务打开本目录。</p>
        <button type="button" class="btn btn--primary" id="btnEnter">进入叙事</button>
      </div>
    </div>
    <div class="appRoot" id="appRoot" hidden>
      <div class="stage" aria-label="叙事画布">
        <div id="sceneMount" class="stage__canvas"></div>
        <div id="modernCanvasMount" class="stage__modern"></div>
        <div id="narrMount" class="stage__narrative"></div>
      </div>
      <div id="headerMount" class="appRoot__header"></div>
      <div id="railMount" class="appRoot__rail"></div>
    </div>
  `;
  root.appendChild(shell);

  const btnEnter = document.getElementById("btnEnter");
  btnEnter?.addEventListener("click", () => {
    beginExperience();
    const splash = document.getElementById("splash");
    const appRoot = document.getElementById("appRoot");
    if (splash) splash.hidden = true;
    if (appRoot) appRoot.hidden = false;
    bus.emit("render");
  });

  const headerMount = document.getElementById("headerMount");
  const narrMount = document.getElementById("narrMount");
  const sceneMount = document.getElementById("sceneMount");
  const modernCanvasMount = document.getElementById("modernCanvasMount");
  const railMount = document.getElementById("railMount");
  if (headerMount) mountHeader(headerMount);
  if (narrMount) mountNarrative(narrMount, actions);
  if (sceneMount) mountScene(sceneMount, actions);
  if (modernCanvasMount) mountModernCanvas(modernCanvasMount, actions);
  if (railMount) mountChapterRail(railMount, actions);
  mountPopover(root, actions);

  wireSceneSymbolOpener((id) => openSymbol(id));

  function onKey(ev: KeyboardEvent) {
    if (!state.started) return;
    if (state.activeSymbolId && ev.key === "Escape") {
      closeSymbol();
      return;
    }
    const tag = (ev.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (ev.key === "ArrowRight") {
      ev.preventDefault();
      nextChapter();
    } else if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      prevChapter();
    } else if (/^[1-7]$/.test(ev.key)) {
      ev.preventDefault();
      setChapter(Number(ev.key) - 1);
    } else if (ev.key.toLowerCase() === "m") {
      ev.preventDefault();
      toggleModern();
    } else if (ev.key.toLowerCase() === "r") {
      ev.preventDefault();
      resetStory();
    } else if (ev.key.toLowerCase() === "s") {
      ev.preventDefault();
      saveLastChapter(state.chapterIndex);
    }
  }

  window.addEventListener("keydown", onKey);

  bus.on("render", () => {
    if (!state.started) return;
    updateHeader(state);
    updateNarrative(state);
    updateScene(state, getAssetUrl);
    updateChapterRail(state);
    updatePopover(state);
    updateModernCanvas(state);
  });

  document.documentElement.style.setProperty("--viewport-w", `${LAYOUT.viewportW}px`);
  document.documentElement.style.setProperty("--viewport-h", `${LAYOUT.viewportH}px`);

  return {
    bus,
    state,
    dispose: () => {
      window.removeEventListener("keydown", onKey);
      delete window.__narrativeOpenSymbol;
      root.innerHTML = "";
    },
  };
}
