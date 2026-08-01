# Rendering technique ranking

Generated from `tools/config/techniques.json` by `npm run rank:write`. LOC, transfer KiB, dependencies, and files are conservative implementation estimates, not measurements of the linked demos.

`Q = 4V + 3F + 3A + 3P + 2B + 2M + 3L`. `E = Q / (1 + LOC/200 + transferKiB/50 + 2×dependencies + files/10)`. A candidate passes only when `Q ≥ 75` and `E ≥ 25`; passing does not override the local product decision.

| Rank | Topic | Q | E | Gate · decision | Local use |
| ---: | --- | ---: | ---: | --- | --- |
| 1 | [WebGL colour spaces and models](https://offscreencanvas.com/issues/webgl-color-spaces-and-models/) | 92 | 92 | pass · retain | Keep the site's existing sRGB output and linear-light calculations. |
| 2 | [WebGL tone mapping](https://offscreencanvas.com/issues/webgl-tone-mapping/) | 92 | 92 | pass · retain | Keep the existing ACES tone mapping and tuned exposure. |
| 3 | [Three.js light and shadow](https://offscreencanvas.com/issues/threejs-light-and-shadow/) | 92 | 92 | pass · retain | Retain a few unshadowed lights; a point-light shadow needs six shadow views. |
| 4 | [Grid tile patterns](https://offscreencanvas.com/issues/grid-tile-patterns/) | 89 | 78.1 | pass · candidate | Use a CSS gradient for flat page grids; reserve WebGL for real depth. |
| 5 | [Ripples, waves and fakes](https://offscreencanvas.com/issues/ripples-waves-and-fakes/) | 90 | 74.4 | pass · retain | Reuse the site's fading CanvasTexture touch maps and disable them for reduced motion. |
| 6 | [WebGL particle systems](https://offscreencanvas.com/issues/001/) | 93 | 72 | pass · retain | Refine the existing 150-point, one-draw star field before adding GPGPU particles. |
| 7 | [Shaders and gradients](https://offscreencanvas.com/issues/002/) | 94 | 69.9 | pass · candidate | Use UV and radial gradients inside an existing material, not a shader framework. |
| 8 | [In circles and spheres](https://offscreencanvas.com/issues/in-circles-and-spheres/) | 90 | 69.7 | pass · candidate | Use sin/cos layouts and instancing for sparse orbs; add no layout system. |
| 9 | [WebGL wireframes](https://offscreencanvas.com/issues/webgl-wireframes/) | 84 | 69.5 | pass · candidate | Use Three's built-in wireframe or edges for a brief technical reveal. |
| 10 | [Cel/toon shading](https://offscreencanvas.com/issues/015/) | 91 | 68.9 | pass · candidate | Use one stock toon or quantized accent if the art direction calls for it. |
| 11 | [GLSL dithering](https://offscreencanvas.com/issues/glsl-dithering/) | 94 | 67.2 | pass · candidate | Apply subtle dithering to one accent material, never readable copy. |
| 12 | [Generative shader colour palettes](https://offscreencanvas.com/issues/generative-shader-color-palettes/) | 88 | 62 | pass · ship | Use the asset-free cosine palette in Sauron's single prism material. |
| 13 | [Vertex buffer animations](https://offscreencanvas.com/issues/vertex-buffer-animations/) | 85 | 56.3 | pass · defer | Move per-point animation to attributes only after profiling finds a CPU bottleneck. |
| 14 | [Fragment shader art](https://offscreencanvas.com/issues/fragment-shader-art/) | 82 | 53.2 | pass · candidate | One simple background is viable; a shader-art engine is not. |
| 15 | [Beautiful demos with matcaps](https://offscreencanvas.com/issues/016/) | 90 | 50.7 | pass · candidate | Use one compressed matcap only when a decorative model needs fixed stylised light. |
| 16 | [WebGL line rendering](https://offscreencanvas.com/issues/webgl-line-rendering/) | 77 | 47.7 | pass · defer | Triangulate wide lines only when inconsistent native line width becomes visible. |
| 17 | [WebGL scrolling animations](https://offscreencanvas.com/issues/webgl-scrolling-animations/) | 77 | 45.6 | pass · defer | Wait until native scroll replaces captured-wheel page navigation. |
| 18 | [How to learn Three.js](https://offscreencanvas.com/issues/how-to-learn-threejs/) | 69 | 69 | defer · reference | Use as a bibliography, not an effect; verify licences before copying examples. |
| 19 | [Points, lines and people](https://offscreencanvas.com/issues/points-lines-and-people/) | 73 | 30.9 | defer · defer | Image-morph data textures need content and preprocessing the site does not have. |
| 20 | [WebGL galleries and sliders](https://offscreencanvas.com/issues/webgl-galleries-and-sliders/) | 66 | 28.7 | defer · defer | Velocity bend and modulo wrapping do not fit the current information architecture. |
| 21 | [Trail effects with preserve drawing buffer](https://offscreencanvas.com/issues/trail-effects-with-preserve-drawing-buffer/) | 63 | 27.4 | defer · reject | Do not enable preserveDrawingBuffer; use explicit ping-pong targets only if measured. |
| 22 | [WebGL ASCII](https://offscreencanvas.com/issues/webgl-ascii/) | 60 | 24.1 | defer · reject | At most a decorative reveal; never replace semantic navigation or copy. |
| 23 | [WebGL glass and refraction](https://offscreencanvas.com/issues/008/) | 56 | 16.8 | defer · reject | Correct double-sided refraction needs extra renders and is wrong for the mobile full screen. |
| 24 | [Bespoke WebGL postprocessing](https://offscreencanvas.com/issues/bespoke-webgl-postprocessing/) | 58 | 16.3 | defer · reject | Reject until a measured effect cannot live in an existing material. |
| 25 | [WebGL infinite image gallery](https://offscreencanvas.com/issues/webgl-infinite-image-gallery/) | 57 | 13.9 | defer · reject | The current content and image budget do not justify recycled textured planes. |
| 26 | [Advanced ASCII rendering](https://offscreencanvas.com/issues/advanced-ascii-rendering/) | 52 | 13.4 | defer · reject | Channel-packed multi-pass ASCII costs more than its site value and hurts readability. |
| 27 | [Light hand and fake intersection](https://offscreencanvas.com/renders/light-hand/) | 46 | 10.7 | defer · reject | Depth intersection plus GPGPU expansion is too expensive for a hover accent. |
| 28 | [Cloth simulation in Three.js](https://offscreencanvas.com/issues/cloth-simulation-in-threejs/) | 48 | 10.4 | defer · reject | CPU constraints are expensive and there is no content requirement for cloth. |
| 29 | [Three WebGPU compute cloth](https://threejs.org/examples/webgpu_compute_cloth.html) | 51 | 9.6 | defer · research | GPU Verlet is instructive, but this example has no WebGL compute fallback. |
| 30 | [Physics constraints](https://offscreencanvas.com/issues/constraints-in-threejs-physics/) | 49 | 7.4 | defer · reject | Ropes and soft bodies are useful only inside a future interaction that requires them. |
| 31 | [Three WebGPU HTML texture](https://threejs.org/examples/webgpu_materials_texture_html.html) | 31 | 6.8 | defer · reject | Keep navigation and copy as semantic DOM instead of an experimental canvas texture. |
| 32 | [PlayCanvas](https://github.com/playcanvas/engine) | 55 | 4.6 | defer · reject | A strong standalone engine, but adding it would duplicate Three and its scene graph. |
| 33 | [Three.js rigid-body physics](https://offscreencanvas.com/issues/threejs-rigid-body-physics/) | 49 | 1.6 | defer · reject | Feelable Materials' pointer response is enough; dynamically import Rapier only for a game. |
| 34 | [Notebook cloth demo](https://lcb931023.github.io/web-on-a-notebook/webgl_animation_cloth.html) | 27 | 0.8 | defer · reference | Unlicensed Three r84 CPU Verlet demo from 2017; inspect but do not copy. |
