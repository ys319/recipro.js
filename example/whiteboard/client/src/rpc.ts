import { Specification } from "@ys319/recipro.js"
import { clear, drawPoints } from "./App"
import { ClearProtocol, DrawProtocol, GetColorProtocol, GetImageProtocol } from "./proto/draw"

export const spec = new Specification()
    .invoker<GetImageProtocol>("get")
    .invoker<GetColorProtocol>("color")
    .invoker<ClearProtocol>("clear")
    .handler<ClearProtocol>("clear", clear)
    .invoker<DrawProtocol>("draw")
    .handler<DrawProtocol>("draw", drawPoints)
