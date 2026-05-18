export class EventBus {
  private _m = new Map<string, Set<(payload?: unknown) => void>>();

  on(type: string, fn: (payload?: unknown) => void) {
    if (!this._m.has(type)) this._m.set(type, new Set());
    this._m.get(type)!.add(fn);
    return () => this.off(type, fn);
  }

  off(type: string, fn: (payload?: unknown) => void) {
    this._m.get(type)?.delete(fn);
  }

  emit(type: string, payload?: unknown) {
    for (const fn of this._m.get(type) ?? []) fn(payload);
  }
}
