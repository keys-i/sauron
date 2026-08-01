type RenderHints = {
  width: number;
  height: number;
  devicePixelRatio?: number;
  hardwareConcurrency?: number;
  reducedMotion?: boolean;
  saveData?: boolean;
};

type RenderProfile = {
  pixelRatio: number;
  maxFps: 30 | 60;
  particleScale: 0 | 0.5 | 1;
  expensiveEffects: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const finite = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

/** Keeps fill-rate bounded while preserving sharp output on small screens. */
export function selectRenderProfile({
  width,
  height,
  devicePixelRatio = 1,
  hardwareConcurrency = 8,
  reducedMotion = false,
  saveData = false,
}: RenderHints): RenderProfile {
  const constrained =
    reducedMotion || saveData || finite(hardwareConcurrency, 8) <= 4;
  const cssPixels =
    Math.max(1, finite(width, 1)) * Math.max(1, finite(height, 1));
  const pixelBudget = constrained ? 1_200_000 : 2_400_000;
  const pixelRatio = clamp(
    Math.sqrt(pixelBudget / cssPixels),
    0.5,
    clamp(finite(devicePixelRatio, 1), 0.5, 2),
  );

  return {
    pixelRatio: Math.round(pixelRatio * 100) / 100,
    maxFps: constrained ? 30 : 60,
    particleScale: reducedMotion ? 0 : constrained ? 0.5 : 1,
    expensiveEffects: !constrained,
  };
}

/** Returns true only when enough time has elapsed for the requested frame rate. */
export function createFrameGate(maxFps: number) {
  const interval = 1000 / clamp(maxFps, 1, 240);
  let previous = Number.NEGATIVE_INFINITY;

  return (now: number) => {
    if (now < previous || now - previous >= interval - 0.5) {
      previous = now;
      return true;
    }
    return false;
  };
}

type RendererLike = {
  setPixelRatio(value: number): void;
  setSize(width: number, height: number, updateStyle?: boolean): void;
};

/** Applies the same budget to Three.js or any renderer with the same two methods. */
export function configureRenderer(
  renderer: RendererLike,
  profile: RenderProfile,
  width: number,
  height: number,
) {
  renderer.setPixelRatio(clamp(finite(profile.pixelRatio, 1), 0.5, 2));
  renderer.setSize(width, height, false);
  return renderer;
}

type WorkerLike = {
  postMessage(message: unknown, transfer: Transferable[]): void;
};

/** Transfers ownership once; callers retain their own scene/message protocol. */
export function transferCanvasToWorker(
  canvas: HTMLCanvasElement,
  worker: WorkerLike,
  data: Record<string, unknown> = {},
) {
  if (!("transferControlToOffscreen" in canvas)) return false;
  const offscreen = canvas.transferControlToOffscreen();
  worker.postMessage({ ...data, canvas: offscreen }, [offscreen]);
  return true;
}
