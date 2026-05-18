import { SYMBOL_BY_ID } from "../data/symbols";
import type { NarrativeRuntimeState } from "../core/stateManager";

const catLabel: Record<string, string> = {
  identity: "身份符号",
  daily: "生活符号",
  ritual: "仪式符号",
};

type PopoverActions = {
  closeSymbol: () => void;
};

export function mountPopover(root: HTMLElement, actions: PopoverActions) {
  const el = document.createElement("div");
  el.className = "popoverLayer";
  el.id = "symbolPopover";
  el.hidden = true;
  el.innerHTML = `
    <div class="popoverLayer__backdrop" data-close="1"></div>
    <div class="popoverLayer__card" role="dialog" aria-modal="true" aria-labelledby="popTitle">
      <button type="button" class="popoverLayer__close" aria-label="关闭">×</button>
      <div class="popoverLayer__body">
        <img class="popoverLayer__img" id="popImg" alt="" />
        <div>
          <p class="popoverLayer__id" id="popId"></p>
          <h3 class="popoverLayer__title" id="popTitle"></h3>
          <p class="popoverLayer__meta" id="popMeta"></p>
          <p class="popoverLayer__desc" id="popDesc"></p>
          <button type="button" class="btn btn--ghost" id="popCloseBtn">收起</button>
        </div>
      </div>
    </div>
  `;
  root.appendChild(el);
  el.querySelector("[data-close]")!.addEventListener("click", () => actions.closeSymbol());
  el.querySelector(".popoverLayer__close")!.addEventListener("click", () => actions.closeSymbol());
  el.querySelector("#popCloseBtn")!.addEventListener("click", () => actions.closeSymbol());
}

export function updatePopover(state: NarrativeRuntimeState) {
  const layer = document.getElementById("symbolPopover");
  if (!layer) return;
  const id = state.activeSymbolId;
  if (!id) {
    layer.hidden = true;
    return;
  }
  const sym = SYMBOL_BY_ID[id];
  if (!sym) {
    layer.hidden = true;
    return;
  }
  layer.hidden = false;
  const popImg = document.getElementById("popImg") as HTMLImageElement | null;
  if (popImg) popImg.src = sym.assetPath;
  const popId = document.getElementById("popId");
  if (popId) popId.textContent = sym.id;
  const popTitle = document.getElementById("popTitle");
  if (popTitle) popTitle.textContent = sym.name;
  const popMeta = document.getElementById("popMeta");
  if (popMeta) popMeta.textContent = `${catLabel[sym.category] ?? ""} · ${sym.narrativeFunction}`;
  const popDesc = document.getElementById("popDesc");
  if (popDesc) popDesc.textContent = sym.description;
}
