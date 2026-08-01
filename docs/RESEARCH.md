# Rendering research and adoption ranking

Research date: 1 August 2026. Interactive browser control was unavailable, so this review uses the live page content, official source repositories, project documentation, and local bundle/runtime inspection. It does not pretend that unavailable controls were operated.

## Verdict

Sauron should be a small Three.js companion, not a new engine. The UQ Reality Labs site already owns a 4,824-line Three scene and ships Three, GSAP, Troika, Eyslie, and Feelable Materials. Adding PlayCanvas, a physics engine, a general post stack, or a second scene graph would increase both payload and failure surface.

The first integration target is therefore a procedural cosine-palette prism that can replace two textured glow planes with one draw. The stable core only supplies render budgets, frame gating, and an explicit OffscreenCanvas transfer. Rust/WASM is an optional experiment and is not shipped to visitors.

## Normalized input

The 41 supplied entries collapse to 34 unique topics. Corrections applied:

- `Icb931023` → lowercase-L `lcb931023`.
- `ottscreencanvas` and `ofiscreencanvas` → `offscreencanvas`.
- `threeis` → `threejs`; `webg1` → `webgl`; `vertex-butter` → `vertex-buffer`.
- `constraints-in-threejs hysics` → `constraints-in-threejs-physics`.
- `perserving-renders` maps to “Trail Effects with Preserve Drawing Buffer”.
- Duplicate cloth, ASCII, rigid-body, palette, circle, and postprocessing entries were merged.
- Offscreen Canvas is the publication name. Most referenced demos use OGL/Three/FBO techniques; they are not demonstrations of the browser `OffscreenCanvas` worker API.

## Scoring

Each 0–5 input is scored with the hostile reviewer’s quality function:

`Q = 4V + 3F + 3A + 3P + 2B + 2M + 3L`

- `V`: visible, intentional visual improvement.
- `F`: fit with the UQRL identity and current scene.
- `A`: accessibility and a stable reduced-motion/static state.
- `P`: mobile runtime and GPU safety.
- `B`: browser coverage and failure fallback.
- `M`: typed ownership, disposal, and maintenance cost.
- `L`: low LOC, bytes, files, and dependencies.

Complexity-adjusted value is:

`E = Q / (1 + LOC/200 + transferKiB/50 + 2×runtimeDependencies + productionFiles/10)`

A build candidate must reach `Q ≥ 75` and `E ≥ 25`. LOC, added transfer, dependency, and file inputs are conservative planning estimates rather than measurements of the linked demos. The 34-topic, machine-checked result is generated at [RANKING.md](RANKING.md) from `tools/config/techniques.json` and `tools/scripts/rank.ts`.

## Ranked catalogue

The complete ranked catalogue is [generated here](RANKING.md). Retaining correct colour management, ACES tone mapping, and the current unshadowed-light strategy scores highest because it costs zero new code. The first net-new effect is the prism; the remaining passing candidates are deliberately not bundled until a real page needs them.

## The official Three examples

### Compute cloth

