import * as React from 'react'
import * as store from '../../store'
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { compose } from 'redux'
import * as cmps from '../../components'
import bind from 'bind-decorator'
import styled from 'styled-components'
import { Player } from '../../components/PlayersQueue'
import * as _ from 'lodash'
import * as core from '../../core'
import { TalonCard } from '../../components/Talon'
import { PickCardEvent } from '../../components/Hand'
import { px } from '../../helpers'

function random (min: number, max: number) {
  return (Math.random() * (max - min) + min)
}

function randomAngle () {
  return random(-180, 180)
}

function randomOffset (width: number) {
  return random(0, width / 33)
}

interface StateProps {
  screenWidth: number
  screenHeight: number
  talonCenterX: number
  talonCenterY: number
  handLeftPad: number
  handRightPad: number
  handBottomPad: number
  cardWidth: number
  cardHeight: number
}

interface DispatchProps {
}

interface OwnProps {
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  players: Player[]
  currentPlayerId: string
  deck: core.Card[]
  hand: core.Card[]
  talon: TalonCard[]
}

const HomePage = styled.div`
  width: 100%;
  height: 100%;
  background-image: radial-gradient( circle farthest-corner at -4% -12.9%,  rgba(74,98,110,1) 0.3%, rgba(30,33,48,1) 90.2% );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const TalonWrapper = styled.div<StateProps>`
  width: 1px;
  height: 1px;
  position: fixed;
  left: ${props => px(props.talonCenterX)};
  top: ${props => px(props.talonCenterY)};
  z-index: 1;
`

const HandWrapper = styled.div`
  align-self: flex-start;
  width: 100%;
  margin-bottom: 3vw;
`

class Home extends React.Component<Props, State> {

  public state = {
    currentPlayerId: '1',
    players: [
      {
        id: '1',
        name: 'Lazar',
        cardsInHandCount: 5,
        isLastJack: false,
        picture: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      {
        id: '2',
        name: 'Lazar',
        cardsInHandCount: 5,
        isLastJack: false,
        picture: 'https://randomuser.me/api/portraits/men/43.jpg',
      },
      {
        id: '3',
        name: 'Lazar',
        cardsInHandCount: 5,
        isLastJack: false,
        picture: 'https://randomuser.me/api/portraits/men/46.jpg',
      },
      {
        id: '4',
        name: 'Lazar',
        cardsInHandCount: 5,
        isLastJack: false,
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=a72ca28288878f8404a795f39642a46f',
      },
      {
        id: '5',
        name: 'Lazar',
        cardsInHandCount: 5,
        isLastJack: false,
        picture: 'https://randomuser.me/api/portraits/men/97.jpg',
      },
      {
        id: '6',
        name: 'Lazar',
        cardsInHandCount: 5,
        isLastJack: false,
        picture: 'https://randomuser.me/api/portraits/men/86.jpg',
      },
    ],
    deck: _.shuffle(core.helpers.createDeck(2)),
    hand: [],
    talon: [],
  }

  @bind
  private nextPlayerId () {
    const index = this.state.players.findIndex(({ id }) => id == this.state.currentPlayerId)
    const nextIndex = (index + 1) % this.state.players.length
    const nextPlayer = this.state.players[nextIndex]
    this.setState({ currentPlayerId: nextPlayer.id })
  }

  @bind
  private addToHand (count: number = 1) {
    const drawnCards = this.state.deck.slice(0, count)
    const restOfDeck = this.state.deck.slice(count)

    const hand = [...this.state.hand, ...drawnCards]
      .sort(core.helpers.sortTwoCards)

    this.setState({
      deck: restOfDeck,
      hand,
    })
  }

  @bind
  private addOneToHand () {
    this.addToHand(1)
  }

  @bind throwToTalon ({ index, rect }: PickCardEvent) {
    const pickedCard: core.Card = this.state.hand[index]
    if (pickedCard == null) {
      throw new Error(`No card`)
    }
    const left = this.state.hand.slice(0, index)
    const right = this.state.hand.slice(index + 1)
    const restOfHand = [...left, ...right]

    const talon: TalonCard[] = [...this.state.talon, {
      ...pickedCard,
      angle: randomAngle(),
      offsetX: randomOffset(this.props.screenWidth),
      offsetY: randomOffset(this.props.screenWidth),
      start: {
        width: rect.width,
        x: rect.left,
        y: rect.top,
      },
    }]

    this.setState({
      talon,
      hand: restOfHand,
    })
  }

  constructor (props: Props) {
    super(props)
  }

  public componentDidMount (): void {
    this.addToHand(20)
  }

  public render () {
    return (
      <HomePage>
        <cmps.PlayersQueue
          currentPlayerId={this.state.currentPlayerId}
          lineWidth={this.props.screenWidth / 270}
          width={this.props.screenWidth}
          gap={this.props.screenWidth / 20}
          pad={this.props.screenWidth / 33}
          size={Infinity}
          players={this.state.players}
        />

        <TalonWrapper {...this.props}>
          <cmps.Talon
            cards={this.state.talon}
            cardWidth={this.props.cardWidth}
            cardHeight={this.props.cardHeight}
            talonCenterX={this.props.talonCenterX}
            talonCenterY={this.props.talonCenterY}
          />
        </TalonWrapper>

        <HandWrapper>
          <cmps.Hand
            cards={this.state.hand}
            onPick={(event) => this.throwToTalon(event)}
            cardWidth={this.props.cardWidth}
            cardHeight={this.props.cardHeight}
          />
        </HandWrapper>
      </HomePage>
    )
  }

}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, store.State> = (state, ownProps) => {
  const r = {
    screenWidth: store.ui.selectors.width(state.ui),
    screenHeight: store.ui.selectors.height(state.ui),
    cardWidth: store.ui.selectors.cardWidth(state.ui),
    cardHeight: store.ui.selectors.cardHeight(state.ui),
    talonCenterX: store.ui.selectors.talonCenterX(state.ui),
    talonCenterY: store.ui.selectors.talonCenterY(state.ui),
    handLeftPad: store.ui.selectors.handLeftPad(state.ui),
    handRightPad: store.ui.selectors.handRightPad(state.ui),
    handBottomPad: store.ui.selectors.handBottomPad(state.ui),
  }
  console.log(r)
  return r
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch, ownProps) => {
  return {}
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Home)
