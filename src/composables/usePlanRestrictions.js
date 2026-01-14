import { computed } from 'vue'
import { usePlanesStore } from '@/stores/planesStore'
import { useSuscripcionStore } from '@/stores/suscripcionStore'

/**
 * Composable para manejar restricciones basadas en el plan del usuario
 * Proporciona funciones y computed properties para validar permisos
 */
export function usePlanRestrictions() {
  const planesStore = usePlanesStore()
  const suscripcionStore = useSuscripcionStore()

  // Plan actual
  const currentPlan = computed(() => {
    return suscripcionStore.info?.plan || 'starter'
  })

  // Verificar si el plan es al menos el requerido
  const hasPlan = (requiredPlan) => {
    const planHierarchy = {
      starter: 1,
      professional: 2,
      enterprise: 3
    }

    const currentLevel = planHierarchy[currentPlan.value?.toLowerCase()] || 0
    const requiredLevel = planHierarchy[requiredPlan?.toLowerCase()] || 0

    return currentLevel >= requiredLevel
  }

  // Funcionalidades específicas por plan
  const canUseReminders = computed(() => hasPlan('professional'))
  const canManageUsers = computed(() => hasPlan('professional'))

  // Límites de recursos
  const limits = computed(() => planesStore.uso || {})

  // Verificar si se alcanzó el límite de un recurso
  const hasReachedLimit = (resource) => {
    if (!planesStore.uso) return false

    const resourceMap = {
      citas: {
        total: planesStore.uso.totalCitasMes,
        limit: planesStore.uso.limiteCitasMes
      },
      clientes: {
        total: planesStore.uso.totalClientes,
        limit: planesStore.uso.limiteClientes
      },
      servicios: {
        total: planesStore.uso.totalServicios,
        limit: planesStore.uso.limiteServicios
      },
      usuarios: {
        total: planesStore.uso.totalUsuarios,
        limit: planesStore.uso.limiteUsuarios
      }
    }

    const resourceData = resourceMap[resource]
    if (!resourceData) return false

    // -1 significa ilimitado
    if (resourceData.limit === -1) return false

    return resourceData.total >= resourceData.limit
  }

  // Verificar si está cerca del límite (80%)
  const isNearLimit = (resource) => {
    if (!planesStore.uso) return false

    const percentageMap = {
      citas: planesStore.uso.porcentajeCitasMes,
      clientes: planesStore.uso.porcentajeClientes,
      servicios: planesStore.uso.porcentajeServicios,
      usuarios: planesStore.uso.porcentajeUsuarios
    }

    const percentage = percentageMap[resource]
    return percentage !== undefined && percentage >= 80
  }

  // Obtener mensaje de restricción
  const getRestrictionMessage = (feature) => {
    const messages = {
      reminders: {
        starter: '¡Actualiza a Professional para enviar recordatorios automáticos por SMS y WhatsApp!',
        professional: 'Incluido en tu plan',
        enterprise: 'Incluido en tu plan'
      },
      users: {
        starter: '¡Actualiza a Professional para invitar a más usuarios a tu equipo!',
        professional: 'Puedes invitar hasta 3 usuarios',
        enterprise: 'Puedes invitar hasta 10 usuarios'
      }
    }

    const plan = currentPlan.value?.toLowerCase() || 'starter'
    return messages[feature]?.[plan] || ''
  }

  // Obtener mensaje de límite alcanzado
  const getLimitMessage = (resource) => {
    if (!planesStore.uso) return ''

    const resourceMap = {
      citas: {
        total: planesStore.uso.totalCitasMes,
        limit: planesStore.uso.limiteCitasMes,
        name: 'citas este mes'
      },
      clientes: {
        total: planesStore.uso.totalClientes,
        limit: planesStore.uso.limiteClientes,
        name: 'clientes'
      },
      servicios: {
        total: planesStore.uso.totalServicios,
        limit: planesStore.uso.limiteServicios,
        name: 'servicios'
      },
      usuarios: {
        total: planesStore.uso.totalUsuarios,
        limit: planesStore.uso.limiteUsuarios,
        name: 'usuarios'
      }
    }

    const data = resourceMap[resource]
    if (!data) return ''

    if (data.limit === -1) {
      return `${data.total} ${data.name} (ilimitado)`
    }

    if (data.total >= data.limit) {
      return `Has alcanzado el límite de ${data.limit} ${data.name}. ¡Actualiza tu plan para continuar!`
    }

    if (data.total / data.limit >= 0.8) {
      return `Estás usando ${data.total}/${data.limit} ${data.name}. Considera actualizar tu plan.`
    }

    return `${data.total}/${data.limit} ${data.name} utilizados`
  }

  // Computed properties para usabilidad
  const canCreateCita = computed(() => !hasReachedLimit('citas'))
  const canCreateCliente = computed(() => !hasReachedLimit('clientes'))
  const canCreateServicio = computed(() => !hasReachedLimit('servicios'))
  const canInviteUser = computed(() => canManageUsers.value && !hasReachedLimit('usuarios'))

  return {
    // Plan info
    currentPlan,
    hasPlan,

    // Feature permissions
    canUseReminders,
    canManageUsers,

    // Resource limits
    limits,
    hasReachedLimit,
    isNearLimit,

    // Action permissions
    canCreateCita,
    canCreateCliente,
    canCreateServicio,
    canInviteUser,

    // Messages
    getRestrictionMessage,
    getLimitMessage
  }
}
