import { readFileSync, writeFileSync } from "node:fs";
import techniques from "../config/techniques.json" with { type: "json" };

type Technique = (typeof techniques)[number];

export function score(technique: Technique) {
  const quality =
    technique.visual * 4 +
    technique.fit * 3 +
    technique.accessibility * 3 +
    technique.performance * 3 +
    technique.support * 2 +
    technique.maintenance * 2 +
    technique.leanness * 3;
  const complexity =
    1 +
    technique.loc / 200 +
    technique.transferKb / 50 +
    technique.dependencies * 2 +
    technique.files / 10;
  return { quality, efficiency: Math.round((quality / complexity) * 10) / 10 };
}

const ranked = techniques
  .map((technique) => ({ ...technique, ...score(technique) }))
  .sort((left, right) => {
    const leftPasses = left.quality >= 75 && left.efficiency >= 25;
    const rightPasses = right.quality >= 75 && right.efficiency >= 25;
    return (
      Number(rightPasses) - Number(leftPasses) ||
      right.efficiency - left.efficiency
    );
  });

if (new Set(techniques.map(({ name }) => name)).size !== 34)
  throw new Error("expected 34 unique normalized topics");
if (
  techniques.some(
    ({
      visual,
      fit,
      accessibility,
      performance,
      support,
      maintenance,
      leanness,
    }) =>
      [
        visual,
        fit,
        accessibility,
        performance,
        support,
        maintenance,
        leanness,
      ].some((value) => value < 0 || value > 5),
  )
)
  throw new Error("heuristic inputs must be between zero and five");

const table = ranked.map((technique, index) => {
  const passes = technique.quality >= 75 && technique.efficiency >= 25;
  return `| ${index + 1} | [${technique.name}](${technique.link}) | ${technique.quality} | ${technique.efficiency} | ${passes ? "pass" : "defer"} · ${technique.use} | ${technique.decision} |`;
});

const output = [
  "# Rendering technique ranking",
  "",
  "Generated from `tools/config/techniques.json` by `npm run rank:write`. LOC, transfer KiB, dependencies, and files are conservative implementation estimates, not measurements of the linked demos.",
  "",
  "`Q = 4V + 3F + 3A + 3P + 2B + 2M + 3L`. `E = Q / (1 + LOC/200 + transferKiB/50 + 2×dependencies + files/10)`. A candidate passes only when `Q ≥ 75` and `E ≥ 25`; passing does not override the local product decision.",
  "",
  "| Rank | Topic | Q | E | Gate · decision | Local use |",
  "| ---: | --- | ---: | ---: | --- | --- |",
  ...table,
  "",
].join("\n");

const rankingFile = new URL("../../docs/RANKING.md", import.meta.url);
if (process.argv.includes("--write")) writeFileSync(rankingFile, output);
else if (process.argv.includes("--check")) {
  if (readFileSync(rankingFile, "utf8") !== output)
    throw new Error("run npm run rank:write");
} else process.stdout.write(output);
