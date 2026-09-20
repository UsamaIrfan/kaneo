import { build } from "esbuild";

const commonOptions = {
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  external: [
    "fs",
    "path",
    "crypto",
    "os",
    "util",
    "stream",
    "buffer",
    "events",
    "url",
    "querystring",
    "http",
    "https",
    "net",
    "tls",
    "zlib",
    "@modelcontextprotocol/sdk",
  ],
};

await Promise.all([
  build({
    ...commonOptions,
    entryPoints: ["src/index.ts"],
    outdir: "dist",
  }),
  build({
    ...commonOptions,
    entryPoints: ["api/index.ts"],
    outfile: "api/index.js",
  }),
]);
