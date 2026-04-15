<template>
  <DashboardLayout>
    <template #title>
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Dashboard
      </div>
        <span class="text-sm text-slate-500 ml-8 mt-1">Resumen y métricas de tu negocio</span>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else>
      <!-- Guía de configuración (bienvenida + pasos) -->
      <DashboardSetupGuide v-if="!setupGuideCerrado && !todasTareasCompletadas" @close="cerrarSetupGuide" />

      <!-- Acciones Rápidas (movido al inicio) 
      <div class="card bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 mb-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Acciones Rápidas
            </h3>
            <p class="text-slate-600 text-sm">
              Gestiona tu negocio de forma rápida y eficiente
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <router-link to="/appointments" class="btn btn-primary btn-sm">
              + Nueva Cita
            </router-link>
            <router-link to="/clients" class="btn btn-secondary btn-sm">
              + Nuevo Cliente
            </router-link>
            <router-link to="/services" class="btn btn-secondary btn-sm">
              + Nuevo Servicio
            </router-link>
            <router-link to="/reports" class="btn btn-secondary btn-sm flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Reportes
            </router-link>
          </div>
        </div>
      </div>
      -->

      <!-- Grid de Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Citas Hoy -->
        <div class="card-hover transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-600 text-sm font-medium">Citas Hoy</p>
              <p class="text-2xl md:text-3xl font-bold text-slate-900 mt-2">{{ citasHoy.length }}</p>
              <p class="text-xs text-slate-500 mt-1">
                {{ citasHoyPendientes.length }} pendientes
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Clientes -->
        <div class="card-hover transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-600 text-sm font-medium">Total Clientes</p>
              <p class="text-2xl md:text-3xl font-bold text-slate-900 mt-2">{{ clientesStore.clientes.length }}</p>
              <p class="text-xs text-slate-500 mt-1">
                Clientes registrados
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Ingresos del Mes -->
        <div class="card-hover transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-600 text-sm font-medium">Ingresos del Mes</p>
              <p class="text-2xl md:text-3xl font-bold text-slate-900 mt-2">{{ formatearPrecio(ingresosMes) }}</p>
              <p class="text-xs text-slate-500 mt-1">
                {{ citasCompletadasMes.length }} citas completadas
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Servicios Activos -->
        <div class="card-hover transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-600 text-sm font-medium">Servicios Activos</p>
              <p class="text-2xl md:text-3xl font-bold text-slate-900 mt-2">{{ serviciosStore.serviciosActivos.length }}</p>
              <p class="text-xs text-slate-500 mt-1">
                de {{ serviciosStore.servicios.length }} totales
              </p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen de Citas y Límites del Plan -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Citas por Estado -->
        <div class="card">
          <h3 class="text-lg font-bold text-slate-900 mb-4">Resumen de Citas</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Badge variant="warning" class="text-xs">P</Badge>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">Pendientes</p>
                  <p class="text-xs text-slate-600">Por confirmar</p>
                </div>
              </div>
              <p class="text-2xl font-bold text-yellow-900">{{ citasStore.citasPendientes.length }}</p>
            </div>

            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Badge variant="info" class="text-xs">C</Badge>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">Confirmadas</p>
                  <p class="text-xs text-slate-600">Próximas citas</p>
                </div>
              </div>
              <p class="text-2xl font-bold text-blue-900">{{ citasStore.citasConfirmadas.length }}</p>
            </div>

            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Badge variant="success" class="text-xs">✓</Badge>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">Completadas</p>
                  <p class="text-xs text-slate-600">Este mes</p>
                </div>
              </div>
              <p class="text-2xl font-bold text-green-900">{{ citasCompletadasMes.length }}</p>
            </div>
          </div>
        </div>

        <!-- Próximas Citas -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-900">Próximas Citas</h3>
            <router-link to="/appointments" class="text-sm text-blue-600 hover:text-blue-900">
              Ver todas →
            </router-link>
          </div>

          <!-- Empty State -->
          <div v-if="proximasCitas.length === 0" class="text-center py-8">
            <p class="text-slate-500 text-sm">No hay citas próximas</p>
            <router-link to="/appointments" class="btn btn-primary btn-sm mt-4">
              + Crear Cita
            </router-link>
          </div>

          <!-- Lista de próximas citas -->
          <div v-else class="space-y-3">
            <div
              v-for="cita in proximasCitas.slice(0, 5)"
              :key="cita.id"
              class="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              @click="irACita(cita.id)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <Badge :variant="getEstadoVariant(cita.estado)" class="text-xs">
                      {{ ESTADOS_CITA_LABELS[cita.estado] }}
                    </Badge>
                    <span class="text-xs text-slate-500">
                      {{ formatearFechaHora(cita.fechaHora) }}
                    </span>
                  </div>
                  <p class="font-medium text-slate-900 text-sm">
                    {{ formatearNombreCompleto(cita.cliente?.nombre, cita.cliente?.apellidoPaterno, cita.cliente?.apellidoMaterno) }}
                  </p>
                  <p class="text-xs text-slate-600">{{ cita.servicio?.nombre }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-slate-900">{{ formatearPrecio(cita.servicio?.precio) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Widget de Límites del Plan -->
        <PlanLimitsWidget />
      </div>

      <!-- Métricas Detalladas -->
      <div class="mb-8">
        <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Métricas Detalladas
        </h3>

        <!-- Grid de Widgets de Métricas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <IngresosWidget :ingresos="metricasIngresos" :loading="metricasLoading" />
          <CitasWidget :citas="metricasCitas" :loading="metricasLoading" />
          <ServiciosWidget :servicios="metricasServicios" :loading="metricasLoading" />
        </div>

        <!-- Gráfica de Tendencia -->
        <TendenciaGrafica :tendencia="tendenciaSemanal" :loading="metricasLoading" />
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCitasStore } from '../stores/citasStore'
import { useClientesStore } from '../stores/clientesStore'
import { useServiciosStore } from '../stores/serviciosStore'
import { useSuscripcionStore } from '../stores/suscripcionStore'
import { useToast } from '../composables/useToast'
import { useDashboardMetricas } from '../composables/useDashboardMetricas'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import Badge from '../components/common/Badge.vue'
import PlanLimitsWidget from '../components/planes/PlanLimitsWidget.vue'
import IngresosWidget from '../components/dashboard/IngresosWidget.vue'
import CitasWidget from '../components/dashboard/CitasWidget.vue'
import ServiciosWidget from '../components/dashboard/ServiciosWidget.vue'
import TendenciaGrafica from '../components/dashboard/TendenciaGrafica.vue'
import DashboardSetupGuide from '../components/dashboard/DashboardSetupGuide.vue'
import { formatearNombreCompleto, formatearPrecio, formatearFechaHora } from '../utils/formatters'
import { ESTADOS_CITA_LABELS } from '../utils/constants'
import { useBusinessStore } from '../stores/businessStore'

