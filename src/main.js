import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerRequiresFeatureDirective } from './directives/requiresFeature'
import './style.css'

const app = createApp(App)

// Crear Pinia sin logs de devtools
const pinia = createPinia()

// Silenciar logs de Pinia en desarrollo
if (import.meta.env.MODE === 'development') {
  // Sobrescribir el método de logging interno de Pinia
  const originalLog = console.log
  console.log = (...args) => {
    // Filtrar logs de Pinia (que comienzan con 🍍)
    if (args[0] && typeof args[0] === 'string' && args[0].includes('🍍')) {
      return
    }
    originalLog(...args)
  }
}

app.use(pinia)
app.use(router)

// Registrar directiva global para control de funcionalidades por plan
registerRequiresFeatureDirective(app)

app.mount('#app')