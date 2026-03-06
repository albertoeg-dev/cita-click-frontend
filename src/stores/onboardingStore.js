import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

// Configuración de los pasos del tour para cada página
const TOUR_CONFIG = {
  'agregar-servicio': {
    instruccion: 'Haz clic aquí para agregar tu primer servicio',
    pagina: 'servicios'
  },
  'agregar-cliente': {
    instruccion: 'Haz clic aquí para registrar tu primer cliente',
    pagina: 'clientes'
  },
  'agregar-cita': {
    instruccion: 'Haz clic aquí para crear tu primera cita',
    pagina: 'citas'
  },
  'configurar-horarios': {
    instruccion: 'Haz clic en esta pestaña para configurar tus horarios de atención',
    pagina: 'configuracion'
  }
}

export const useOnboardingStore = defineStore('onboarding', () => {
  // Estado
  const onboardingCompleto = ref(false)
  const tourActivo = ref(null) // { target: 'agregar-servicio', instruccion: '...' } | null
  const cargando = ref(false)

  // Computed
  const hayTourActivo = computed(() => tourActivo.value !== null)
  const instruccionTour = computed(() => tourActivo.value?.instruccion || '')

  // Sincronizar con el estado de suscripción/perfil del negocio
  function sincronizarDesdeInfo(info) {
    if (info && typeof info.onboardingCompleto !== 'undefined') {
      onboardingCompleto.value = info.onboardingCompleto
    }
  }

  // Marcar onboarding como completado en el backend
  async function completarOnboarding() {
    cargando.value = true
    try {
      await api.post('/negocios/onboarding/completar')
      onboardingCompleto.value = true
    } catch (err) {
      console.error('[Onboarding] Error al completar onboarding:', err)
      throw err
    } finally {
      cargando.value = false
    }
  }

  // Activar spotlight tour apuntando a un elemento data-tour
  function activarTour(target) {
    const config = TOUR_CONFIG[target]
    if (!config) return
    tourActivo.value = {
      target,
      instruccion: config.instruccion
    }
  }

  // Desactivar spotlight tour
  function desactivarTour() {
    tourActivo.value = null
  }

  function resetear() {
    onboardingCompleto.value = false
    tourActivo.value = null
    cargando.value = false
  }

  return {
    // Estado
    onboardingCompleto,
    tourActivo,
    cargando,

    // Computed
    hayTourActivo,
    instruccionTour,

    // Acciones
    sincronizarDesdeInfo,
    completarOnboarding,
    activarTour,
    desactivarTour,
    resetear
  }
})