const router = useRouter()
const authStore = useAuthStore()
const citasStore = useCitasStore()
const clientesStore = useClientesStore()
const serviciosStore = useServiciosStore()
const businessStore = useBusinessStore()
const suscripcionStore = useSuscripcionStore()
const toast = useToast()
const {
  metricas,
  loading: metricasLoading,
  error: metricasError,
  ingresos: metricasIngresos,
  citas: metricasCitas,
  servicios: metricasServicios,
  tendenciaSemanal,
  cargarMetricas
} = useDashboardMetricas()

const loading = ref(true)
const setupGuideCerrado = ref(false)

// Computed
const citasHoy = computed(() => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const mañana = new Date(hoy)
  mañana.setDate(mañana.getDate() + 1)

  return citasStore.citas.filter(cita => {
    if (!cita.fechaHora) return false
    const fechaCita = new Date(cita.fechaHora)
    return fechaCita >= hoy && fechaCita < mañana
  })
})

const citasHoyPendientes = computed(() => {
  return citasHoy.value.filter(cita => cita.estado === 'PENDIENTE')
})

const citasCompletadasMes = computed(() => {
  const hoy = new Date()
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59)

  return citasStore.citas.filter(cita => {
    if (!cita.fechaHora || cita.estado !== 'COMPLETADA') return false
    const fechaCita = new Date(cita.fechaHora)
    return fechaCita >= primerDiaMes && fechaCita <= ultimoDiaMes
  })
})

