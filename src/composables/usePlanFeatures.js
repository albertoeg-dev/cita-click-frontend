import { ref, computed } from 'vue'
import { usePlanesStore } from '@/stores/planesStore'

/**
 * Composable para verificar disponibilidad de funcionalidades según el plan
 */
export function usePlanFeatures() {
  const planesStore = usePlanesStore()
  const verificando = ref(false)

  /**
   * Verifica si el plan del usuario tiene acceso a una funcionalidad
   * @param {string} funcionalidad - Nombre de la funcionalidad (sms_whatsapp, reportes_avanzados, etc)
   * @returns {Promise<boolean>}
   */
  const tieneFuncionalidad = async (funcionalidad) => {
    verificando.value = true
    try {
      const resultado = await planesStore.validarFuncionalidad(funcionalidad)
      return resultado
    } catch (error) {
      console.error('[usePlanFeatures] Error al verificar funcionalidad:', error)
      return false
    } finally {
      verificando.value = false
    }
  }

  /**
   * Verifica múltiples funcionalidades
   * @param {string[]} funcionalidades - Array de nombres de funcionalidades
   * @returns {Promise<Object>} - Objeto con el resultado de cada funcionalidad
   */
  const verificarMultiples = async (funcionalidades) => {
    verificando.value = true
    try {
      const resultados = {}
      await Promise.all(
        funcionalidades.map(async (func) => {
          resultados[func] = await planesStore.validarFuncionalidad(func)
        })
      )
      return resultados
    } catch (error) {
      console.error('[usePlanFeatures] Error al verificar funcionalidades:', error)
      return {}
    } finally {
      verificando.value = false
    }
  }

  /**
   * Computed que retorna el nombre del plan actual
   */
  const planActual = computed(() => planesStore.nombrePlan)

  /**
   * Computed que indica si hay límites activos
   */
  const tieneLimites = computed(() => {
    return planesStore.limites !== null
  })

  /**
   * Computed que indica si el usuario tiene acceso a reportes avanzados
   */
  const tieneReportesAvanzados = computed(() => {
    return planesStore.limites?.reportesAvanzadosHabilitado || false
  })

  /**
   * Computed que indica si el usuario tiene soporte prioritario
   */
  const tieneSoportePrioritario = computed(() => {
    return planesStore.limites?.soportePrioritario || false
  })

  /**
   * Computed que retorna el código del plan (basico, profesional, premium)
   */
  const tipoPlan = computed(() => {
    return planesStore.limites?.tipoPlan?.toLowerCase() || 'basico'
  })

  /**
   * Funcionalidades disponibles por plan (definición local para UI)
   * ACTUALIZADO 2026-01-12: Nuevos planes BASICO, PROFESIONAL, PREMIUM
   */
  const funcionalidadesPorPlan = {
    BASICO: {
      sms_whatsapp: false,
      reportes_avanzados: false,
      soporte_prioritario: false
    },
    PROFESIONAL: {
      sms_whatsapp: false,  // Disponible Q2 2026
      reportes_avanzados: true,
      soporte_prioritario: false
    },
    PREMIUM: {
      sms_whatsapp: false,  // Disponible Q2 2026
      reportes_avanzados: true,
      soporte_prioritario: true
    }
  }

  /**
   * Mensajes descriptivos para funcionalidades bloqueadas
   * ACTUALIZADO 2026-01-12: Mensajes para nuevos planes
   */
  const mensajesFuncionalidades = {
    sms_whatsapp: 'Las notificaciones por WhatsApp y SMS estarán disponibles en el plan Premium a partir de Q2 2026',
    reportes_avanzados: 'Los reportes avanzados con exportación a PDF y Excel están disponibles en los planes Profesional y Premium',
    soporte_prioritario: 'El soporte prioritario con respuesta en menos de 6 horas está disponible solo en el plan Premium'
  }

  /**
   * Obtiene el mensaje descriptivo de una funcionalidad
   */
  const obtenerMensaje = (funcionalidad) => {
    return mensajesFuncionalidades[funcionalidad] || 'Esta funcionalidad no está disponible en tu plan actual'
  }

  return {
    // Estado
    verificando,
    planActual,
    tipoPlan,
    tieneLimites,

    // Features
    tieneReportesAvanzados,
    tieneSoportePrioritario,

    // Métodos
    tieneFuncionalidad,
    verificarMultiples,
    obtenerMensaje,

    // Constantes
    funcionalidadesPorPlan,
    mensajesFuncionalidades
  }
}
