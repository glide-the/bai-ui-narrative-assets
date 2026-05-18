import { CHAPTERS } from "../data/chapters";
import type { NarrativeRuntimeState } from "../core/stateManager";

type ModernCanvasActions = {
  toggleModern: () => void;
};

export function mountModernCanvas(root: HTMLElement, actions: ModernCanvasActions) {
  const el = document.createElement("div");
  el.className = "modernCanvas";
  el.id = "modernCanvas";
  el.hidden = true;
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = `
    <button type="button" class="modernCanvas__veil" data-close="1" aria-label="关闭现代转折层"></button>
    <div class="modernCanvas__card" role="region" aria-labelledby="modernCanvasTitle">
      <p class="modernCanvas__kicker">现代转折</p>
      <h3 class="modernCanvas__title" id="modernCanvasTitle"></h3>
      <p class="modernCanvas__text" id="modernCanvasText"></p>
      <p class="modernCanvas__hint">按 M 或点击画布空白处收起</p>
    </div>
  `;
  root.appendChild(el);
  el.querySelector("[data-close]")!.addEventListener("click", () => actions.toggleModern());
}

export function updateModernCanvas(state: NarrativeRuntimeState) {
  const layer = document.getElementById("modernCanvas");
  if (!layer) return;
  const visible = state.started && state.showModern;
  layer.hidden = !visible;
  layer.setAttribute("aria-hidden", visible ? "false" : "true");
  layer.classList.toggle("modernCanvas--visible", visible);
  if (!visible) return;

  const ch = CHAPTERS[state.chapterIndex];
  const title = document.getElementById("modernCanvasTitle");
  const text = document.getElementById("modernCanvasText");
  if (title) title.textContent = `${ch.title} · ${ch.subtitle}`;
  if (text) text.textContent = ch.modernTransition;
}
