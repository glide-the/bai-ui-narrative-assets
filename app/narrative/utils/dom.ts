export function qs(root: ParentNode, sel: string) {
  return root.querySelector(sel);
}

export function qsa(root: ParentNode, sel: string) {
  return Array.from(root.querySelectorAll(sel));
}

export function on(el: HTMLElement | Window, ev: string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions) {
  el.addEventListener(ev, fn, opts);
  return () => el.removeEventListener(ev, fn, opts);
}

export function setHidden(el: HTMLElement | null, hidden: boolean) {
  if (!el) return;
  el.hidden = !!hidden;
  el.setAttribute("aria-hidden", hidden ? "true" : "false");
}
