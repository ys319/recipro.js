import { FutureOr } from "@self/core/promise.ts"

export type Identifiable<T = unknown> = {
    id: number
    data: T
}

export type Protocol<
    Type extends string = string,
    Request = unknown,
    Response = unknown,
> = {
    request: Identifiable<Request> & {
        type: Type
    },
    response: Identifiable<Response> & {
        success: boolean
    },
}

export type ProtocolType<T> = T extends Protocol<infer N> ? N : never

export type ProtocolHandler<T extends Protocol>
    = (data: T["request"]["data"], socket: WebSocket) => FutureOr<T["response"]["data"]>
