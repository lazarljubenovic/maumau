import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './store'

const reactElement = (
  <Provider store={store}>
    <App/>
  </Provider>
)

const elementById = document.getElementById('root') as HTMLDivElement

ReactDOM.render(reactElement, elementById)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
