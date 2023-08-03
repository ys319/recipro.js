import { Protocol } from "@self/mod.ts"

export type GetSwitchesProtocol = Protocol<
    "get",
    void,
    boolean[]
>

export type ToggleSwitchProtocol = Protocol<
    "toggle",
    number,
    void
>

export type SetSwitchProtocol = Protocol<
    "set",
    [number, boolean],
    void
>

export type SetCountProtocol = Protocol<
    "count",
    number,
    void
>
