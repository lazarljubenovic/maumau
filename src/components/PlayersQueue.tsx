import * as React from 'react'
import { ComponentType, ReactNode, RefAttributes } from 'react'
import posed from 'react-pose'
import { PoseElementProps } from 'react-pose/lib/components/PoseElement/types'


export interface Player {
  id: string
  name: string
  picture: string
  cardsInHandCount: number
  isLastJack: boolean
}

interface Props {
  players: Player[]
  currentPlayerId: string
  lineWidth: number
  width: number
  pad: number
  gap: number
  size: number
}

interface State {
}

function processProps (props: Props): Props {
  const { width, size: desiredSize, pad, gap, lineWidth } = props
  const n = props.players.length
  const maxSize = Math.floor((width - 2 * pad - (n + 1) * gap) / n) & (~1) // makes the number even (downwards)
  const size = Math.min(desiredSize, maxSize)
  return { ...props, size }
}

function getRectProps (props: Props) {
  const { size, lineWidth, pad, gap } = props
  const highlightedIndex = props.players.findIndex(player => player.id == props.currentPlayerId)
  const highlightedGapRatio = 0.33
  const highlightedCircleCoordX = pad + gap + highlightedIndex * (size + gap) - size * highlightedGapRatio

  return {
    x: highlightedCircleCoordX,
    y: -lineWidth,
    width: size + size * highlightedGapRatio * 2,
    height: size + 2 * lineWidth,
  }
}

const QueueGlowRect: React.FunctionComponent<Props> = (props, ref) => {
  const { x, ...rest } = getRectProps(props)
  return (
    <rect
      ref={ref}
      fill="url(#queue-glow-grad)"
      x={0}
      {...rest}
    />
  )
}

function createPosedComponent (props: Props) {
  const n = props.players.length

  const transition = {
    duration: 600,
    ease: 'easeOut',
  }

  const posedConfig: any = {}
  for (let i = 0; i < n; i++) {
    const id = props.players[i].id
    const x = getRectProps({ ...props, currentPlayerId: id }).x
    Object.assign(posedConfig, {
      [id]: { x, transition },
    })
  }

  return posed(React.forwardRef(QueueGlowRect))(posedConfig)
}


class PlayersQueue extends React.Component<Props, State> {

  public static QueueGlowRectPosed: ComponentType<PoseElementProps & Props & { children?: ReactNode } & RefAttributes<any>>

  constructor (props: Props) {
    super(props)
    PlayersQueue.QueueGlowRectPosed = createPosedComponent(processProps(props))
  }

  public render () {
    const props = processProps(this.props)
    const { width, size, pad, gap, lineWidth } = props
    const n = props.players.length

    const patterns = props.players.map(player => {
      return (
        <pattern key={player.id} id={'player-image-' + player.id} patternUnits="objectBoundingBox" width={1} height={1}>
          <rect fill="black" x="0" y="0" width={size} height={size}/>
          <image xlinkHref={player.picture} x={0} y={0} width={size} height={size}/>
        </pattern>
      )
    })

    const circleAttrs = props.players.map((player, index) => {
      const cx = pad + index * (gap + size) + gap + size / 2
      const cy = size / 2
      const r = size / 2
      const fill = 'url(#player-image-' + player.id + ')'
      const stroke = 'black'
      const attrs = { cx, cy, r, fill, stroke, strokeWidth: lineWidth, key: player.id }
      return attrs
    })

    const choppedLineXCoordinates: { x: number, width: number }[] = []
    choppedLineXCoordinates.push({ x: 0, width: pad + gap })
    for (let i = 0; i < n - 1; i++) {
      choppedLineXCoordinates.push({ x: pad + gap + i * (size + gap) + size, width: gap })
    }
    choppedLineXCoordinates.push({ x: pad + gap + (n - 1) * (size + gap) + size, width: pad + gap })

    const viewBox = `0 ${-lineWidth} ${width} ${size + 2 * lineWidth}`

    return (
      <div className="PlayersQueue">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width={width} height={size}
             preserveAspectRatio="xMidYMid meet">
          <defs>
            {patterns}
            <filter x="-50%" y="-50%" width="200%" height="200%" id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
            </filter>

            <linearGradient id="queue-glow-grad">
              <stop offset="0%" stopColor="black"/>
              <stop offset="10%" stopColor="white"/>
              <stop offset="90%" stopColor="white"/>
              <stop offset="100%" stopColor="black"/>
            </linearGradient>

            <mask id="queue-glow">
              <PlayersQueue.QueueGlowRectPosed {...props} size={size} pose={props.currentPlayerId}/>
            </mask>
          </defs>

          <g>
            <line x1="0" y1={size / 2} x2={width} y2={size / 2} strokeWidth={lineWidth} stroke="black"/>
            {circleAttrs.map(attrs => <circle {...attrs} />)}
          </g>

          <g filter="url(#blur)" mask="url(#queue-glow)">
            {
              choppedLineXCoordinates.map(({ x, width }) => {
                const y = size / 2 - lineWidth / 2
                const height = lineWidth
                const attrs = { x, y, width, height }
                return <rect key={x} {...attrs} fill="orange"/>
              })
            }
            {circleAttrs.map(attrs => {
              const { stroke, fill, strokeWidth, ...rest } = attrs
              return (
                <circle {...rest} stroke="orange" fill="transparent" strokeWidth={strokeWidth * 1.5}/>
              )
            })}
          </g>
        </svg>
      </div>
    )
  }

}

export default PlayersQueue
