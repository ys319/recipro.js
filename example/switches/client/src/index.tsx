/* @refresh reload */
import "ress"
import { render } from 'solid-js/web'
import { App } from './App'
import { spec } from "./rpc"
import { setLights } from "./store"

const root = document.getElementById('root')
if (root === null) throw new Error("Failed to initialize application.")
render(() => <App />, root)

const endpoint = location.origin.replace(/^http/, "ws")
const socket = new WebSocket(`${endpoint}/rpc`)
export const procedure = spec.build(socket)
socket.addEventListener("open", async () => {
    const result = await procedure.call("get", undefined)
    if (result === undefined) throw new Error("Failed to get state")
    setLights(result)
})