The inspected [source snapshot](https://github.com/mrdoob/three.js/blob/2431a09f46f34c560bc8e44b33be0e567723d5b9/examples/webgpu_compute_cloth.html) is about 581 lines. It uses WebGPU compute/storage buffers for Verlet integration, fixed-step constraints, collision, normals, and rendering. It is a useful lab demo, not a production dependency for this site:

- no WebGL compute fallback;
- WebGPU support is less universal than WebGL2 and this compute example has no WebGL fallback;
- the site's current WebGL material and post-processing stack would require a TSL/WebGPU migration;
- motion-free and no-WebGPU fallbacks would still need separate implementation.

### HTML texture

The inspected [source snapshot](https://github.com/mrdoob/three.js/blob/2431a09f46f34c560bc8e44b33be0e567723d5b9/examples/webgpu_materials_texture_html.html) is roughly 180 lines and imports an experimental HTML-in-Canvas polyfill plus interaction mapping. This site already needs more semantic DOM fallback, not less. Do not move navigation, profiles, or body copy into a texture.

### Old notebook cloth

The normalized notebook demo is a Three r84 CPU Verlet cloth with wind, ball collision, and configurable pins. The page contains roughly 525 KB of HTML and loaded a roughly 1 MB vendored Three build when inspected. Its repository has no declared licence. Modern official Three sources are safer learning references.

## Framework decision

| Framework | Decision |
| --- | --- |
| Three.js | Sole renderer and peer dependency; it already owns the production scene. |
| OGL | Good for tiny shader-only sites, but switching this scene costs more code than it saves. |
| PlayCanvas | Use directly for editor/game/GSplat-heavy projects, not beneath Sauron. |
| Babylon.js | Mature but duplicates the installed engine and abstractions. |
| PixiJS | Good 2D filters/particles; wrong base for this 3D scene. |
| wgpu/WASM | Alternative native/web renderer, not an accelerator attached to Three. |
| Raw WebGL/WebGPU | Small dependency count, very high implementation and maintenance cost. |
| Bevy/WASM | Full game engine/build pipeline; reject for website effects. |

## Where to use Sauron in the two consumers

### UQ Reality Labs website

- Replace the two 512×512 texture-backed home glow planes with one procedural prism plane.
- Cap DPR by a 2.4-megapixel drawing-buffer budget and an absolute DPR of 2.
- Gate to 30 fps, remove particles for reduced motion, and halve them for saved-data or low-core devices.
- Retain ACES, sRGB output, unshadowed lights, the existing point star field, visibility pause, and semantic fallback controls.

### Feelable Materials

- Consume only the core quality profile for reduced-motion particle/blade budgets.
- Keep material presets, pointer state, uniforms, React hooks, and R3F components in Feelable Materials.
- Do not make Sauron own its canvas, renderer, raycasting, or React lifecycle.
- Import the prism effect only in an explicit demo; it is not a material dependency.

## Workers, Rust, and real load reduction

The native [`OffscreenCanvas`](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) API can move JavaScript scheduling to a worker; it does not reduce fragment work or create another GPU. The official [Three worker guide](https://threejs.org/manual/en/offscreencanvas.html) requires proxying pointer, size, and lifecycle data because workers have no normal DOM. The current scene is heavily DOM-coupled, so the small transfer helper is opt-in and no worker is shipped.

Rust/WASM is also not automatic acceleration. Boundary calls/copies can erase small-kernel wins, WASM still uses the main thread unless placed in a worker, and threaded WASM adds cross-origin isolation requirements. The included `sauron-effects-core` particle integrator is an isolated experimental crate so CI and release-plz have a real Rust target. It is excluded from npm/browser output until an end-to-end browser benchmark beats the TypeScript path.

If real rigid-body physics becomes a requirement, dynamically import [Rapier](https://rapier.rs/docs/user_guides/javascript/getting_started_js/) in that experience. Rapier is a Rust/WASM physics engine, not a cloth solver and not part of Sauron core.

## Performance contract

- Core plus prism: ≤5 KiB gzip, excluding peer Three.
- No second renderer and no direct runtime dependency.
- One prism draw replaces two glow draws; no new full-screen post pass.
- Absolute DPR ≤2; reduced/save-data/≤4-core paths target a 1.2-megapixel buffer and 30 fps.
- Consumers stop loops while hidden and freeze moving effects to a stable reduced-motion frame.
- Track cold first frame, warm CPU frame p50/p95, drawing-buffer pixels, draw calls, and bundle raw/gzip/Brotli.
- Hosted-runner GPU results are informational because virtual GPUs and contention are noisy.

## Licensing

- Three.js and official examples: MIT.
- PlayCanvas Engine: MIT.
- Rapier.js: Apache-2.0.
- Notebook repo: no licence found; do not redistribute.
- Offscreen Canvas explanations and snippets have no reusable software licence identified. Reimplement standard techniques independently and credit inspiration.
