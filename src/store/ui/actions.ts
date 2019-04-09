import createAction from '../../create-action'
import ActionType from './action-type'

export const changeWidthAndHeight = (width: number, height: number) =>
  createAction(ActionType.changeWidthAndHeight, {width, height})

export const changeWidth = (width: number) => createAction(ActionType.changeWidth, { width })
export const changeHeight = (height: number) => createAction(ActionType.changeHeight, { height })
