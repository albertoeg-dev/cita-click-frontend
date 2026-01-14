<template>
  <DashboardLayout>
    <template #title>
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Reportes
      </div>
    </template>

    <div class="mb-6">
      <h2 class="text-3xl font-bold text-slate-900 mb-2">Reportes y Estadísticas</h2>
      <p class="text-slate-600">Visualiza y descarga reportes detallados de tu negocio</p>
    </div>

    <!-- Filtros de Fecha -->
    <div class="card mb-6">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Seleccionar Período</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
          <select
            v-model="tipoReporte"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="diario">Reporte Diario</option>
            <option value="semanal">Reporte Semanal</option>
            <option value="mensual">Reporte Mensual</option>
          </select>
        </div>

        <DatePicker
          v-if="tipoReporte === 'diario'"
          v-model="fechaSeleccionada"
          label="Fecha"
          :required="true"
        />

        <div v-if="tipoReporte === 'semanal'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Semana</label>
          <input
            v-model="semanaSeleccionada"
            type="week"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div v-if="tipoReporte === 'mensual'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Mes</label>
          <input
            v-model="mesSeleccionado"
            type="month"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex items-end gap-2">
          <button
            @click="cargarReporte"
            :disabled="reportesStore.loading || !puedeCargarReporte"
            class="btn btn-primary flex-1"
          >
            <LoadingSpinner v-if="reportesStore.loading" size="sm" class="mr-2" />
            Generar Reporte
          </button>
        </div>
      </div>
    </div>

    <!-- Reporte Generado -->
    <div v-if="reporteActual" class="space-y-6">
      <!-- Resumen General -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-900">
            {{ tituloReporte }}
          </h3>
          <div class="flex gap-2">
            <button
              @click="descargarPDF"
              :disabled="descargando"
              class="btn btn-secondary btn-sm flex items-center gap-1"
            >
              <LoadingSpinner v-if="descargando" size="sm" />
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Descargar PDF
            </button>
            <button
              @click="descargarExcel"
              :disabled="descargando"
              class="btn btn-secondary btn-sm flex items-center gap-1"
            >
              <LoadingSpinner v-if="descargando" size="sm" />
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar Excel
            </button>
          </div>
        </div>

        <!-- Métricas Principales -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-900 font-medium">Total de Citas</p>
            <p class="text-2xl font-bold text-blue-900 mt-1">{{ reporteActual.totalCitas || 0 }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg border border-green-200">
            <p class="text-sm text-green-900 font-medium">Citas Completadas</p>
            <p class="text-2xl font-bold text-green-900 mt-1">{{ reporteActual.citasCompletadas || 0 }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg border border-red-200">
            <p class="text-sm text-red-900 font-medium">Citas Canceladas</p>
            <p class="text-2xl font-bold text-red-900 mt-1">{{ reporteActual.citasCanceladas || 0 }}</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p class="text-sm text-purple-900 font-medium">Ingresos Totales</p>
            <p class="text-2xl font-bold text-purple-900 mt-1">{{ formatearPrecio(reporteActual.ingresosTotales || 0) }}</p>
          </div>
        </div>

        <!-- Información Adicional -->
        <div v-if="reporteActual.periodo" class="text-sm text-slate-600">
          <p><strong>Período:</strong> {{ reporteActual.periodo }}</p>
        </div>
      </div>

      <!-- Citas por Estado -->
      <div class="card">
        <h4 class="font-semibold text-slate-900 mb-4">Distribución por Estado</h4>
        <div class="space-y-3">
          <div
            v-for="estado in estadisticasPorEstado"
            :key="estado.nombre"
            class="flex items-center justify-between p-3 rounded-lg"
            :class="estado.bg"
          >
            <div class="flex items-center gap-3">
              <Badge :variant="estado.variant" class="text-xs">{{ estado.label }}</Badge>
              <span class="font-medium text-slate-900">{{ estado.nombre }}</span>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-slate-900">{{ estado.cantidad }}</p>
              <p class="text-xs text-slate-600">{{ estado.porcentaje }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Servicios Más Solicitados -->
      <div v-if="reporteActual.serviciosMasSolicitados && reporteActual.serviciosMasSolicitados.length > 0" class="card">
        <h4 class="font-semibold text-slate-900 mb-4">Servicios Más Solicitados</h4>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="servicio in reporteActual.serviciosMasSolicitados" :key="servicio.nombre">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ servicio.nombre }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ servicio.cantidad }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatearPrecio(servicio.ingresos) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Clientes Frecuentes -->
      <div v-if="reporteActual.clientesFrecuentes && reporteActual.clientesFrecuentes.length > 0" class="card">
        <h4 class="font-semibold text-slate-900 mb-4">Clientes Frecuentes</h4>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Citas
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Gastado
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="cliente in reporteActual.clientesFrecuentes" :key="cliente.nombre">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ cliente.nombre }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ cliente.cantidadCitas }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatearPrecio(cliente.totalGastado) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!reportesStore.loading"
      title="Selecciona un período"
      description="Elige el tipo de reporte y el período para visualizar las estadísticas de tu negocio"
    >
      <template #icon>
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </template>
    </EmptyState>

    <!-- Loading State -->
    <div v-else-if="reportesStore.loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useReportesStore } from '../stores/reportesStore'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import DatePicker from '../components/common/DatePicker.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import Badge from '../components/common/Badge.vue'
