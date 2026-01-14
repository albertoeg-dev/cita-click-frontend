import { ref } from 'vue'
import api from '../services/api'

/**
 * Composable para integración con Stripe
 */
export function useStripe() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Crea una sesión de checkout de Stripe
   */
  const crearCheckoutSession = async (plan, referencia = null) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/pagos/checkout', {
        plan,
        referencia
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Error creando sesión de checkout')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Error creando checkout:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene el estado de una sesión de checkout
   */
  const obtenerEstadoSesion = async (sessionId) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/pagos/session-status/${sessionId}`)

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Error obteniendo estado de sesión')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Error obteniendo estado:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene el historial de pagos
   */
  const obtenerHistorialPagos = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/pagos/historial')

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Error obteniendo historial')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Error obteniendo historial:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene los planes disponibles
   */
  const obtenerPlanes = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/pagos/planes')

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Error obteniendo planes')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Error obteniendo planes:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    crearCheckoutSession,
    obtenerEstadoSesion,
    obtenerHistorialPagos,
    obtenerPlanes
  }
}
