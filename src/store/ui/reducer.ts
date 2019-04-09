import { Reducer } from 'redux'
import { State, initialState } from './state'
import ActionType from './action-type'

type Action = GetActions<typeof import('./actions')>

const reducer: Reducer<State, Action> = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.changeWidthAndHeight:
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height,
      }
    case ActionType.changeWidth:
      return {
        ...state,
        width: action.payload.width,
      }
    case ActionType.changeHeight:
      return {
        ...state,
        height: action.payload.height,
      }
    default:
      return state
  }
}

export default reducer
