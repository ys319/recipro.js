import package_json from "@self/package.json" assert { type: "json" }
import { build, path } from "./deps.ts"

const __dirname = new URL(".", import.meta.url).pathname

const entryPoints = [
    path.join(__dirname, "src", "mod.ts")
]

const outDir = path.join(__dirname, "dist")

await build({
    compilerOptions: { lib: ["DOM", "ESNext"], importHelpers: false },
    entryPoints,
    importMap: "deno.jsonc",
    outDir,
    package: { ...package_json, version: "0.0.1", },
    packageManager: "npm",
    shims: {},
    skipSourceOutput: true,
    test: false,
    typeCheck: "single",
    scriptModule: false,
})
