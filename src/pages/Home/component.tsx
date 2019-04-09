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
import { PickCardEvent, HandCard } from '../../components/Hand'
import { px } from '../../helpers'

async function sleep (ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function random(min: number, max: number) {
  return (Math.random() * (max - min) + min)
}

function randomAngle() {
  return random(-180, 180)
}

function randomOffset(width: number) {
  return random(0, width / 33)
}

interface StateProps {
  screenWidth: number
  screenHeight: number
  talonCenterX: number
  talonCenterY: number
  deckCenterX: number
  deckCenterY: number
  deckAngle: number
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
  hand: HandCard[]
  talon: TalonCard[]
}

const HomePage = styled.div`
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle farthest-corner at -4% -12.9%,  rgba(74,98,110,1) 0.3%, rgba(30,33,48,1) 90.2%);
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

const HandWrapper = styled.div<StateProps>`
  align-self: flex-start;
  width: 100%;
  margin-bottom: 3vw;
`

const DeckWrapper = styled.div<StateProps>`
  width: 1px;
  height: 1px;
  position: fixed;
  display: flex;
  justify-content: center;
  justify-items: center;
  left: ${props => px(props.deckCenterX)};
  top: ${props => px(props.deckCenterY)};
  transform: rotate(${props => props.deckAngle + 'deg'});
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
  private nextPlayerId() {
    const index = this.state.players.findIndex(({ id }) => id == this.state.currentPlayerId)
    const nextIndex = (index + 1) % this.state.players.length
    const nextPlayer = this.state.players[nextIndex]
    this.setState({ currentPlayerId: nextPlayer.id })
  }

  @bind
  private draw() {
    const [drawnCard, ...restOfDeck] = this.state.deck

    const tempHandToGetIndex: core.Card[] = [...this.state.hand, drawnCard]
      .sort(core.helpers.sortTwoCards)
    const index = tempHandToGetIndex.findIndex(handCard => handCard == drawnCard)

    const visibleChunkOfCardWidth = (this.props.screenWidth - this.props.handLeftPad - this.props.handRightPad - this.props.cardWidth) / (this.state.hand.length + 1 - 1)
    const xAbsolute = this.props.handLeftPad + visibleChunkOfCardWidth * index
    const yAbsolute = this.props.screenHeight - this.props.handBottomPad - this.props.cardHeight

    const x = this.props.deckCenterX - xAbsolute - this.props.cardWidth
    const y = this.props.deckCenterY - yAbsolute - this.props.cardHeight

    const drawnHandCard: HandCard = {
      ...drawnCard,
      angle: 0,
      offsetX: 0,
      offsetY: 0,
      start: {
        angle: this.props.deckAngle,
        width: this.props.cardWidth,
        x,
        y,
      }
    }

    const hand = [...this.state.hand, drawnHandCard].sort(core.helpers.sortTwoCards)

    this.setState({
      deck: restOfDeck,
      hand,
    })
  }

  @bind throwToTalon({ index, rect }: PickCardEvent) {
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
        angle: 0,
      },
    }]

    this.setState({
      talon,
      hand: restOfHand,
    })
  }

  constructor(props: Props) {
    super(props)
  }

  public async componentDidMount() {
    for (let i = 0; i < 7; i++) {
      await sleep(350)
      this.draw()
    }
  }

  public render() {
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

        <DeckWrapper {...this.props} onClick={this.draw}>
          <cmps.Deck
            cardHeight={this.props.cardHeight}
            cardWidth={this.props.cardWidth}
          />
        </DeckWrapper>

        <HandWrapper {...this.props}>
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
    deckCenterX: store.ui.selectors.deckCenterX(state.ui),
    deckCenterY: store.ui.selectors.deckCenterY(state.ui),
    deckAngle: store.ui.selectors.deckAngle(state.ui),
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
