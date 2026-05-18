/** 轻量缓动：用于章节切换透明度 */
export function fade(el: HTMLElement | null, show: boolean, ms = 220) {
  if (!el) return;
  el.style.transition = `opacity ${ms}ms ease`;
  el.style.opacity = show ? "1" : "0";
}
