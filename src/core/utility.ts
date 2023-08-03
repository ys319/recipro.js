import { Recipro } from "@self/core/recipro.ts"
import { Specification } from "@self/core/specification.ts"

export type Realize<T> = T extends Specification<infer X, infer Y> ? Recipro<X, Y> : never
