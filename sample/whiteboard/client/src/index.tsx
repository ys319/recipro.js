/* @refresh reload */
import "ress"

import { render } from 'solid-js/web'
import "./index.css"

import { App, drawImage } from './App'
import { spec } from "./rpc"

const root = document.getElementById('root')
if (root === null) throw new Error("Failed to initialize application.")
render(() => <App />, root)

const endpoint = import.meta.env.DEV
    ? "ws://localhost:8000"
    : location.origin.replace(/^http/, "ws")

export let myColor: string

const socket = new WebSocket(`${endpoint}/rpc`)
export const procedure = spec.build(socket)
socket.addEventListener("open", async () => {
    // Load initial image
    const result = await procedure.call("get", undefined)
    const image = new Image()
    image.addEventListener("load", async () => drawImage(image))
    image.src = result
    // Get my color
    myColor = await procedure.call("color", undefined)
    console.log(myColor)
})
