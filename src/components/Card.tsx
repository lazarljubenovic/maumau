import * as React from 'react'
import styled from 'styled-components'
import { Suit } from '../core/enums'
import { Card as CardInterface } from '../core/interfaces'
import bind from 'bind-decorator'
import { px } from '../helpers'

interface CardSizes {
  cardWidth: number
  cardHeight: number
}

interface Props extends CardInterface, CardSizes {
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}

interface State {
}

const COLORS: Record<Suit, [string, string]> = {
  [Suit.Club]: ['rgba(42,132,201,1)', 'rgba(47,249,233,1)'],
  [Suit.Heart]: ['rgba(254,3,104,1)', 'rgba(103,3,255,1)'],
  [Suit.Diamond]: ['rgba(231,69,54,1)', 'rgba(255,181,17,1)'],
  [Suit.Spade]: ['rgba(176,255,39,1)', 'rgba(86,238,225,1)'],
}

const Svg = styled.svg<CardSizes>`
  font-family: 'Titillium Web', 'Noto Serif TC', sans-serif;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, .1)) drop-shadow(0 2px 1px rgba(0, 0, 0, .1));
  user-select: none;
  width: ${props => props.cardWidth};
  height: ${props => props.cardHeight};
`

const CenterNumber = styled.g<CardSizes>`
  font-size: 700px;
  font-weight: 900;
`

const Small = styled.g<CardSizes>`
font-size: 80px;
  font-weight: 900;
`

const SmallSuit = styled.text<CardSizes>`
  font-size: 45px;
`

class Card extends React.Component<Props, State> {

  public static renderedSuits: Suit[] = []

  constructor(props: Props) {
    super(props)
  }

  public render() {
    const c = COLORS[this.props.suit]

    if (!Card.renderedSuits.includes(this.props.suit)) {
      Card.renderedSuits.push(this.props.suit)

      const defs = document.querySelector('#global-svg > defs')!
      defs.insertAdjacentHTML('afterbegin', `
        <linearGradient
          id="grad${this.props.suit}"
          gradientTransform="rotate(0)"
          gradientUnits="userSpaceOnUse"
          x1="0" y1="100%" x2="100%" y2="0%"
        >
          <stop offset="0%" stop-color="${c[0]}" />
          <stop offset="100%" stop-color="${c[1]}" />
        </linearGradient>
      `)
    }

    const gradUrl = 'url(#grad' + this.props.suit + ')'
    const cardSizes: CardSizes = { cardWidth: this.props.cardWidth, cardHeight: this.props.cardHeight }

    const viewBox = [0, 0, 600, 970].join(' ')

    return (
      <>
        <Svg xmlns="http://www.w3.org/2000/svg"
          viewBox={viewBox}
          width={cardSizes.cardWidth}
          height={cardSizes.cardHeight}
          preserveAspectRatio="xMidYMid meet"
          {...cardSizes}
          onClick={this.click}
        >

          <rect x="0" y="0" width="100%" height="100%" rx="10" ry="10" fill={gradUrl} />
          <polygon points="0,640 0,970 600,970 600,320" mask="url(#card)" fill="white" />

          <CenterNumber {...cardSizes}>
            <text x="50%" y="54.5%" textAnchor="middle" dominantBaseline="middle" fill={gradUrl}
              mask="url(#bottom-half)">
              {this.props.number}
            </text>
            <text x="50%" y="54.5%" textAnchor="middle" dominantBaseline="middle" fill="white" mask="url(#top-half)">
              {this.props.number}
            </text>
          </CenterNumber>

          <Small {...cardSizes}>
            <text x="6.2%" y="1%" fill="white" textAnchor="middle" dominantBaseline="hanging">
              {this.props.number}
            </text>
            <SmallSuit x="6%" y="15%" fill="white" textAnchor="middle" dominantBaseline="handing" {...cardSizes}>
              {this.props.suit}
            </SmallSuit>
          </Small>

          <Small transform={'rotate(180 300 485)'} {...cardSizes}>
            <text x="6.2%" y="1%" fill={c[1]} textAnchor="middle" dominantBaseline="hanging">
              {this.props.number}
            </text>
            <SmallSuit x="6%" y="15%" fill={c[1]} textAnchor="middle" dominantBaseline="handing" {...cardSizes}>
              {this.props.suit}
            </SmallSuit>
          </Small>

        </Svg>
      </>
    )
  }

  @bind click(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    if (this.props.onClick == null) return
    this.props.onClick(event)
  }

}

export default Card
