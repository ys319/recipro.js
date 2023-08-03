import { Protocol } from "@ys319/recipro.js"

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
