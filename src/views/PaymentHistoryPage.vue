<template>
  <DashboardLayout>
    <template #title>
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Historial de Pagos
      </div>
    </template>

    <div class="mb-6">
      <h2 class="text-3xl font-bold text-slate-900 mb-2">Historial de Pagos</h2>
      <p class="text-slate-600">Consulta todos los pagos de tu suscripción</p>
    </div>

    <!-- Estadísticas -->
    <div v-if="estadisticas" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="card bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Total de Pagos</p>
            <p class="text-3xl font-bold mt-2">{{ estadisticas.totalPagos }}</p>
          </div>
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Monto Total</p>
            <p class="text-3xl font-bold mt-2">{{ formatearPrecio(estadisticas.montoTotal) }}</p>
          </div>
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de pagos -->
    <div class="card">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-slate-900">Historial Completo</h3>
      </div>

      <!-- Loading -->
      <div v-if="cargando" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Empty state -->
      <EmptyState
        v-else-if="pagos.length === 0"
        title="No hay pagos registrados"
        message="Aún no se han registrado pagos en tu cuenta"
      >
        <template #icon>
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </template>
      </EmptyState>

      <!-- Tabla -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="pago in pagos" :key="pago.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatearFecha(pago.fechaCreacion) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getBadgeVariantPlan(pago.plan)">
                  {{ formatearPlan(pago.plan) }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {{ formatearPrecio(pago.monto) }} {{ pago.moneda }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatearMetodo(pago.metodoPago) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getBadgeVariantEstado(pago.estado)">
                  {{ formatearEstado(pago.estado) }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div v-if="pago.periodoInicio && pago.periodoFin">
                  {{ formatearPeriodo(pago.periodoInicio, pago.periodoFin) }}
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  v-if="pago.facturaUrl"
                  @click="descargarFactura(pago.facturaUrl)"
                  class="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Factura
                </button>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import Badge from '../components/common/Badge.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import pagoService from '../services/pagoService'
import { useToast } from '../composables/useToast'
import { formatearPrecio } from '../utils/formatters'

const toast = useToast()
const pagos = ref([])
const estadisticas = ref(null)
const cargando = ref(false)

const cargarDatos = async () => {
  cargando.value = true
  try {
    // Cargar historial y estadísticas en paralelo
    const [historialRes, statsRes] = await Promise.all([
      pagoService.obtenerHistorial(),
      pagoService.obtenerEstadisticas()
    ])

    pagos.value = historialRes.data || []
    estadisticas.value = statsRes.data || null
  } catch (error) {
    console.error('[PaymentHistory] Error al cargar datos:', error)
    toast.error('Error al cargar historial de pagos', error.message)
  } finally {
    cargando.value = false
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatearPlan = (plan) => {
  if (!plan) return '-'
  const planes = {
    // Valores reales almacenados en DB (lowercase)
    basico: 'Básico',
    profesional: 'Profesional',
    premium: 'Premium',
    // Alias legacy
    starter: 'Básico',
    professional: 'Profesional',
    enterprise: 'Premium',
    BASICO: 'Básico',
    PROFESIONAL: 'Profesional',
    PREMIUM: 'Premium'
  }
  return planes[plan] || plan
}

const formatearMetodo = (metodo) => {
  const metodos = {
    card: 'Tarjeta',
    oxxo: 'OXXO',
    spei: 'SPEI/Transferencia'
  }
  return metodos[metodo] || metodo || '-'
}

const formatearEstado = (estado) => {
  const estados = {
    completed: 'Completado',
    pending: 'Pendiente',
    failed: 'Fallido',
    refunded: 'Reembolsado'
  }
  return estados[estado] || estado
}

const formatearPeriodo = (inicio, fin) => {
  const fechaInicio = new Date(inicio).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  const fechaFin = new Date(fin).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  return `${fechaInicio} - ${fechaFin}`
}

const getBadgeVariantPlan = (plan) => {
  const variants = {
    // Valores reales almacenados en DB (lowercase)
    basico: 'info',
    profesional: 'warning',
    premium: 'success',
    // Alias legacy
    starter: 'info',
    professional: 'warning',
    enterprise: 'success',
    BASICO: 'info',
    PROFESIONAL: 'warning',
    PREMIUM: 'success'
  }
  return variants[plan] || 'default'
}

const getBadgeVariantEstado = (estado) => {
  const variants = {
    completed: 'success',
    pending: 'warning',
    failed: 'danger',
    refunded: 'info'
  }
  return variants[estado] || 'default'
}

const descargarFactura = (url) => {
  window.open(url, '_blank')
}

onMounted(() => {
  cargarDatos()
})
</script>
