import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enviar cookie httpOnly en cada petición
  headers: {
    'Content-Type': 'application/json',
  },
})

// Variable para evitar múltiples limpiezas de sesión simultáneas
let isHandlingAuthError = false

// Interceptor de response - Manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Manejar errores de autenticación (401)
    if (error.response?.status === 401) {
      console.error(`[AUTH] Error 401: ${error.response.data?.message || 'No autorizado'}`)

      // Evitar múltiples limpiezas simultáneas
      if (!isHandlingAuthError) {
        isHandlingAuthError = true

        const authStore = useAuthStore()

        // Limpiar sesión local si el usuario estaba autenticado
        if (authStore.user) {
          authStore.user = null
          localStorage.removeItem('user')
        }

        // Reset después de 1 segundo
        setTimeout(() => {
          isHandlingAuthError = false
        }, 1000)
      }

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
