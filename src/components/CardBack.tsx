import * as React from 'react'
import Card from './Card'
import * as core from '../core'

interface Props {
  cardWidth: number
  cardHeight: number
}

const CardBack: React.FunctionComponent<Props> = (props) => {
  return (
    <Card
      withoutSmall
      cardWidth={props.cardWidth}
      cardHeight={props.cardHeight}
      number={core.enums.Number.Back}
      suit={core.enums.Suit.Back}
    />
  )
}

export default CardBack
