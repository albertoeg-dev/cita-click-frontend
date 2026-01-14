import { usePlanesStore } from '@/stores/planesStore'

/**
 * Directiva para ocultar/mostrar elementos según funcionalidades del plan
 *
 * Uso:
 * <button v-requires-feature="'sms_whatsapp'">Enviar SMS</button>
 * <div v-requires-feature="{ feature: 'reportes_avanzados', mode: 'disable' }">Reportes</div>
 *
 * Modos:
 * - hide (default): Oculta el elemento completamente
 * - disable: Deshabilita el elemento (agrega atributo disabled y clases de estilo)
 * - tooltip: Muestra un tooltip explicativo cuando no está disponible
 */
export const requiresFeature = {
  async mounted(el, binding) {
    const planesStore = usePlanesStore()

    // Obtener configuración
    let feature, mode = 'hide', message = null

    if (typeof binding.value === 'string') {
      feature = binding.value
    } else if (typeof binding.value === 'object') {
      feature = binding.value.feature
      mode = binding.value.mode || 'hide'
      message = binding.value.message
    }

    if (!feature) {
      console.warn('[v-requires-feature] No se especificó una funcionalidad')
      return
    }

    try {
      // Verificar si el plan tiene la funcionalidad
      const tieneAcceso = await planesStore.validarFuncionalidad(feature)

      if (!tieneAcceso) {
        // Almacenar estado original
        el._originalDisplay = el.style.display
        el._originalClasses = el.className
        el._originalDisabled = el.disabled

        switch (mode) {
          case 'hide':
            // Ocultar elemento
            el.style.display = 'none'
            break

          case 'disable':
            // Deshabilitar elemento
            el.disabled = true
            el.classList.add('opacity-50', 'cursor-not-allowed')
            el.title = message || `Esta funcionalidad requiere un plan superior`

            // Prevenir clicks
            el.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()
            }, true)
            break

          case 'blur':
            // Aplicar efecto de blur
            el.classList.add('opacity-30', 'pointer-events-none', 'select-none')
            el.style.filter = 'blur(2px)'
            break

          case 'tooltip':
            // Solo agregar tooltip, mantener elemento visible
            el.title = message || `Esta funcionalidad requiere un plan superior`
            el.classList.add('cursor-help')
            break
        }

        // Marcar elemento como restringido
        el._featureRestricted = true
        el._featureMode = mode
      }
    } catch (error) {
      console.error('[v-requires-feature] Error al verificar funcionalidad:', error)
    }
  },

  unmounted(el) {
    // Restaurar estado original si fue modificado
    if (el._featureRestricted) {
      switch (el._featureMode) {
        case 'hide':
          el.style.display = el._originalDisplay || ''
          break

        case 'disable':
          el.disabled = el._originalDisabled || false
          el.className = el._originalClasses || ''
          break

        case 'blur':
          el.className = el._originalClasses || ''
          el.style.filter = ''
          break

        case 'tooltip':
          el.title = ''
          el.classList.remove('cursor-help')
          break
      }

      // Limpiar propiedades internas
      delete el._featureRestricted
      delete el._featureMode
      delete el._originalDisplay
      delete el._originalClasses
      delete el._originalDisabled
    }
  }
}

/**
 * Función helper para registrar la directiva globalmente
 */
export function registerRequiresFeatureDirective(app) {
  app.directive('requires-feature', requiresFeature)
}
