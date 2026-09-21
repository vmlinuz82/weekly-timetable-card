import { build, context } from "esbuild";

const options = {
  entryPoints: ["src/card.ts"],
  bundle: true,
  format: "esm",
  target: "es2021",
  outfile: "dist/weekly-timetable-card.js",
  legalComments: "inline",
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const ctx = await context({
    ...options,
    outfile: "dev/bundle.js",
    minify: false,
    sourcemap: "inline",
  });
  await ctx.watch();
  const server = await ctx.serve({ servedir: ".", port: 8234 });
  const host = server.host === "0.0.0.0" ? "localhost" : server.host;
  console.log(`dev harness: http://${host}:${server.port}/dev/`);
} else {
  await build({ ...options, minify: true });
}
