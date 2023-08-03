export type FutureOr<T> = T | PromiseLike<T>
export type Resolver<T = unknown> = (value: FutureOr<T>) => void
export type Rejecter = (reason?: unknown) => void

export const makePromise = <T>(): [Promise<T>, Resolver<T>, Rejecter] => {
    let res!: Resolver<T>, rej!: Rejecter
    const promise = new Promise<T>((_res, _rej) => (res = _res, rej = _rej))
    return [promise, res, rej]
}
