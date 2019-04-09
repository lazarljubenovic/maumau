import * as React from 'react'
import * as core from '../core'
import styled from 'styled-components'
import Card from './Card'
import posed, { PoseGroup } from 'react-pose'
import bind from 'bind-decorator'
import { px } from '../helpers'
import { AdditionalCardProps } from './Talon'

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

export interface HandCard extends core.Card, AdditionalCardProps {
}

interface Props extends GeometryProps {
  cards: HandCard[]
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

const CardLeftLineStyle = styled.div<AdditionalCardProps & GeometryProps>`
  position: relative;
  width: 1px;
  height: 100%;
`

const CardLeftLine = posed<AdditionalCardProps & GeometryProps>(CardLeftLineStyle)({
  preEnter: {
    x: (props: AdditionalCardProps & GeometryProps) => props.start.x,
    y: (props: AdditionalCardProps & GeometryProps) => props.start.y,
    rotate: (props: AdditionalCardProps & GeometryProps) => props.start.angle,
  },
  enter: {
    x: (props: AdditionalCardProps & GeometryProps) => props.offsetX,
    y: (props: AdditionalCardProps & GeometryProps) => props.offsetY,
    rotate: (props: AdditionalCardProps & GeometryProps) => props.angle,
    transition: {
      duration: 250,
      ease: 'easeIn',
    },
  },
})

const CardWrapperOuter = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CardWrapperInnerStyle = styled.div<AdditionalCardProps & GeometryProps>``

const CardWrapperInner = posed<AdditionalCardProps & GeometryProps>(CardWrapperInnerStyle)({
  hoverable: true,
  pressable: true,
  init: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: (props: GeometryProps) => -props.cardHeight / 10,
    scale: 1,
  },
  press: {
    y: (props: GeometryProps) => -props.cardHeight / 10,
    scale: 0.98,
  },
})

class Hand extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  public render() {
    const geometryProps: GeometryProps = {
      cardWidth: this.props.cardWidth,
      cardHeight: this.props.cardHeight,
    }

    return (
      <Wrapper {...geometryProps}>
        <PoseGroup preEnterPose="preEnter">
          {
            this.props.cards.map((card, index) => {
              const keyElements: any[] = [card.suit, card.number]
              if (card.deckIndex != null) keyElements.push(card.deckIndex)
              const key = keyElements.join('')
              return (
                <CardLeftLine
                  key={key}
                  {...geometryProps}
                  {...card}
                >
                  <CardWrapperOuter>
                    <CardWrapperInner
                      {...geometryProps}
                      {...card}
                    >
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
