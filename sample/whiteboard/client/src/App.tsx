import { css } from "@emotion/css"
import { Handler } from "@ys319/recipro.js"
import { onMount } from "solid-js"
import { myColor, procedure } from "."
import { DrawProtocol } from "./proto/draw"

let canvas: HTMLCanvasElement
let context: CanvasRenderingContext2D

const getPosition = (canvas: HTMLCanvasElement, ev: PointerEvent): [number, number] => {
    const rect = canvas.getBoundingClientRect()
    return [
        Math.floor(ev.clientX - rect.left),
        Math.floor(ev.clientY - rect.top),
    ]
}

export const clear = () => {
    if (canvas === undefined) return
    if (context === null) return
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
}

export const drawImage = (image: CanvasImageSource) => {
    context.drawImage(image, 0, 0)
}

export const drawPoints: Handler<DrawProtocol> = ({ array, color }) => {
    context.beginPath()
    context.strokeStyle = color ?? myColor
    array.forEach(([x, y], index) => {
        if (context === null) return
        if (index === 0) context.moveTo(x, y)
        context.lineTo(x, y)
        context.stroke()
    })
    context.closePath()
}

type Point2D = [number, number]
let buffer: Point2D[] = []
let drawing = false

const onPointerDown = (ev: PointerEvent) => {
    if (ev.button !== 0) return

    const current: Point2D = getPosition(canvas, ev)

    drawing = true
    buffer = [current]
}

const onPointerUp = () => {
    procedure.call("draw", { array: buffer })
    drawing = false
    buffer = []
}

const onPointerMove = (ev: PointerEvent) => {
    if (!drawing) return

    const current: Point2D = getPosition(canvas, ev)

    drawPoints({
        array: [buffer[buffer.length - 1], current],
        color: myColor
    })

    if (buffer.length > 10) {
        procedure.call("draw", { array: buffer })
        buffer = [buffer[buffer.length - 1], current]
    }

    buffer.push(current)
}

export function App() {
    onMount(() => {
        const ctx = canvas?.getContext("2d")
        if (ctx === undefined || ctx === null)
            throw new Error("Failed to initialize canvas.")
        context = ctx
        clear()
    })

    return (
        <>
            <canvas
                ref={canvas}
                width={800}
                height={600}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            />
            <div>
                <button
                    class={css`
                        border: 1px solid blue;
                        background-color: lightblue;
                        padding: 10px 20px;
                        border-radius: 10px;
                    `}
                    onClick={() => procedure.call("clear", undefined)}>
                    削除！
                </button>
            </div>
        </>
    )
}
