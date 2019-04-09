import { createSelector, Selector } from 'reselect'
import { State } from './state'

export const height: Selector<State, number> = state => state.height
export const width: Selector<State, number> = state => state.width

export const talonCenterX = createSelector(
  width,
  (width) => width * 0.25
)

export const talonCenterY = createSelector(
  height,
  (height) => height * 0.36
)

export const handLeftPad = createSelector(
  width,
  (width) => width * 0.066
)

export const handRightPad = createSelector(
  width,
  (width) => width * 0.066
)

export const handBottomPad = createSelector(
  width,
  (width) => width * 0.02
)

export const cardWidth = createSelector(
  width,
  (width) => width * 0.2
)

export const cardHeight = createSelector(
  cardWidth,
  (cardWidth) => cardWidth * (970 / 600)
)

export const deckCenterX = createSelector(
  width,
  (width) => width * 0.75
)

export const deckCenterY = createSelector(
  height,
  (height) => height * 0.55
)

export const deckAngle = createSelector(
  width,
  height,
  (width, height) => 65
)
