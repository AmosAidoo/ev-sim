import { defineConfig } from "tsup"

export default defineConfig({
  entryPoints: ["index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  outDir: "dist",
  clean: true,
})