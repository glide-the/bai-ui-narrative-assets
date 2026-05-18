import { CHAPTERS } from "../data/chapters";
import { LAYOUT } from "../config";
import type { NarrativeRuntimeState } from "../core/stateManager";

export function mountHeader(root: HTMLElement) {
  const el = document.createElement("header");
  el.className = "header";
  el.innerHTML = `
    <div class="header__titles">
      <h1 class="header__title">洱海边的三重回声</h1>
      <p class="header__subtitle">从白族文化到现代文明的视觉叙事</p>
    </div>
    <div class="header__chapter" id="hdrChapter" aria-live="polite"></div>
    <div class="header__progress" role="progressbar" aria-valuemin="1" aria-valuemax="7" id="hdrProgress">
      <div class="header__progressTrack" id="hdrTrack"></div>
    </div>
  `;
  root.appendChild(el);
}

export function updateHeader(state: NarrativeRuntimeState) {
  const ch = CHAPTERS[state.chapterIndex];
  const hdrChapter = document.getElementById("hdrChapter");
  const hdrTrack = document.getElementById("hdrTrack");
  if (hdrChapter) {
    hdrChapter.textContent = `第 ${ch.index} 章 · ${ch.title}：${ch.subtitle}`;
  }
  if (hdrTrack) {
    hdrTrack.style.width = `${((state.chapterIndex + 1) / CHAPTERS.length) * 100}%`;
  }
  const prog = document.getElementById("hdrProgress");
  if (prog) {
    prog.setAttribute("aria-valuenow", String(state.chapterIndex + 1));
    prog.setAttribute("aria-valuetext", `第 ${state.chapterIndex + 1} 章，共 ${CHAPTERS.length} 章`);
  }
  document.documentElement.style.setProperty("--header-h", `${LAYOUT.headerH}px`);
}
