import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerRequiresFeatureDirective } from './directives/requiresFeature'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Registrar directiva global para control de funcionalidades por plan
registerRequiresFeatureDirective(app)

app.mount('#app')