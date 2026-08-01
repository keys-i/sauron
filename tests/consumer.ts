import { Mesh, PlaneGeometry } from "three";
import { createPrismaticMaterial } from "../src/prism.ts";

const material = createPrismaticMaterial();
const mesh = new Mesh(new PlaneGeometry(1, 1), material);

mesh.geometry.dispose();
material.dispose();
