import { Specification } from "@ys319/recipro.js"
import { GetSwitchesProtocol, SetCountProtocol, SetSwitchProtocol, ToggleSwitchProtocol } from "./proto/switches"
import { setCount, setLight } from "./store"

export const spec = new Specification()
    .invoker<GetSwitchesProtocol>("get")
    .invoker<ToggleSwitchProtocol>("toggle")
    .handler<SetSwitchProtocol>("set", ([index, enable]) => setLight(index, enable))
    .handler<SetCountProtocol>("count", (count) => { setCount(count) })
