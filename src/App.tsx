import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import * as pages from './pages'
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import * as store from './store'
import { createGlobalStyle } from 'styled-components'
import { compose } from 'redux'
import bind from 'bind-decorator'

const GlobalStyle = createGlobalStyle`
  * {

    &,
    &::after,
    &::before {
      box-sizing: border-box;
    }
  }
  
  :root {
    --vh: 1vh;
  }

  input, button {
    font: inherit;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    width: 100%;
    height: calc(100 * var(--vh));
  }
  
  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`

interface StateProps {
  width: number
  height: number
}

interface DispatchProps {
  changeWidthHeight: (width: number, height: number) => void
}

type Props = StateProps & DispatchProps

interface State {

}

class App extends React.Component<Props, State> {

  public componentWillMount (): void {
    this.updateWidthHeight()
  }

  public componentDidMount (): void {
    window.addEventListener('resize', this.updateWidthHeight)
  }

  public componentWillUnmount (): void {
    window.removeEventListener('resize', this.updateWidthHeight)
  }

  public render () {
    return (
      <Router>
        <>
          <GlobalStyle/>
          <Switch>
            <Route path="/" exact component={pages.Home.component}/>
          </Switch>
        </>
      </Router>
    )
  }

  @bind
  private updateWidthHeight () {
    const width = window.innerWidth
    const height = window.innerHeight
    this.props.changeWidthHeight(width, height)
  }

}

const mapStateToProps: MapStateToProps<StateProps, {}, store.State> = (state) => {
  return {
    width: state.ui.width,
    height: state.ui.height,
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => {
  return {
    changeWidthHeight: (width: number, height: number) => {
      dispatch(store.ui.actions.changeWidthAndHeight(width, height))
    },
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(App)
