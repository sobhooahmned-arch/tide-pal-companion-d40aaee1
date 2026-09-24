// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import obfuscatorPkg from "vite-plugin-javascript-obfuscator";
const obfuscator: any = (obfuscatorPkg as any).default ?? obfuscatorPkg;

const isProd = process.env['NODE_ENV'] === "production";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      // Force per-route code splitting; nothing shared beyond framework chunks.
      cssCodeSplit: true,
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "vendor-react";
              if (id.includes("@tanstack")) return "vendor-tanstack";
              return "vendor";
            }
            return undefined;
          },
        },
      },
    },
    plugins: isProd
      ? [
          obfuscator({
            include: ["src/**/*.ts", "src/**/*.tsx"],
            exclude: [/node_modules/],
            apply: "build",
            options: {
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.75,
              deadCodeInjection: true,
              deadCodeInjectionThreshold: 0.4,
              debugProtection: false,
              disableConsoleOutput: true,
              identifierNamesGenerator: "hexadecimal",
              log: false,
              numbersToExpressions: true,
              renameGlobals: false,
              selfDefending: true,
              simplify: true,
              splitStrings: true,
              splitStringsChunkLength: 6,
              stringArray: true,
              stringArrayCallsTransform: true,
              stringArrayEncoding: ["base64"],
              stringArrayIndexShift: true,
              stringArrayRotate: true,
              stringArrayShuffle: true,
              stringArrayWrappersCount: 2,
              stringArrayWrappersChainedCalls: true,
              stringArrayWrappersType: "function",
              stringArrayThreshold: 0.75,
              transformObjectKeys: true,
              unicodeEscapeSequence: false,
            },
          }),
        ]
      : [],
  },
});
