// @ts-ignore
import App from './App.vue'
import { createApp } from 'vue'

document.body.innerHTML = '<div id="app"></div>' // this is for hot reloading

createApp(App).mount('#app')
