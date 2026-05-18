import { CHAPTERS } from "../data/chapters";
import { LAYOUT } from "../config";
import manifestData from "../assets/manifestData";
import type { NarrativeRuntimeState } from "../core/stateManager";

type RailActions = {
  setChapter: (i: number) => void;
};

export function mountChapterRail(root: HTMLElement, actions: RailActions) {
  const rail = document.createElement("nav");
  rail.className = "rail";
  rail.setAttribute("aria-label", "章节导航");
  rail.style.backgroundImage = `url(${manifestData.uiFiles["chapter-rail-bg"]})`;
  rail.style.backgroundSize = "cover";

  const inner = document.createElement("div");
  inner.className = "rail__inner";
  for (let i = 0; i < CHAPTERS.length; i++) {
    const ch = CHAPTERS[i];
    const b = document.createElement("button");
    b.type = "button";
    b.className = "rail__btn";
    b.dataset.index = String(i);
    b.setAttribute("aria-label", `第 ${ch.index} 章 ${ch.title}`);
    b.innerHTML = `<span class="rail__idx">${ch.index}</span><span class="rail__name">${ch.title}</span>`;
    b.addEventListener("click", () => actions.setChapter(i));
    inner.appendChild(b);
  }
  rail.appendChild(inner);
  root.appendChild(rail);
  document.documentElement.style.setProperty("--rail-h", `${LAYOUT.railH}px`);
}

export function updateChapterRail(state: NarrativeRuntimeState) {
  const buttons = document.querySelectorAll(".rail__btn");
  buttons.forEach((btn, i) => {
    const on = i === state.chapterIndex;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-current", on ? "true" : "false");
  });
}
