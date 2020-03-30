import React from 'react'
import ReactDom from 'react-dom'
import { App } from './App'

document.body.innerHTML = '<div id="app"></div>' // this is for hot reloading

ReactDom.render(<App />, document.getElementById('app'))