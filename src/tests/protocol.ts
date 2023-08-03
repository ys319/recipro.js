import { Protocol } from "@self/mod.ts"

export type SimpleProtocol = Protocol<
    "simple",
    number,
    number
>

export type RoundTripProtocol = Protocol<
    "roundtrip",
    number,
    number
>

export type BroadcastProtocol = Protocol<
    "broadcast",
    string,
    void
>

export type SlowProtocol = Protocol<
    "slow",
    void,
    void
>
