import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"

export const [lights, setLights] = createStore<boolean[]>([false, false, false, false, false])

export const toggleLights = (index: number) => {
    setLights(index, (item) => !item)
}

export const setLight = (index: number, enable: boolean) => {
    setLights(index, enable)
}

export const [count, setCount] = createSignal<number>(0)
