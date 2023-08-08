import package_json from "@self/package.json" assert { type: "json" }
import { build, path } from "./deps.ts"

const __dirname = new URL(".", import.meta.url).pathname

const entryPoints = [
    path.join(__dirname, "src", "mod.ts")
]

const outDir = path.join(__dirname, "dist")

await build({
    package: { ...package_json },
    compilerOptions: { lib: ["DOM", "ESNext"], importHelpers: false },
    entryPoints,
    outDir,
    importMap: "deno.jsonc",
    packageManager: "npm",
    skipSourceOutput: true,
    shims: {},
    typeCheck: "both",
    test: false,
    declaration: "separate",
    scriptModule: false,
})
