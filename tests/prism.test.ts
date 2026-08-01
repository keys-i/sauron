import assert from "node:assert/strict";
import test from "node:test";
import { createPrismaticMaterial } from "../src/prism.ts";

test("creates and updates one disposable shader material", () => {
  const material = createPrismaticMaterial(0.4);
  assert.equal(material.transparent, true);
  assert.match(material.fragmentShader, /palette/);
  material.uniforms.uTime.value = 3;
  material.uniforms.uOpacity.value = 0.8;
  assert.equal(material.uniforms.uTime.value, 3);
  assert.equal(material.uniforms.uOpacity.value, 0.8);
  material.dispose();
});
