import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import modulosService from '@/services/modulosService'

/**
 * Store del marketplace de módulos.
 *
 * Responsabilidades:
 *  - Cargar el catálogo de módulos con estado activo/inactivo para el negocio
 *  - Exponer tieneModulo(clave) para guards de router y vistas
 *  - Coordinar checkout y cancelación de módulos
 */
export const useModulosStore = defineStore('modulos', () => {
  // ============================================================
  // State
  // ============================================================
  const modulos = ref([])         // Lista de ModuloNegocioDTO con campo 'activado'
  const loading = ref(false)
  const error = ref(null)
  const cargado = ref(false)      // true cuando al menos se ha cargado una vez

  // ============================================================
  // Computed
  // ============================================================

  /** Módulos que el negocio tiene actualmente activos */
  const modulosActivos = computed(() =>
    modulos.value.filter(m => m.activado)
  )

  /** Precio total de los módulos activos (suma mensual) */
  const totalMensualModulos = computed(() =>
    modulosActivos.value.reduce((sum, m) => sum + (m.precioMensual || 0), 0)
  )

  // ============================================================
  // Actions
  // ============================================================

  /**
   * Carga el catálogo de módulos con estado para el negocio del usuario.
   * Idempotente si ya está cargado, a menos que se fuerce con force=true.
   */
  const cargarModulos = async (force = false) => {
    if (cargado.value && !force) return

    loading.value = true
    error.value = null
    try {
      const response = await modulosService.listarModulosConEstado()
      modulos.value = response.data || []
      cargado.value = true
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar módulos'
      console.error('[modulosStore] Error al cargar módulos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Verifica si el negocio tiene activo un módulo específico.
   * Si los módulos no están cargados, retorna false (no bloquea el UI).
   *
   * @param {string} clave - Clave del módulo (ej: 'reportes_avanzados')
   * @returns {boolean}
   */
  const tieneModulo = (clave) => {
    if (!cargado.value) return false
    return modulos.value.some(m => m.clave === clave && m.activado)
  }

  /**
   * Inicia el checkout de Stripe para activar un módulo.
   * Redirige al usuario a la URL de Stripe Hosted Checkout.
   *
   * @param {string} clave - Clave del módulo a activar
   */
  /**
   * Obtiene la sesión de checkout del módulo sin redirigir aún.
   * Devuelve los datos (url, diasRestantesCiclo, proximaRenovacionTimestamp)
   * para que el componente pueda mostrar el aviso de prorrateo antes de redirigir.
   */
  const obtenerCheckoutModulo = async (clave) => {
    loading.value = true
    error.value = null
    try {
      const response = await modulosService.crearCheckout(clave)
      if (!response.data?.url) throw new Error('URL de checkout no disponible')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al iniciar el pago'
      console.error('[modulosStore] Error al obtener checkout:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const activarModulo = async (clave) => {
    const data = await obtenerCheckoutModulo(clave)
    window.location.href = data.url
  }

  /**
   * Cancela un módulo activo y recarga la lista.
   *
   * @param {string} clave - Clave del módulo a cancelar
   */
  const cancelarModulo = async (clave) => {
    loading.value = true
    error.value = null
    try {
      await modulosService.cancelarModulo(clave)
      await cargarModulos(true)  // Refrescar estado
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cancelar el módulo'
      console.error('[modulosStore] Error al cancelar módulo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const limpiar = () => {
    modulos.value = []
    cargado.value = false
    error.value = null
  }

  // ============================================================
  // Exports
  // ============================================================
  return {
    // State
    modulos,
    loading,
    error,
    cargado,
    // Computed
    modulosActivos,
    totalMensualModulos,
    // Actions
    cargarModulos,
    tieneModulo,
    activarModulo,
    obtenerCheckoutModulo,
    cancelarModulo,
    limpiar
  }
})
