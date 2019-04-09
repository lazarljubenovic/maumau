import { createStore } from 'redux'
import reducer from './reducer'
import State from './state'
import * as ui from './ui'

const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
export type State = State

export { ui }
