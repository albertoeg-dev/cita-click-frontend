import { ref, computed } from 'vue'
import api from '@/services/api'

/**
 * Composable para métricas del dashboard
 */
export function useDashboardMetricas() {
  const metricas = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Carga las métricas del dashboard
   */
  const cargarMetricas = async () => {
    loading.value = true
    error.value = null

    try {

      const response = await api.get('/dashboard/metricas')

      if (response.data.success) {
        metricas.value = response.data.data
      } else {
        error.value = response.data.message || 'Error al cargar métricas'
        console.error('[useDashboardMetricas] Error en respuesta:', error.value)
      }
    } catch (err) {
      console.error('[useDashboardMetricas] Error:', err)
      error.value = err.response?.data?.message || 'Error al cargar métricas del dashboard'
    } finally {
      loading.value = false
    }
  }

  // Computed properties para acceso fácil a las métricas

  const ingresos = computed(() => metricas.value?.ingresos || null)

  const citas = computed(() => metricas.value?.citas || null)

  const servicios = computed(() => metricas.value?.servicios || null)

  const tendenciaSemanal = computed(() => metricas.value?.tendenciaSemanal || [])

  /**
   * Formatea un número como moneda
   */
  const formatearMoneda = (valor) => {
    if (!valor && valor !== 0) return '$0.00'
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor)
  }

  /**
   * Formatea un porcentaje
   */
  const formatearPorcentaje = (valor) => {
    if (!valor && valor !== 0) return '0%'
    const signo = valor > 0 ? '+' : ''
    return `${signo}${valor.toFixed(1)}%`
  }

  /**
   * Determina el color según el porcentaje de cambio
   */
  const colorPorcentaje = (valor) => {
    if (!valor) return 'text-gray-600'
    return valor > 0 ? 'text-green-600' : 'text-red-600'
  }

  /**
   * Icono según el porcentaje de cambio
   */
  const iconoPorcentaje = (valor) => {
    if (!valor) return 'minus'
    return valor > 0 ? 'arrow-up' : 'arrow-down'
  }

  /**
   * Datos para gráfica de tendencia (Chart.js)
   */
  const datosGraficaTendencia = computed(() => {
    if (!tendenciaSemanal.value || tendenciaSemanal.value.length === 0) {
      return null
    }

    return {
      labels: tendenciaSemanal.value.map(d => {
        const fecha = new Date(d.fecha)
        return fecha.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' })
      }),
      datasets: [
        {
          label: 'Citas',
          data: tendenciaSemanal.value.map(d => d.citas),
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Ingresos',
          data: tendenciaSemanal.value.map(d => d.ingresos),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    }
  })

  /**
   * Datos para gráfica de citas por día (Chart.js)
   */
  const datosGraficaCitasPorDia = computed(() => {
    if (!citas.value?.citasPorDia) return null

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    const data = dias.map(dia => citas.value.citasPorDia[dia] || 0)

    return {
      labels: dias,
      datasets: [
        {
          label: 'Citas',
          data: data,
          backgroundColor: 'rgba(79, 70, 229, 0.6)',
          borderColor: 'rgb(79, 70, 229)',
          borderWidth: 2
        }
      ]
    }
  })

  /**
   * Datos para gráfica de citas por hora (Chart.js)
   */
  const datosGraficaCitasPorHora = computed(() => {
    if (!citas.value?.citasPorHora) return null

    // Ordenar horas
    const horas = Object.keys(citas.value.citasPorHora).sort()
    const data = horas.map(hora => citas.value.citasPorHora[hora])

    return {
      labels: horas,
      datasets: [
        {
          label: 'Citas',
          data: data,
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2
        }
      ]
    }
  })

  return {
    // Estado
    metricas,
    loading,
    error,

    // Computed
    ingresos,
    citas,
    servicios,
    tendenciaSemanal,
    datosGraficaTendencia,
    datosGraficaCitasPorDia,
    datosGraficaCitasPorHora,

    // Métodos
    cargarMetricas,
    formatearMoneda,
    formatearPorcentaje,
    colorPorcentaje,
    iconoPorcentaje
  }
}
