import { AdditiveBlending, DoubleSide, ShaderMaterial } from "three";

type PrismUniforms = {
  uTime: { value: number };
  uOpacity: { value: number };
};

type PrismaticMaterial = {
  fragmentShader: string;
  transparent: boolean;
  uniforms: PrismUniforms;
  dispose(): void;
};

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
varying vec2 vUv;

vec3 palette(float t) {
  vec3 a = vec3(0.52);
  vec3 b = vec3(0.48);
  vec3 c = vec3(1.0);
  vec3 d = vec3(0.00, 0.33, 0.67);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 point = (vUv - 0.5) * 2.0;
  float radius = length(point);
  float angle = atan(point.y, point.x) / 6.28318;
  float glow = pow(max(0.0, 1.0 - radius), 2.4);
  float bands = 0.86 + 0.14 * sin(radius * 28.0 - uTime * 0.7);
  vec3 color = palette(radius * 0.72 + angle * 0.16 - uTime * 0.025);
  gl_FragColor = vec4(color, glow * bands * uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

/** One procedural draw replaces layered glow textures without image assets. */
export function createPrismaticMaterial(opacity = 0.7): PrismaticMaterial {
  return new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: opacity } },
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    side: DoubleSide,
  }) as unknown as PrismaticMaterial;
}
