import { Application, Router } from "!oak/mod.ts"
import { delay } from "!std/async/delay.ts"
import { makePromise } from "@self/core/promise.ts"
import { ProtocolHandler, Realize, Specification } from "@self/mod.ts"
import { BroadcastProtocol, RoundTripProtocol, SimpleProtocol, SlowProtocol } from "@self/tests/protocol.ts"

export const server = (port: number) => {
    const roundProcedure: ProtocolHandler<RoundTripProtocol> = async (data) => {
        if (current === undefined) return data
        return await current.call("simple", data * 2)
    }

    let current: Realize<typeof spec> | undefined
    const recipros = new Set<Realize<typeof spec>>()

    const spec = new Specification()
        // Simple protocol
        .invoker<SimpleProtocol>("simple")
        .handler<SimpleProtocol>("simple", (data) => data * 2)
        // Round trip protocol
        .handler<RoundTripProtocol>("roundtrip", roundProcedure)
        // Slow protocol
        .handler<SlowProtocol>("slow", () => delay(500))
        // Broadcast protocol
        .invoker<BroadcastProtocol>("broadcast")
        .handler<BroadcastProtocol>("broadcast", async (data) => {
            for (const recipro of recipros) {
                await recipro.call("broadcast", data)
            }
        })

    const app = new Application()
    const router = new Router()

    router.get("/", (context) => {
        if (!context.isUpgradable) context.throw(501)
        const socket = context.upgrade()
        const recipro = spec.build(socket)
        socket.addEventListener("open", () => current = recipro)
        socket.addEventListener("close", () => current = undefined)
        socket.addEventListener("error", () => current = undefined)
        socket.addEventListener("open", () => recipros.add(recipro))
        socket.addEventListener("close", () => recipros.delete(recipro))
        socket.addEventListener("error", () => recipros.delete(recipro))
    })

    app.use(router.routes())
    app.use(router.allowedMethods())

    // Wait to ready promise, and shutdown server when aborted.
    const [readyPromise, res] = makePromise()
    app.addEventListener("listen", res)
    app.listen({ port })
    return readyPromise
}
