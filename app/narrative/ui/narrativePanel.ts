import { CHAPTERS } from "../data/chapters";
import { LAYOUT } from "../config";
import type { NarrativeRuntimeState } from "../core/stateManager";

type NarrativeActions = {
  saveNow?: () => void;
};

export function mountNarrative(root: HTMLElement, actions: NarrativeActions) {
  const el = document.createElement("aside");
  el.className = "narrative";
  el.innerHTML = `
    <div class="narrative__inner" id="narrInner">
      <div class="narrative__badge" id="narrBadge"></div>
      <h2 class="narrative__title" id="narrTitle"></h2>
      <p class="narrative__subtitle" id="narrSubtitle"></p>
      <p class="narrative__copy" id="narrCopy"></p>
      <div class="narrative__tags" id="narrTags"></div>
      <div class="narrative__mood narrative__mood--collapsed" id="narrMood" hidden></div>
      <div class="narrative__tools">
        <button type="button" class="btn" id="btnExpandMore" aria-expanded="false">展开说明</button>
        <button type="button" class="btn btn--ghost" id="btnSave" title="保存当前进度 (S)">保存进度</button>
      </div>
    </div>
  `;
  root.appendChild(el);

  document.getElementById("btnExpandMore")!.addEventListener("click", () => {
    const mood = document.getElementById("narrMood");
    const btn = document.getElementById("btnExpandMore");
    const expanded = mood && !mood.hidden;
    if (expanded) {
      mood.hidden = true;
      btn!.textContent = "展开说明";
      btn!.setAttribute("aria-expanded", "false");
    } else {
      mood!.hidden = false;
      btn!.textContent = "收起说明";
      btn!.setAttribute("aria-expanded", "true");
    }
  });

  document.getElementById("btnSave")!.addEventListener("click", () => actions.saveNow?.());
}

export function updateNarrative(state: NarrativeRuntimeState) {
  const ch = CHAPTERS[state.chapterIndex];
  const badge = document.getElementById("narrBadge");
  const title = document.getElementById("narrTitle");
  const subtitle = document.getElementById("narrSubtitle");
  const copy = document.getElementById("narrCopy");
  const tags = document.getElementById("narrTags");
  const moodEl = document.getElementById("narrMood");

  if (badge) badge.textContent = `第 ${ch.index} 章`;
  if (title) title.textContent = `${ch.title}`;
  if (subtitle) subtitle.textContent = ch.subtitle;
  if (copy) copy.textContent = ch.mainCopy;
  if (moodEl) {
    moodEl.innerHTML = "";
    const label = document.createElement("p");
    label.className = "narrative__moodLabel";
    label.textContent = "章节气质";
    moodEl.appendChild(label);
    const row = document.createElement("div");
    row.className = "narrative__moodRow";
    for (const m of ch.mood ?? []) {
      const s = document.createElement("span");
      s.className = "tag tag--mood";
      s.textContent = m;
      row.appendChild(s);
    }
    moodEl.appendChild(row);
  }

  if (tags) {
    tags.innerHTML = "";
    for (const k of ch.keywords) {
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = k;
      tags.appendChild(s);
    }
  }

  document.documentElement.style.setProperty("--panel-w", `${LAYOUT.panelW}px`);
}
