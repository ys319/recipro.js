import { Application, Router } from "!oak/mod.ts"
import { Realize, Specification } from "@self/mod.ts"
import { GetSwitchesProtocol, SetCountProtocol, SetSwitchProtocol, ToggleSwitchProtocol } from "./proto/switches.ts"

const main = () => {
    const lights = [true, false, true, false, false]

    const spec = new Specification()
        .invoker<SetCountProtocol>("count")
        .invoker<SetSwitchProtocol>("set")
        .invoker<GetSwitchesProtocol>("get")
        .handler<GetSwitchesProtocol>("get", () => lights)
        .handler<ToggleSwitchProtocol>("toggle", (index) => {
            lights[index] = !lights[index]
            clients.forEach(client => client
                .call("set", [index, lights[index]])
                .catch((err) => console.info(err)))
        })

    const clients = new Set<Realize<typeof spec>>()

    const app = new Application()
    const router = new Router()

    router.get("/rpc", (context) => {
        if (!context.isUpgradable) context.throw(501)
        const socket = context.upgrade()
        const rpc = spec.build(socket)
        socket.addEventListener("open", () => clients.add(rpc))
        socket.addEventListener("close", () => clients.delete(rpc))
        socket.addEventListener("error", () => clients.delete(rpc))
        socket.addEventListener("open", () => clients.forEach(client => client.call("count", clients.size)))
        socket.addEventListener("close", () => clients.forEach(client => client.call("count", clients.size)))
        socket.addEventListener("error", () => clients.forEach(client => client.call("count", clients.size)))
    })

    // static content
    app.use(async (context, next) => {
        const root = `${Deno.cwd()}/dist`
        try {
            await context.send({ root, index: "index.html" })
        } catch {
            next()
        }
    })

    app.use(router.routes())
    app.use(router.allowedMethods())

    app.listen({ port: 8000 })
}

if (import.meta.main) main()
