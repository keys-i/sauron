import assert from "node:assert/strict";
import test from "node:test";
import {
  configureRenderer,
  createFrameGate,
  selectRenderProfile,
  transferCanvasToWorker,
} from "../src/index.ts";

test("bounds expensive rendering and honors user constraints", () => {
  assert.deepEqual(
    selectRenderProfile({ width: 390, height: 844, devicePixelRatio: 3 }),
    {
      pixelRatio: 2,
      maxFps: 60,
      particleScale: 1,
      expensiveEffects: true,
    },
  );
  assert.equal(
    selectRenderProfile({
      width: Number.NaN,
      height: Number.POSITIVE_INFINITY,
      devicePixelRatio: Number.NaN,
    }).pixelRatio,
    1,
  );
  assert.deepEqual(
    selectRenderProfile({
      width: 1920,
      height: 1080,
      devicePixelRatio: 2,
      reducedMotion: true,
    }),
    {
      pixelRatio: Math.sqrt(1_200_000 / (1920 * 1080)),
      maxFps: 30,
      particleScale: 0,
      expensiveEffects: false,
    },
  );
  const eightK = selectRenderProfile({
    width: 7680,
    height: 4320,
    devicePixelRatio: 2,
  });
  assert.ok(7680 * 4320 * eightK.pixelRatio ** 2 <= 2_400_000);
});

test("paces frames and configures renderer-shaped objects", () => {
  const accept = createFrameGate(30);
  assert.deepEqual([accept(0), accept(16), accept(34)], [true, false, true]);

  const calls: unknown[] = [];
  const renderer = {
    setPixelRatio: (value: number) => calls.push(["ratio", value]),
    setSize: (...values: unknown[]) => calls.push(["size", ...values]),
  };
  const profile = selectRenderProfile({ width: 800, height: 600 });
  assert.equal(configureRenderer(renderer, profile, 800, 600), renderer);
  assert.deepEqual(calls, [
    ["ratio", profile.pixelRatio],
    ["size", 800, 600, false],
  ]);

  configureRenderer(renderer, { ...profile, pixelRatio: 99 }, 800, 600);
  assert.deepEqual(calls.at(-2), ["ratio", 2]);
});

test("transfers supported canvases without prescribing a worker protocol", () => {
  const messages: unknown[] = [];
  const offscreen = {} as OffscreenCanvas;
  const canvas = {
    transferControlToOffscreen: () => offscreen,
  } as HTMLCanvasElement;
  assert.equal(
    transferCanvasToWorker(
      canvas,
      { postMessage: (...args) => messages.push(args) },
      { effect: "cloth" },
    ),
    true,
  );
  assert.deepEqual(messages, [
    [{ effect: "cloth", canvas: offscreen }, [offscreen]],
  ]);
});
