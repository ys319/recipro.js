import { Protocol, ProtocolHandler, ProtocolType } from "@self/core/protocol.ts"
import { Recipro } from "@self/core/recipro.ts"

export class Specification<
    I extends Record<never, never>,
    H extends Record<never, never>,
> {
    #handlers: Map<unknown, ProtocolHandler<Protocol>>

    public constructor(handlers: Map<unknown, ProtocolHandler<Protocol>> = new Map()) {
        this.#handlers = handlers
    }

    public invoker<P extends Protocol>(type?: ProtocolType<P>) {
        return new Specification<I & Record<ProtocolType<P>, P>, H>(this.#handlers)
    }

    public handler<P extends Protocol>(type: ProtocolType<P>, handler: ProtocolHandler<P>) {
        this.#handlers.set(type, handler as unknown as ProtocolHandler<Protocol>)
        return new Specification<I, H & Record<ProtocolType<P>, P>>(this.#handlers)
    }

    public build(socket: WebSocket) {
        return new Recipro<I, H>(socket, this.#handlers)
    }
}
