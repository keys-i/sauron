import { appendFileSync, readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { createFrameGate, selectRenderProfile } from "../../src/index.ts";

const percentile = (values: number[], fraction: number) =>
  [...values].sort((a, b) => a - b)[Math.ceil(values.length * fraction) - 1];

let sink = 0;

function measure(name: string, runs: number, task: (index: number) => number) {
  const batch = () => {
    const started = performance.now();
    for (let index = 0; index < runs; index += 1) sink += task(index);
    return ((performance.now() - started) * 1e6) / runs;
  };
  for (let warmup = 0; warmup < 3; warmup += 1) batch();
  const samples = Array.from({ length: 25 }, batch);
  return `| ${name} | ${percentile(samples, 0.5).toFixed(1)} ns | ${percentile(samples, 0.95).toFixed(1)} ns |`;
}

const gate = createFrameGate(60);
const rows = [
  measure("Quality selection", 500_000, (index) => {
    return selectRenderProfile({
      width: 390 + (index % 4) * 510,
      height: 844,
      devicePixelRatio: 3,
      hardwareConcurrency: 8,
    }).pixelRatio;
  }),
  measure("Frame gate", 1_000_000, (index) => Number(gate(index * 8.3))),
];

if (!Number.isFinite(sink))
  throw new Error("benchmark result was not consumed");

let size = "not built";
try {
  const outputs = ["index.js", "prism.js"].map((file) =>
    readFileSync(new URL(`../../dist/${file}`, import.meta.url)),
  );
  const raw = outputs.reduce((total, output) => total + output.length, 0);
  const gzip = outputs.reduce(
    (total, output) => total + gzipSync(output).length,
    0,
  );
  const brotli = outputs.reduce(
    (total, output) => total + brotliCompressSync(output).length,
    0,
  );
  size = `${raw.toLocaleString()} B raw / ${gzip.toLocaleString()} B gzip / ${brotli.toLocaleString()} B Brotli`;
} catch {}

const summary = [
  "## Sauron benchmark",
  "",
  `Runtime: ${process.version}; core bundle: ${size}`,
  "Scope: CPU-only helper microbenchmarks; no GPU or Rust speed claim.",
  "",
  "| Case | median | p95 |",
  "| --- | ---: | ---: |",
  ...rows,
  "",
].join("\n");

process.stdout.write(summary);
if (process.env.GITHUB_STEP_SUMMARY)
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
