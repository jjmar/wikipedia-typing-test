import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSync)

const app = createApp(App).use(router)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
