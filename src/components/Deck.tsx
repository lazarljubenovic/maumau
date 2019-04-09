import * as React from 'react'
import styled from 'styled-components'
import * as core from '../core'
import CardBack from './CardBack'

interface GeometryProps {
  cardWidth: number
  cardHeight: number
}

interface Props extends GeometryProps {
  onClick?: () => void
}

interface State {
}

const Wrapper = styled.div<GeometryProps>`
  display: flex;
  justify-content: center;
  align-items: center;
`

class Deck extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  public render() {
    const geometryProps: GeometryProps = {
      cardHeight: this.props.cardHeight,
      cardWidth: this.props.cardWidth,
    }

    return (
      <Wrapper {...geometryProps} onClick={this.props.onClick}>
        <CardBack {...geometryProps} />
      </Wrapper>
    )
  }

}

export default Deck
