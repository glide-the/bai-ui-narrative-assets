import { STORAGE_KEYS } from "../config";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.lastChapter);
    const last = raw != null ? Number(raw) : 0;
    const modernOverlay = localStorage.getItem(STORAGE_KEYS.modernOverlay) === "1";
    return {
      lastChapter: Number.isFinite(last) ? Math.max(0, Math.min(6, last)) : 0,
      modernOverlay,
    };
  } catch {
    return { lastChapter: 0, modernOverlay: false };
  }
}

export function saveLastChapter(index: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.lastChapter, String(index));
  } catch {
    /* ignore */
  }
}

export function saveModernOverlay(v: boolean) {
  try {
    localStorage.setItem(STORAGE_KEYS.modernOverlay, v ? "1" : "0");
  } catch {
    /* ignore */
  }
}
