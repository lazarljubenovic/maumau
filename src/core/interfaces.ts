import { Number, Suit } from './enums'

export interface Card {
  number: Number
  suit: Suit
  deckIndex?: number
}
