import { assert } from "!std/assert/mod.ts"
import { makePromise } from "@self/core/promise.ts"
import { BroadcastProtocol, RoundTripProtocol, SimpleProtocol, SlowProtocol } from "@self/tests/protocol.ts"
import { server } from "@self/tests/server.ts"
import { Specification } from "@ys319/recipro.js"

const PORT = 5000
await server(PORT)

const connecting = (socket: WebSocket) => {
    const [ready, res, rej] = makePromise()
    socket.onopen = res
    socket.onerror = rej
    return ready
}

Deno.test(
    "Simple",
    async () => {
        const socket = new WebSocket(`ws://localhost:${PORT}`)
        const recipro = new Specification()
            .invoker<SimpleProtocol>("simple")
            .build(socket)

        await connecting(socket)

        assert(await recipro.call("simple", 100) === 200)
        socket.close()
    },
)

Deno.test(
    "Round trip",
    async () => {
        const socket = new WebSocket(`ws://localhost:${PORT}`)
        const recipro = new Specification()
            .invoker<RoundTripProtocol>("roundtrip")
            .handler<SimpleProtocol>("simple", (data) => data * 2)
            .build(socket)

        await connecting(socket)

        assert(await recipro.call("roundtrip", 100) === 400)
        socket.close()
    },
)

Deno.test(
    "Slow procedure",
    async () => {
        const socket = new WebSocket(`ws://localhost:${PORT}`)
        const recipro = new Specification()
            .invoker<SlowProtocol>("slow")
            .build(socket)

        await connecting(socket)

        await recipro.call("slow", undefined)
        socket.close()
    },
)

Deno.test(
    "Broadcast",
    async () => {
        const socket1 = new WebSocket(`ws://localhost:${PORT}`)
        await connecting(socket1)

        const socket2 = new WebSocket(`ws://localhost:${PORT}`)
        await connecting(socket2)

        const [result1, res3] = makePromise<string>()
        const [result2, res4] = makePromise<string>()

        const recipro1 = new Specification()
            .invoker<BroadcastProtocol>("broadcast")
            .handler<BroadcastProtocol>("broadcast", (data) => res3(data))
            .build(socket1)

        const recipro2 = new Specification()
            .invoker<BroadcastProtocol>("broadcast")
            .handler<BroadcastProtocol>("broadcast", (data) => res4(data))
            .build(socket2)

        await recipro1.call("broadcast", "Hello!")
        const [data1, data2] = await Promise.all([result1, result2])

        assert(data1 === data2)
        socket1.close()
        socket2.close()
    },
)
