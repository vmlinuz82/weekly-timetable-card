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
  const ctx = await context({ ...options, minify: false, sourcemap: "inline" });
  await ctx.watch();
  const server = await ctx.serve({ servedir: ".", port: 8234 });
  console.log(`dev harness: http://${server.hosts[0] ?? "localhost"}:${server.port}/dev/`);
} else {
  await build({ ...options, minify: true });
}
