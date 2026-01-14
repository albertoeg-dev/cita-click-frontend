import { ref, computed } from 'vue'
import api from '@/services/api'

/**
 * Composable para consultar disponibilidad de horarios
 */
export function useDisponibilidad() {
  const horarios = ref([])
  const loading = ref(false)
  const error = ref(null)
  const duracionTotal = ref(0)

  /**
   * Obtiene los horarios disponibles para una fecha y servicio(s)
   */
  const obtenerHorariosDisponibles = async (fecha, servicioIds, citaIdExcluir = null) => {
    if (!fecha || !servicioIds || servicioIds.length === 0) {
      console.warn('[useDisponibilidad] Fecha o servicios no proporcionados')
      return
    }

    loading.value = true
    error.value = null
    horarios.value = []

    try {
      console.log('[useDisponibilidad] Consultando disponibilidad:', { fecha, servicioIds })

      const response = await api.post('/citas/disponibilidad', {
        fecha,
        servicioIds,
        citaIdExcluir
      })

      if (response.data.success) {
        const data = response.data.data
        horarios.value = data.horariosDisponibles || []
        duracionTotal.value = data.duracionTotal || 0

        console.log('[useDisponibilidad] Horarios obtenidos:', horarios.value.length)
      } else {
        error.value = response.data.message || 'Error al obtener disponibilidad'
        console.error('[useDisponibilidad] Error en respuesta:', error.value)
      }
    } catch (err) {
      console.error('[useDisponibilidad] Error:', err)
      error.value = err.response?.data?.message || 'Error al consultar disponibilidad'
      horarios.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Horarios recomendados (10:00 - 16:00)
   */
  const horariosRecomendados = computed(() => {
    return horarios.value.filter(h => h.recomendado)
  })

  /**
   * Otros horarios (fuera del horario recomendado)
   */
  const otrosHorarios = computed(() => {
    return horarios.value.filter(h => !h.recomendado)
  })

  /**
   * Verifica si hay horarios disponibles
   */
  const hayHorarios = computed(() => {
    return horarios.value.length > 0
  })

  /**
   * Limpia los datos
   */
  const limpiar = () => {
    horarios.value = []
    error.value = null
    duracionTotal.value = 0
  }

  return {
    // Estado
    horarios,
    loading,
    error,
    duracionTotal,

    // Computed
    horariosRecomendados,
    otrosHorarios,
    hayHorarios,

    // Métodos
    obtenerHorariosDisponibles,
    limpiar
  }
}
