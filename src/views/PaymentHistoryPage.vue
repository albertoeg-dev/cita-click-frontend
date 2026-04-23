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

    <!-- Banner datos fiscales -->
    <div class="card border border-indigo-200 bg-indigo-50 mb-6">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <p class="text-sm font-semibold text-indigo-900">¿Necesitas factura de algún pago?</p>
            <p class="text-xs text-indigo-700 mt-0.5">Registra tus datos fiscales y contáctanos — emitimos tu CFDI manualmente.</p>
          </div>
        </div>
        <router-link
          to="/configuracion?tab=facturacion"
          class="flex-shrink-0 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Mis datos fiscales
        </router-link>
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
                Plan / Módulo
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
const cargando = ref(false)

const cargarDatos = async () => {
  cargando.value = true
  try {
    const historialRes = await pagoService.obtenerHistorial()
    pagos.value = historialRes.data || []
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
    // Planes actuales
    base: 'Plan Base',
    completo: 'Plan Completo',
    // Valores legacy almacenados en DB (lowercase)
    basico: 'Plan Básico',
    profesional: 'Plan Profesional',
    premium: 'Plan Premium',
    // Alias legacy
    starter: 'Plan Básico',
    professional: 'Plan Profesional',
    enterprise: 'Plan Premium',
    BASICO: 'Plan Básico',
    PROFESIONAL: 'Plan Profesional',
    PREMIUM: 'Plan Premium',
    // Módulos del marketplace
    email_recordatorios: 'Módulo: Recordatorios Email',
    sms_whatsapp: 'Módulo: SMS/WhatsApp',
    cobros_online: 'Módulo: Cobros en línea',
    reportes_avanzados: 'Módulo: Reportes avanzados',
    usuarios_extra: 'Módulo: Usuarios adicionales',
    multi_sucursal: 'Módulo: Multi-sucursal',
    branding_email: 'Módulo: Branding emails',
    citas_extra: 'Módulo: Citas adicionales',
    servicios_extra: 'Módulo: Servicios adicionales'
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
    // Planes actuales
    base: 'info',
    completo: 'success',
    // Valores legacy almacenados en DB (lowercase)
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
  // Módulos del marketplace → badge morado/indigo
  if (plan && plan.includes('_')) return 'purple'
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
