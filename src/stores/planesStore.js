import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import planesService from '@/services/planesService'

export const usePlanesStore = defineStore('planes', () => {
  // State
  const limites = ref(null)
  const uso = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const tieneAlerta = computed(() => {
    if (!uso.value) return false
    return uso.value.alertaUsuarios ||
           uso.value.alertaClientes ||
           uso.value.alertaCitasMes ||
           uso.value.alertaServicios
  })

  const alertas = computed(() => {
    if (!uso.value) return []
    const resultado = []

    if (uso.value.alertaUsuarios) {
      resultado.push({
        tipo: 'usuarios',
        mensaje: `Usuarios: ${uso.value.totalUsuarios}/${uso.value.limiteUsuarios}`,
        porcentaje: uso.value.porcentajeUsuarios
      })
    }
    if (uso.value.alertaClientes) {
      resultado.push({
        tipo: 'clientes',
        mensaje: `Clientes: ${uso.value.totalClientes}/${uso.value.limiteClientes}`,
        porcentaje: uso.value.porcentajeClientes
      })
    }
    if (uso.value.alertaCitasMes) {
      resultado.push({
        tipo: 'citas',
        mensaje: `Citas este mes: ${uso.value.totalCitasMes}/${uso.value.limiteCitasMes}`,
        porcentaje: uso.value.porcentajeCitasMes
      })
    }
    if (uso.value.alertaServicios) {
      resultado.push({
        tipo: 'servicios',
        mensaje: `Servicios: ${uso.value.totalServicios}/${uso.value.limiteServicios}`,
        porcentaje: uso.value.porcentajeServicios
      })
    }

    return resultado
  })

  const nombrePlan = computed(() => {
    return limites.value?.nombrePlan || 'Cargando...'
  })

  // Actions
  const cargarLimites = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await planesService.obtenerLimites()
      limites.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar límites del plan'
      console.error('Error al cargar límites:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarUso = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await planesService.obtenerUso()
      uso.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar uso del plan'
      console.error('Error al cargar uso:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const cargarTodo = async () => {
    await Promise.all([cargarLimites(), cargarUso()])
  }

  const validarFuncionalidad = async (funcionalidad) => {
    try {
      const response = await planesService.validarFuncionalidad(funcionalidad)
      return response.data
    } catch (err) {
      console.error('Error al validar funcionalidad:', err)
      return false
    }
  }

  const formatearLimite = (valor) => {
    return valor === -1 ? 'Ilimitado' : valor.toString()
  }

  const obtenerColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 90) return 'text-red-600'
    if (porcentaje >= 80) return 'text-orange-500'
    if (porcentaje >= 60) return 'text-yellow-500'
    return 'text-green-600'
  }

  const obtenerColorBarra = (porcentaje) => {
    if (porcentaje >= 90) return 'bg-red-500'
    if (porcentaje >= 80) return 'bg-orange-500'
    if (porcentaje >= 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const limpiarError = () => {
    error.value = null
  }

  return {
    // State
    limites,
    uso,
    loading,
    error,
    // Computed
    tieneAlerta,
    alertas,
    nombrePlan,
    // Actions
    cargarLimites,
    cargarUso,
    cargarTodo,
    validarFuncionalidad,
    formatearLimite,
    obtenerColorPorcentaje,
    obtenerColorBarra,
    limpiarError
  }
})
