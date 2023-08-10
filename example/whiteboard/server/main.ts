import { Application, Router } from "!oak/mod.ts"
import { ProtocolHandler, Realize, Specification } from "@self/mod.ts"
import { createCanvas } from "https://deno.land/x/skia_canvas@0.5.4/mod.ts"
import { ClearProtocol, DrawProtocol, GetColorProtocol, GetImageProtocol } from "./proto/draw.ts"

const colors = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
]

const main = () => {
    // Canvas and player color
    let count = 0
    const player = new Map<WebSocket, string>()

    const canvas = createCanvas(800, 600)
    const context = canvas.getContext("2d")

    const clearCall = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)

        clients.forEach(client => {
            client.call("clear", undefined)
        })
    }

    const drawCall: ProtocolHandler<DrawProtocol> = ({ array }, source) => {
        const color = player.get(source) ?? "black"

        context.strokeStyle = color
        context.beginPath()
        array.forEach(([x, y], index) => {
            if (context === null) return
            if (index === 0) context.moveTo(x, y)
            context.lineTo(x, y)
            context.stroke()
        })
        context.closePath()

        clients.forEach(client => {
            if (client.socket === source) return
            client.call("draw", { array, color })
        })
    }

    // RPC specification
    const spec = new Specification()
        .handler<GetImageProtocol>("get", () => canvas.toDataURL())
        .handler<GetColorProtocol>("color", (_void, socket) => player.get(socket) ?? "black")
        .invoker<DrawProtocol>("draw")
        .invoker<ClearProtocol>("clear")
        .handler<ClearProtocol>("clear", clearCall)
        .handler<DrawProtocol>("draw", drawCall)

    // Server program
    const clients = new Set<Realize<typeof spec>>()

    const app = new Application()
    const router = new Router()

    router.get("/rpc", (context) => {
        // Upgrade rpc
        if (!context.isUpgradable) context.throw(501)
        // Open socket
        const socket = context.upgrade()
        player.set(socket, colors[count])
        count++
        if (count >= colors.length) {
            count = 0
        }
        // Subscribe rpc
        const rpc = spec.build(socket)
        socket.addEventListener("open", () => clients.add(rpc))
        socket.addEventListener("close", () => clients.delete(rpc))
        socket.addEventListener("error", () => clients.delete(rpc))
        // socket.addEventListener("open", () => clients.forEach(client => client.call("count", clients.size)))
        // socket.addEventListener("close", () => clients.forEach(client => client.call("count", clients.size)))
        // socket.addEventListener("error", () => clients.forEach(client => client.call("count", clients.size)))
    })

    // static content
    app.use(async (context, next) => {
        const root = `${Deno.cwd()}/dist`
        try {
            await context.send({ root, index: "index.html" })
        } catch {
            next()
        }
    })

    app.use(router.routes())
    app.use(router.allowedMethods())

    app.listen({ port: 8000 })
}

if (import.meta.main) main()
