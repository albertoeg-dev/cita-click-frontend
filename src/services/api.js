import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request - Agregar token a cada petición
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Variable para evitar múltiples limpiezas de sesión simultáneas
let isHandlingAuthError = false

// Interceptor de response - Manejar errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Manejar errores de autenticación (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error(`[AUTH] Error ${error.response.status}: ${error.response.data?.message || 'No autorizado'}`)

      // Evitar múltiples limpiezas simultáneas
      if (!isHandlingAuthError) {
        isHandlingAuthError = true

        const authStore = useAuthStore()

        // Solo limpiar sesión si hay token (evitar loops)
        if (authStore.token) {

          // Limpiar sesión de forma sincrónica
          authStore.token = null
          authStore.user = null
          localStorage.removeItem('token')
          localStorage.removeItem('user')

        }

        // Reset después de 1 segundo
        setTimeout(() => {
          isHandlingAuthError = false
        }, 1000)
      }

      // Rechazar inmediatamente para que no siga intentando
      return Promise.reject(error)
    }

    // Otros errores de servidor (500, 502, etc.)
    if (error.response?.status >= 500) {
      console.error('[API] Error del servidor:', error.response.status, error.response.data)
    }

    // Errores de red (sin conexión)
    if (!error.response) {
      console.error('[API] Error de red: No se pudo conectar con el servidor')
    }

    return Promise.reject(error)
  }
)

export default api