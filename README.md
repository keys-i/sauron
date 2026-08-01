# Sauron

Sauron is UQ Reality Labs' small rendering companion for Three.js. It keeps drawing-buffer cost bounded, paces animation, offers an explicit `OffscreenCanvas` handoff, and ships one procedural prism material. Three remains the renderer and peer dependency.

## Install

```sh
npm install @uqrealitylabs/sauron three
```

## Render policy

```ts
import {
  configureRenderer,
  createFrameGate,
  selectRenderProfile,
} from "@uqrealitylabs/sauron";

const profile = selectRenderProfile({
  width: innerWidth,
  height: innerHeight,
  devicePixelRatio,
  hardwareConcurrency: navigator.hardwareConcurrency,
  reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
});

configureRenderer(renderer, profile, innerWidth, innerHeight);
const shouldRender = createFrameGate(profile.maxFps);
```

The profile caps DPR at 2, uses a drawing-buffer pixel budget, and selects a stable 30 fps/reduced-effects path for reduced motion, saved data, or low-core devices.

## Prism material

```ts
import { Mesh, PlaneGeometry } from "three";
import { createPrismaticMaterial } from "@uqrealitylabs/sauron/prism";

const material = createPrismaticMaterial();
const glow = new Mesh(new PlaneGeometry(1, 1), material);
material.uniforms.uTime.value = elapsedSeconds;

// On teardown:
glow.geometry.dispose();
material.dispose();
```

It is one draw, has no texture asset, and can be frozen at time `0` for reduced motion.

## Worker and Rust boundaries

`transferCanvasToWorker` only transfers canvas ownership. The application still owns its worker protocol, events, resizing, and teardown. Moving work to a worker changes CPU scheduling; it does not reduce GPU fragment cost.

`crates/core` is an experimental Rust particle kernel exercised by CI and excluded from the npm package. It should remain unshipped until an end-to-end browser benchmark beats the TypeScript path after WASM boundary and download costs.

`npm run benchmark` measures only the two CPU policy helpers and package bytes. It makes no GPU, frame-time, or Rust speed claim.

## Commands

```sh
npm run check
npm run benchmark
npm run rank
npm run branch -- onebranch
```

See [the generated ranking](docs/RANKING.md), [research notes](docs/RESEARCH.md), [contributing](docs/CONTRIBUTING.md), and [security policy](docs/SECURITY.md).

## Performance contract

- core plus prism: at most 5 KiB gzip, excluding peer Three
- no second renderer or runtime dependency
- no full-screen post pass
- DPR at most 2 and a stable reduced-motion state
- automated branches aside, branch names are one lowercase word

## License

MIT
