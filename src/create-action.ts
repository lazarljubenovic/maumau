export interface ActionWithoutPayload<T extends string> {
  type: T
}

export interface ActionWithPayload<T extends string, P> extends ActionWithoutPayload<T> {
  payload: P
}

function createAction<T extends string> (type: T): ActionWithoutPayload<T>
function createAction<T extends string, P> (type: T, payload: P): ActionWithPayload<T, P>
function createAction<T extends string, P> (type: T, payload?: P) {
  return payload === undefined ? { type } : { type, payload }
}

export default createAction
