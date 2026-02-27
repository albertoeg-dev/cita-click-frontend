import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useSuscripcionStore = defineStore('suscripcion', () => {
  // Estado
  const info = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const estaBloqueado = computed(() => {
    if (!info.value) return false
    return !info.value.cuentaActiva || info.value.estadoPago === 'vencido'
  })

  const enPeriodoPrueba = computed(() => {
    return info.value?.enPeriodoPrueba || false
  })

  const diasRestantes = computed(() => {
    if (!info.value) return null
    if (info.value.enPeriodoPrueba) {
      return info.value.diasRestantesPrueba
    }
    return info.value.diasRestantesVencimiento
  })

  const necesitaNotificacion = computed(() => {
    return info.value?.necesitaNotificacion || false
  })

  // Acciones
  async function cargarInfoSuscripcion() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/suscripcion/info')

      info.value = response.data
      return response.data
    } catch (err) {
      console.error('Error cargando información de suscripción:', err)
      error.value = err.response?.data?.message || err.message || 'Error desconocido'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function activarSuscripcion(transaccionId, metodoPago = 'stripe') {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/suscripcion/activar', {
        transaccionId,
        metodoPago
      })

      // Recargar información después de activar
      await cargarInfoSuscripcion()

      return response.data
    } catch (err) {
      console.error('Error activando suscripción:', err)
      error.value = err.response?.data?.message || err.message || 'Error desconocido'
      throw err
    } finally {
      loading.value = false
    }
  }

  function limpiarError() {
    error.value = null
  }

  function resetear() {
    info.value = null
    loading.value = false
    error.value = null
  }

  return {
    // Estado
    info,
    loading,
    error,

    // Computed
    estaBloqueado,
    enPeriodoPrueba,
    diasRestantes,
    necesitaNotificacion,

    // Acciones
    cargarInfoSuscripcion,
    activarSuscripcion,
    limpiarError,
    resetear
  }
})
