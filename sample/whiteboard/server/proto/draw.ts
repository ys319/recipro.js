import { Protocol } from "@self/mod.ts"

export type GetColorProtocol = Protocol<
    "color",
    void,
    string
>

export type GetImageProtocol = Protocol<
    "get",
    void,
    string
>

export type DrawProtocol = Protocol<
    "draw",
    {
        array: [number, number][],
        color?: string
    },
    void
>

export type ClearProtocol = Protocol<
    "clear",
    void,
    void
>
