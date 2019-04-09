import { Ui } from './interfaces'

interface Interface extends Ui {
}

export type State = Interface

const initialState: State = (typeof window == 'undefined' || !window.innerHeight || !window.innerWidth)
  ? {
    width: 1080,
    height: 1920,
  } : {
    width: window.innerWidth,
    height: window.innerHeight,
  }

export { initialState }
