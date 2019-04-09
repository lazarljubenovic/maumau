import * as React from 'react'
import styled from 'styled-components'
import * as core from '../core'
import Card from './Card'
import posed, { PoseGroup } from 'react-pose'
import bind from 'bind-decorator'

export interface AdditionalCardProps {
  offsetX: number
  offsetY: number
  angle: number

  start: {
    x: number
    y: number
    angle: number
    width: number
  }
}

interface Geometry {
  cardWidth: number
  cardHeight: number
  talonCenterX: number
  talonCenterY: number
}

export interface TalonCard extends core.Card, AdditionalCardProps {
}

interface GeometryProps {
  cardWidth: number
  cardHeight: number
}

interface Props extends GeometryProps, Geometry {
  cards: TalonCard[]
  onClick?: () => void
}

interface State {
}

const Wrapper = styled.div`
  transform: translateX(-50%) translateY(-50%) translateZ(0);
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CardDotWrapperStyle = styled.div<AdditionalCardProps & Geometry>`
  position: absolute;
  width: 1px;
  height: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`

const CardDotWrapper = posed<AdditionalCardProps & Geometry>(CardDotWrapperStyle)({
  exit: {
    x: (props: AdditionalCardProps & Geometry) => props.start.x - props.talonCenterX + props.cardWidth / 2,
    y: (props: AdditionalCardProps & Geometry) => props.start.y - props.talonCenterY + props.cardHeight / 2,
    rotate: (props: AdditionalCardProps & Geometry) => props.start.angle,
  },
  enter: {
    x: (props: AdditionalCardProps & Geometry) => props.offsetX,
    y: (props: AdditionalCardProps & Geometry) => props.offsetY,
    rotate: (props: AdditionalCardProps & Geometry) => props.angle,
    transition: {
      duration: 333,
      ease: 'easeOut',
    },
  },
})

class Talon extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)
  }

  public render () {
    return (
      <Wrapper onClick={this.click}>
        <PoseGroup flipMove={false}>
          {
            this.props.cards.map(card => (
              <CardDotWrapper
                key={core.helpers.cardKey(card)}
                {...card}
                cardWidth={this.props.cardWidth}
                cardHeight={this.props.cardHeight}
                talonCenterX={this.props.talonCenterX}
                talonCenterY={this.props.talonCenterY}
              >
                <div>
                  <Card
                    number={card.number}
                    suit={card.suit}
                    cardWidth={this.props.cardWidth}
                    cardHeight={this.props.cardHeight}
                  />
                </div>
              </CardDotWrapper>
            ))
          }
        </PoseGroup>
      </Wrapper>
    )
  }

  @bind
  private click () {
    if (this.props.onClick != null) this.props.onClick()
  }

}

export default Talon
