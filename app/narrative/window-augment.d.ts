export {};

declare global {
  interface Window {
    __narrativeOpenSymbol?: (id: string) => void;
  }
}
