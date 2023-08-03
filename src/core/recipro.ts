import { Resolver, makePromise } from "@self/core/promise.ts"
import { Protocol, ProtocolHandler } from "@self/core/protocol.ts"

export class Recipro<
    I extends Record<string, never>,
    H extends Record<string, never>,
> {
    #handlers: Map<unknown, ProtocolHandler<Protocol>>
    #socket?: WebSocket

    #count = 0
    #queue = new Map<number, Resolver<Protocol["response"]>>()

    public constructor(socket: WebSocket, handlers: Map<unknown, ProtocolHandler<Protocol>>) {
        this.#handlers = handlers
        this.#socket = socket
        this.#socket.addEventListener("message", this.#onMessage)
    }

    public call<T extends keyof I & string>(type: T, data: I[T]["request"]["data"]): Promise<I[T]["response"]["data"]> {
        const [promise, resolve, reject] = makePromise<I[T]["response"]["data"]>()
        const id = this.#count++
        const request: Protocol["request"] = { id, type, data }
        this.#queue.set(id, resolve as Resolver<Protocol["response"]>)
        try {
            this.#socket?.send(JSON.stringify(request))
        } catch {
            reject(`Error: Failed to call remote procedure.`)
        }
        return promise
    }

    public get socket() {
        return this.#socket
    }

    #onRequest = async (pack: Protocol["request"]) => {
        if (this.#socket === undefined || this.#socket.readyState !== WebSocket.OPEN) {
            throw new Error("Error: Failed to send response, socket is not open.")
        }
        const handler = this.#handlers.get(pack.type)
        if (typeof handler !== "function") {
            throw new Error(`Error: Procedure ${pack.type} is undefined.`)
        }
        const data = await handler(pack.data, this.#socket)
        const response: Protocol["response"] = {
            id: pack.id,
            success: true,
            data
        }
        try {
            this.#socket.send(JSON.stringify(response))
        } catch {
            throw new Error("Error: Failed to send response.")
        }
    }

    #onResponse = (pack: Protocol["response"]) => {
        const func = this.#queue?.get(pack.id)
        if (typeof func === "function") {
            func(pack.data as Protocol["response"])
            this.#queue.delete(pack.id)
        } else {
            throw new Error("Error: Failed to process response.")
        }
    }

    #onMessage = async (event: MessageEvent) => {
        const pack = JSON.parse(event.data) as Protocol["request"] | Protocol["response"]
        if (typeof pack.id !== "number") return
        if ("type" in pack) {
            await this.#onRequest(pack).catch((error) => console.error(error))
        } else if ("success" in pack) {
            try {
                this.#onResponse(pack)
            } catch (error) {
                console.error(error)
            }
        }
    }
}
