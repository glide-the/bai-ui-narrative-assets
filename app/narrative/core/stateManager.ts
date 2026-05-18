import { CHAPTERS } from "../data/chapters";
import { loadState, saveLastChapter, saveModernOverlay } from "../storage/saveSystem";
import type { EventBus } from "./eventBus";

export type NarrativeRuntimeState = {
  started: boolean;
  chapterIndex: number;
  showModern: boolean;
  activeSymbolId: string | null;
  compare: number;
  visited: Set<number>;
};

export function createStateManager(bus: EventBus) {
  const persisted = loadState();
  const state: NarrativeRuntimeState = {
    started: false,
    chapterIndex: persisted.lastChapter,
    showModern: persisted.modernOverlay,
    activeSymbolId: null,
    compare: 50,
    visited: new Set([persisted.lastChapter]),
  };

  function persistChapter() {
    saveLastChapter(state.chapterIndex);
  }

  function setChapter(i: number) {
    const next = Math.max(0, Math.min(CHAPTERS.length - 1, i));
    state.chapterIndex = next;
    state.visited.add(next);
    persistChapter();
    bus.emit("render");
  }

  function nextChapter() {
    setChapter(state.chapterIndex + 1);
  }

  function prevChapter() {
    setChapter(state.chapterIndex - 1);
  }

  function toggleModern() {
    state.showModern = !state.showModern;
    saveModernOverlay(state.showModern);
    bus.emit("render");
  }

  function beginExperience() {
    state.started = true;
    bus.emit("render");
  }

  function openSymbol(id: string) {
    state.activeSymbolId = id;
    bus.emit("render");
  }

  function closeSymbol() {
    state.activeSymbolId = null;
    bus.emit("render");
  }

  function setCompare(v: number) {
    state.compare = Math.max(0, Math.min(100, v));
    bus.emit("render");
  }

  function getCompare() {
    return state.compare;
  }

  function resetStory() {
    state.chapterIndex = 0;
    state.showModern = false;
    state.activeSymbolId = null;
    state.compare = 50;
    saveLastChapter(0);
    saveModernOverlay(false);
    bus.emit("render");
  }

  return {
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
  };
}
