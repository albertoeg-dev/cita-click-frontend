/**
 * Composable para usar el sistema de notificaciones Toast
 * Uso: const toast = useToast()
 *      toast.success('Operación exitosa')
 */

import { getCurrentInstance } from 'vue'

export function useToast() {
  const instance = getCurrentInstance()

  if (!instance) {
    console.error('[useToast] Debe ser usado dentro de un componente Vue')
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
    }
  }

  // Buscar el componente Toast en la raíz de la aplicación
  const toastComponent = instance.appContext.config.globalProperties.$toast

  if (!toastComponent) {
    console.warn('[useToast] Componente Toast no encontrado. Asegúrate de haberlo registrado globalmente.')
    return {
      success: (message) => console.log('Toast success:', message),
      error: (message) => console.error('Toast error:', message),
      warning: (message) => console.warn('Toast warning:', message),
      info: (message) => console.info('Toast info:', message),
    }
  }

  return {
    success: (message, description = '', duration = 3000) => {
      toastComponent.success(message, description, duration)
    },
    error: (message, description = '', duration = 5000) => {
      toastComponent.error(message, description, duration)
    },
    warning: (message, description = '', duration = 4000) => {
      toastComponent.warning(message, description, duration)
    },
    info: (message, description = '', duration = 3000) => {
      toastComponent.info(message, description, duration)
    },
  }
}
