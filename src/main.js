import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerRequiresFeatureDirective } from './directives/requiresFeature'
import './style.css'

const app = createApp(App)

// Crear Pinia y deshabilitar devtools logs
const pinia = createPinia()

// Deshabilitar logs de Pinia devtools
if (typeof window !== 'undefined') {
  window.__PINIA_DEVTOOLS_INSTALLED__ = true
}

app.use(pinia)
app.use(router)

// Registrar directiva global para control de funcionalidades por plan
registerRequiresFeatureDirective(app)

app.mount('#app')