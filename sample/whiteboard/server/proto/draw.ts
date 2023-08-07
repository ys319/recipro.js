import { Protocol } from "@ys319/recipro.js"

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