import { formatearPrecio } from '../utils/formatters'

const reportesStore = useReportesStore()
const toast = useToast()

// Estado
const tipoReporte = ref('diario')
const fechaSeleccionada = ref('')
const semanaSeleccionada = ref('')
const mesSeleccionado = ref('')
const reporteActual = ref(null)
const descargando = ref(false)

// Computed
const puedeCargarReporte = computed(() => {
  if (tipoReporte.value === 'diario') return !!fechaSeleccionada.value
  if (tipoReporte.value === 'semanal') return !!semanaSeleccionada.value
  if (tipoReporte.value === 'mensual') return !!mesSeleccionado.value
  return false
})

const tituloReporte = computed(() => {
  if (!reporteActual.value) return ''

  if (tipoReporte.value === 'diario') {
    return `Reporte Diario - ${formatearFechaLarga(fechaSeleccionada.value)}`
  } else if (tipoReporte.value === 'semanal') {
    return `Reporte Semanal - ${semanaSeleccionada.value}`
  } else if (tipoReporte.value === 'mensual') {
    return `Reporte Mensual - ${formatearMes(mesSeleccionado.value)}`
  }
  return 'Reporte'
})

const estadisticasPorEstado = computed(() => {
  if (!reporteActual.value) return []

  const total = reporteActual.value.totalCitas || 0
  const calcularPorcentaje = (cantidad) => total > 0 ? Math.round((cantidad / total) * 100) : 0

  return [
    {
      nombre: 'Pendientes',
      label: 'P',
      variant: 'warning',
      bg: 'bg-yellow-50',
      cantidad: reporteActual.value.citasPendientes || 0,
      porcentaje: calcularPorcentaje(reporteActual.value.citasPendientes || 0)
    },
    {
      nombre: 'Confirmadas',
      label: 'C',
      variant: 'info',
      bg: 'bg-blue-50',
      cantidad: reporteActual.value.citasConfirmadas || 0,
      porcentaje: calcularPorcentaje(reporteActual.value.citasConfirmadas || 0)
    },
    {
      nombre: 'Completadas',
      label: '✓',
      variant: 'success',
      bg: 'bg-green-50',
      cantidad: reporteActual.value.citasCompletadas || 0,
      porcentaje: calcularPorcentaje(reporteActual.value.citasCompletadas || 0)
    },
    {
      nombre: 'Canceladas',
      label: 'X',
      variant: 'danger',
      bg: 'bg-red-50',
      cantidad: reporteActual.value.citasCanceladas || 0,
      porcentaje: calcularPorcentaje(reporteActual.value.citasCanceladas || 0)
    }
  ]
})

// Métodos
const formatearFechaLarga = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha + 'T00:00:00')
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatearMes = (mes) => {
  if (!mes) return ''
  const [año, mesNum] = mes.split('-')
  const date = new Date(año, mesNum - 1)
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long' })
}