const ingresosMes = computed(() => {
  return citasCompletadasMes.value.reduce((total, cita) => {
    return total + (cita.servicio?.precio || 0)
  }, 0)
})

const proximasCitas = computed(() => {
  const ahora = new Date()

  return citasStore.citas
    .filter(cita => {
      if (!cita.fechaHora) return false
      if (cita.estado === 'CANCELADA' || cita.estado === 'COMPLETADA') return false
      const fechaCita = new Date(cita.fechaHora)
      return fechaCita >= ahora
    })
    .sort((a, b) => {
      return new Date(a.fechaHora) - new Date(b.fechaHora)
    })
})

const tieneContenido = computed(() => {
  return (
    citasStore.citas.length > 0 ||
    clientesStore.clientes.length > 0 ||
    serviciosStore.servicios.length > 0
  )
})

const todasTareasCompletadas = computed(() => {
  return (
    businessStore.negocio?.nombre &&
    businessStore.horarios?.length > 0 &&
    serviciosStore.servicios.length > 0 &&
    clientesStore.clientes.length > 0 &&
    citasStore.citas.length > 0
  )
})

// Métodos
const cerrarSetupGuide = () => {
  setupGuideCerrado.value = true
}

const mostrarNotificacionUpgradeFn = () => {
  // Verificar si el usuario está en plan gratuito
  const planActual = suscripcionStore.suscripcion?.plan?.nombre || 'FREE'
  const upgradeCerrado = localStorage.getItem('dashboard_upgrade_cerrado')

  if (planActual === 'FREE' && upgradeCerrado !== 'true') {
    // Mostrar notificación azul tipo info
    toast.info(
      'Desbloquea más funcionalidades',
      'Mejora tu plan para acceder a clientes y citas ilimitadas, recordatorios automáticos y más.',
      10000 // 10 segundos
    )
    localStorage.setItem('dashboard_upgrade_cerrado', 'true')
  }
}
const getEstadoVariant = (estado) => {
  const variants = {
    PENDIENTE: 'warning',
    CONFIRMADA: 'info',
    COMPLETADA: 'success',
    CANCELADA: 'danger',
  }
  return variants[estado] || 'default'
}

const irACita = (citaId) => {
  router.push('/appointments')
}

// Cargar datos
const cargarDatos = async () => {
  loading.value = true

  try {

    // Usar Promise.allSettled para que si una falla, no afecte a las demás
    const results = await Promise.allSettled([
      citasStore.cargarCitas(),
      clientesStore.cargarClientes(),
      serviciosStore.cargarServicios(),
      businessStore.cargarNegocio(),
      businessStore.cargarHorarios(),
      cargarMetricas()
    ])

    // Verificar si hubo errores de autenticación (el interceptor ya manejó el logout)
    const authErrors = results.filter(r =>
      r.status === 'rejected' &&
      (r.reason?.response?.status === 401 || r.reason?.response?.status === 403)
    )

    if (authErrors.length > 0) {
      return // No mostrar toast, el usuario será redirigido
    }

    // Verificar otros errores
    const otherErrors = results.filter(r => r.status === 'rejected' && !authErrors.includes(r))
    if (otherErrors.length > 0) {
      console.error('[DashboardPage] Errores al cargar datos:', otherErrors)
      toast.error('Error al cargar algunos datos', 'Algunos datos no pudieron ser cargados')
    }
  } catch (error) {
    console.error('[DashboardPage] Error inesperado al cargar datos:', error)
    // No mostrar toast si es error de autenticación
    if (error?.response?.status !== 401 && error?.response?.status !== 403) {
      toast.error('Error al cargar datos', error.message || 'Intenta de nuevo')
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await cargarDatos()

  // Cargar preferencias de localStorage
  const setupGuideCerradoStorage = localStorage.getItem('dashboard_setup_guide_cerrado')
  if (setupGuideCerradoStorage === 'true' && todasTareasCompletadas.value) {
    setupGuideCerrado.value = true
  }

  // Mostrar notificación de upgrade si es plan gratuito
  mostrarNotificacionUpgradeFn()
})
</script>
