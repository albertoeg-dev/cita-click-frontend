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
    
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`)
    if (authStore.token) {
      console.log(`[AUTH] Token presente: ${authStore.token.substring(0, 20)}...`)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de response - Manejar errores
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`)
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('[AUTH] Token inválido o expirado')
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    
    if (error.response?.status === 403) {
      console.error('[AUTH] Acceso denegado (403)')
      console.error('Error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

export default api