const cargarReporte = async () => {
  try {
    console.log('[ReportsPage] Cargando reporte:', tipoReporte.value)

    let reporte = null

    if (tipoReporte.value === 'diario') {
      reporte = await reportesStore.obtenerReporteDiario(fechaSeleccionada.value)
    } else if (tipoReporte.value === 'semanal') {
      // Convertir semana ISO a fechaInicio y fechaFin
      const [año, semana] = semanaSeleccionada.value.split('-W')
      const fechaInicio = obtenerFechaInicioSemana(parseInt(año), parseInt(semana))
      const fechaFin = new Date(fechaInicio)
      fechaFin.setDate(fechaFin.getDate() + 6)

      reporte = await reportesStore.obtenerReporteSemanal(
        formatearFecha(fechaInicio),
        formatearFecha(fechaFin)
      )
    } else if (tipoReporte.value === 'mensual') {
      const [año, mes] = mesSeleccionado.value.split('-')
      reporte = await reportesStore.obtenerReporteMensual(parseInt(año), parseInt(mes))
    }

    reporteActual.value = reporte
    toast.success('Reporte generado', 'El reporte se generó correctamente')
  } catch (error) {
    console.error('[ReportsPage] Error al cargar reporte:', error)
    toast.error('Error al generar reporte', error.message || 'Intenta de nuevo')
  }
}

const descargarPDF = async () => {
  descargando.value = true

  try {
    console.log('[ReportsPage] Descargando PDF')

    if (tipoReporte.value === 'diario') {
      await reportesStore.descargarReporteDiarioPDF(fechaSeleccionada.value)
    } else if (tipoReporte.value === 'semanal') {
      const [año, semana] = semanaSeleccionada.value.split('-W')
      const fechaInicio = obtenerFechaInicioSemana(parseInt(año), parseInt(semana))
      const fechaFin = new Date(fechaInicio)
      fechaFin.setDate(fechaFin.getDate() + 6)

      await reportesStore.descargarReporteSemanalPDF(
        formatearFecha(fechaInicio),
        formatearFecha(fechaFin)
      )
    } else if (tipoReporte.value === 'mensual') {
      const [año, mes] = mesSeleccionado.value.split('-')
      await reportesStore.descargarReporteMensualPDF(parseInt(año), parseInt(mes))
    }

    toast.success('Descarga iniciada', 'El PDF se está descargando')
  } catch (error) {
    console.error('[ReportsPage] Error al descargar PDF:', error)
    toast.error('Error al descargar', error.message || 'No se pudo descargar el PDF')
  } finally {
    descargando.value = false
  }
}

const descargarExcel = async () => {
  descargando.value = true

  try {
    console.log('[ReportsPage] Descargando Excel')

    if (tipoReporte.value === 'diario') {
      await reportesStore.descargarReporteDiarioExcel(fechaSeleccionada.value)
    } else if (tipoReporte.value === 'semanal') {
      const [año, semana] = semanaSeleccionada.value.split('-W')
      const fechaInicio = obtenerFechaInicioSemana(parseInt(año), parseInt(semana))
      const fechaFin = new Date(fechaInicio)
      fechaFin.setDate(fechaFin.getDate() + 6)

      await reportesStore.descargarReporteSemanalExcel(
        formatearFecha(fechaInicio),
        formatearFecha(fechaFin)
      )
    } else if (tipoReporte.value === 'mensual') {
      const [año, mes] = mesSeleccionado.value.split('-')
      await reportesStore.descargarReporteMensualExcel(parseInt(año), parseInt(mes))
    }

    toast.success('Descarga iniciada', 'El archivo Excel se está descargando')
  } catch (error) {
    console.error('[ReportsPage] Error al descargar Excel:', error)
    toast.error('Error al descargar', error.message || 'No se pudo descargar el archivo')
  } finally {
    descargando.value = false
  }
}

// Utilidades
const obtenerFechaInicioSemana = (año, semana) => {
  const simple = new Date(año, 0, 1 + (semana - 1) * 7)
  const dow = simple.getDay()
  const ISOweekStart = simple
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
  }
  return ISOweekStart
}

const formatearFecha = (fecha) => {
  const año = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${año}-${mes}-${dia}`
}
</script>
