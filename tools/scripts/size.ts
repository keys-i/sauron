import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const files = readdirSync(new URL("../../dist", import.meta.url)).filter(
  (file) => file.endsWith(".js"),
);
let gzipBytes = 0;
for (const file of files) {
  const output = readFileSync(new URL(`../../dist/${file}`, import.meta.url));
  gzipBytes += gzipSync(output).length;
}
if (gzipBytes > 5_120)
  throw new Error(`5 KiB gzip budget exceeded: ${gzipBytes} B`);
console.log(`${files.length} modules / ${gzipBytes} B gzip`);
