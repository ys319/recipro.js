import { css } from "@emotion/css"

import { Accessor, Index, Show } from "solid-js"
import { procedure } from "."
import switch_off from "./assets/switch_off.min.png"
import switch_on from "./assets/switch_on.min.png"
import { count, lights } from "./store"

const noDrag = css`
    user-select: none;
    -webkit-user-drag: none;
`

const Count = () => {
    return <span class={css`
        color: #666;
        font-weight: bold;
        font-size: 1.5rem;
        filter: drop-shadow(2px 2px #DDD);
    `}>
        いま見ている人: {count()}人
    </span>
}

const Switch = ({ index, enable }: { index: number, enable: Accessor<boolean> }) => {
    return <button onClick={() => procedure.call("toggle", index)}>
        <Show when={enable()} fallback={
            <img class={noDrag} src={switch_off} alt="Off" />
        }>
            <img class={noDrag} src={switch_on} alt="On" />
        </Show>
    </button>
}

const Switches = () => {
    return (
        <div class={css`
            display: flex;
            align-items: center;
            justify-content: center;
        `}>
            <Index each={lights}>
                {(enable, index) => <Switch index={index} enable={enable} />}
            </Index>
        </div>
    )
}

const screwStyle = css`
    position: absolute;
    width: 16px;
    height: 16px;
    background: linear-gradient(
        45deg,
        #949494 0%,
        #a1a1a1 45%,
        #bcbcbc 70%,
        #a2a2a2 85%,
        #939393 90% 100%
    );
    border-radius: 50%;
`

const Screw = ({ style }: { style: string }) => {
    return <div class={[screwStyle, style].join(" ")} />
}

export const App = () => {
    return (
        <div class={css`
            position: relative;
            width: 640px;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 20px;
            border-radius: 10px;
            background: linear-gradient(30deg, #c0c0c0 0%, #dddddd 45%, #f4f4f4 70%, #d4d4d4 85%, #c0c0c0 90% 100%);
        `}>
            <Count />
            <Switches />
            <Screw style={css({ top: 10, left: 10 })} />
            <Screw style={css({ top: 10, right: 10 })} />
            <Screw style={css({ bottom: 10, left: 10 })} />
            <Screw style={css({ bottom: 10, right: 10 })} />
        </div>
    )
}
