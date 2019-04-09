import { Card } from './interfaces'
import { NUMBERS, SUITS } from './enums'
import * as core from './index'

export function sortTwoCards (a: Card, b: Card) {
  const suitIndexA = SUITS.indexOf(a.suit)
  const suitIndexB = SUITS.indexOf(b.suit)

  const numberIndexA = NUMBERS.indexOf(a.number)
  const numberIndexB = NUMBERS.indexOf(b.number)

  return suitIndexA > suitIndexB
    ? 1
    : suitIndexA < suitIndexB
      ? -1
      : numberIndexA > numberIndexB
        ? 1
        : numberIndexA < numberIndexB
          ? -1
          : 0
}

export function createDeck (count: number, deckIndex: number = 0): Card[] {
  if (count == 1) {
    const deck: core.Card[] = []
    for (const suit of SUITS) {
      for (const number of NUMBERS) {
        deck.push({ suit, number, deckIndex })
      }
    }
    return deck
  } else {
    return [...createDeck(count - 1), ...createDeck(1, count)]
  }
}

export function cardKey (card: Card) {
  const elements: any[] = [card.suit, card.number]
  if (card.deckIndex != null) elements.push(card.deckIndex)
  return elements.join('')
}
