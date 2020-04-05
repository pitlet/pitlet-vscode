// @ts-ignore
import App from './App.vue'
import { createApp } from 'vue'

createApp(App).mount('#app')

// if (module.hot) {
//   module.hot.accept('.', () => {
//     document.body.innerHTML = '<div id="app"></div>'
//     const App = require('./App.vue').default
//     createApp(App).mount('#app')
//     console.log('hot reload entry module...')
//   })
// }
