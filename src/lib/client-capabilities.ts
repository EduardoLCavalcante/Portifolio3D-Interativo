type NavigatorWithConnection = Navigator & {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
};

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function matchesViewport(query: string) {
  return window.matchMedia(query).matches;
}

export function hasCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function shouldSkipHeavyMedia() {
  const connection = (navigator as NavigatorWithConnection).connection;
  const slowConnection = ["slow-2g", "2g"].includes(connection?.effectiveType ?? "");

  return prefersReducedMotion() || Boolean(connection?.saveData) || slowConnection;
}

export function runWhenIdle(callback: () => void, timeout = 1200) {
  const idleWindow = window as IdleWindow;

  if (idleWindow.requestIdleCallback) {
    const handle = idleWindow.requestIdleCallback(callback, { timeout });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const handle = window.setTimeout(callback, Math.min(timeout, 250));
  return () => window.clearTimeout(handle);
}
