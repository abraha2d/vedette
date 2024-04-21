#!/usr/bin/env bun
import fs from "node:fs";
import { htmlPlugin } from "@craftamap/esbuild-plugin-html";
import esbuild, { type BuildOptions } from "esbuild";

// Options common to both entrypoints
const defaultOptions: BuildOptions = {
  format: "esm",
  logLevel: "info",
  minify: true,
  outdir: "dist",
  sourcemap: true,
  splitting: true,
};

// Clean build directory
if (defaultOptions.outdir) {
  fs.rmSync(defaultOptions.outdir, { recursive: true });
} else {
  console.warn("No outdir specified, not cleaning.");
}

// Build electron entrypoint
console.log("\nBuilding electron entrypoint...");
await esbuild.build({
  ...defaultOptions,
  entryPoints: ["src/main.ts"],
});

// Options specific to main entrypoint
const options: BuildOptions = {
  ...defaultOptions,
  bundle: true,
  entryNames: "[dir]/[name]-[hash]",
  entryPoints: ["src/index.tsx"],
  metafile: true,
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: ["src/index.tsx"],
          filename: "index.html",
          htmlTemplate: fs.readFileSync("static/index.html").toString(),
        },
      ],
    }),
  ],
};

// Build main entrypoint
console.log("\nBuilding main entrypoint...");
if (process.argv.includes("--watch")) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
