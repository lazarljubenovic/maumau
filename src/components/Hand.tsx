import * as React from 'react'
import * as core from '../core'
import styled from 'styled-components'
import Card from './Card'
import posed, { PoseGroup } from 'react-pose'
import bind from 'bind-decorator'
import { px } from '../helpers';
import { runInThisContext } from 'vm';

export interface PickCardEvent {
  index: number
  rect: ClientRect
}

interface GeometryProps {
  // screenWidth: number
  // screenHeight: number
  cardWidth: number
  cardHeight: number
  // handLeftPad: number
  // handRightPad: number
  // handBottomPad: number
}

interface Props extends GeometryProps {
  cards: core.Card[]
  onPick: (pickCardEvent: PickCardEvent) => void
}

interface State {
}

const Wrapper = styled.div<GeometryProps>`
  display: flex;
  justify-content: space-around;
  width: calc(100% - ${props => px(props.cardWidth)});
  height: 100%;
`

const CardLeftLineStyle = styled.div`
  position: relative;
  width: 1px;
  height: 100%;
`

const CardLeftLine = posed(CardLeftLineStyle)()

const CardWrapperOuter = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CardWrapperInner = posed.div({
  hoverable: true,
  pressable: true,
  init: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: ({ size }: { size: number }) => -size / 6,
    scale: 1,
  },
  press: {
    y: ({ size }: { size: number }) => -size / 6,
    scale: 0.98,
  },
})

class Hand extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  public render() {
    const geometryProps: GeometryProps = { cardWidth: this.props.cardWidth, cardHeight: this.props.cardHeight }

    return (
      <Wrapper {...geometryProps}>
        <PoseGroup>
          {
            this.props.cards.map((card, index) => {
              const keyElements: any[] = [card.suit, card.number]
              if (card.deckIndex != null) keyElements.push(card.deckIndex)
              const key = keyElements.join('')
              return (
                <CardLeftLine key={key}>
                  <CardWrapperOuter>
                    <CardWrapperInner>
                      <Card
                        number={card.number}
                        suit={card.suit}
                        cardWidth={this.props.cardWidth}
                        cardHeight={this.props.cardHeight}
                        onClick={e => this.cardClick(index, e)}
                      />
                    </CardWrapperInner>
                  </CardWrapperOuter>
                </CardLeftLine>
              )
            })
          }
        </PoseGroup>
      </Wrapper>
    )
  }

  @bind
  private cardClick(index: number, event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const target = event.target as Element

    let current = target
    while (current.tagName.toLowerCase() != 'svg') {
      if (current.parentElement == null) return
      current = current.parentElement
    }

    const svgEl = current as SVGSVGElement
    const rect = svgEl.getBoundingClientRect()
    this.props.onPick({ index, rect })
  }

}

export default Hand
