import { render, h } from 'preact'
import { App } from './App'

document.body.innerHTML = '<div id="app"></div>' // this is for hot reloading

render(<App />, document.getElementById('app'))