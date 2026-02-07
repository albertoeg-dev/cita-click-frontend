<template>
  <DashboardLayout>
    <template #title>
      <button @click="$router.back()" class="text-blue-600 hover:text-blue-800 mr-2">
        ←
      </button>
      👤 Perfil del Cliente
    </template>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Error State -->
    <EmptyState
      v-else-if="error"
      title="Error al cargar perfil"
      :description="error"
    >
      <template #action>
        <button @click="cargarPerfil" class="btn btn-primary">
          Reintentar
        </button>
      </template>
    </EmptyState>

    <!-- Perfil Content -->
    <div v-else-if="perfil" class="space-y-6">
      <!-- Header con información básica -->
      <div class="card">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="flex-shrink-0 h-20 w-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-3xl">
                {{ obtenerIniciales(perfil.nombre, perfil.apellidoPaterno) }}
              </span>
            </div>

            <!-- Información básica -->
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ perfil.nombreCompleto }}
              </h1>
              <div class="mt-2 space-y-1">
                <p v-if="perfil.email" class="text-sm text-gray-600 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ perfil.email }}
                </p>
                <p v-if="perfil.telefono" class="text-sm text-gray-600 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ perfil.telefono }}
                </p>
                <p class="text-xs text-gray-500">
                  Cliente desde {{ formatearFechaCorta(perfil.fechaRegistro) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Notas del cliente -->
          <div v-if="perfil.notas" class="max-w-md">
            <p class="text-sm text-gray-500 mb-1">Notas:</p>
            <p class="text-sm text-gray-700 italic">{{ perfil.notas }}</p>
          </div>
        </div>
      </div>

      <!-- Estadísticas en Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Total citas -->
        <div class="card bg-blue-50 border-blue-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-900 font-medium">Total Citas</p>
              <p class="text-3xl font-bold text-blue-900 mt-1">
                {{ perfil.estadisticas?.totalCitas || 0 }}
              </p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Citas completadas -->
        <div class="card bg-green-50 border-green-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-900 font-medium">Completadas</p>
              <p class="text-3xl font-bold text-green-900 mt-1">
                {{ perfil.estadisticas?.citasCompletadas || 0 }}
              </p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Gasto total -->
        <div class="card bg-purple-50 border-purple-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-purple-900 font-medium">Gasto Total</p>
              <p class="text-3xl font-bold text-purple-900 mt-1">
                {{ formatearPrecio(perfil.estadisticas?.gastoTotal) }}
              </p>
            </div>
            <div class="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Ticket promedio -->
        <div class="card bg-yellow-50 border-yellow-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-yellow-900 font-medium">Ticket Promedio</p>
              <p class="text-3xl font-bold text-yellow-900 mt-1">
                {{ formatearPrecio(perfil.estadisticas?.gastoPromedio) }}
              </p>
            </div>
            <div class="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Fechas importantes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card bg-gray-50">
          <p class="text-sm text-gray-600 font-medium mb-1">Última Cita</p>
          <p class="text-lg font-semibold text-gray-900">
            {{ perfil.estadisticas?.ultimaCita ? formatearFechaHora(perfil.estadisticas.ultimaCita) : 'N/A' }}
          </p>
        </div>
        <div class="card bg-gray-50">
          <p class="text-sm text-gray-600 font-medium mb-1">Próxima Cita</p>
          <p class="text-lg font-semibold text-gray-900">
            {{ perfil.estadisticas?.proximaCita ? formatearFechaHora(perfil.estadisticas.proximaCita) : 'Sin citas programadas' }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
              <span v-if="tab.count !== undefined" :class="[
                activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="mt-6">
          <!-- Tab: Próximas Citas -->
          <div v-if="activeTab === 'proximas'" class="space-y-3">
            <EmptyState
              v-if="!perfil.proximasCitas || perfil.proximasCitas.length === 0"
              title="Sin citas programadas"
              description="Este cliente no tiene citas programadas próximamente"
            />
            <div
              v-else
              v-for="cita in perfil.proximasCitas"
              :key="cita.id"
              class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <Badge :variant="getEstadoVariant(cita.estado)">
                      {{ getEstadoLabel(cita.estado) }}
                    </Badge>
                    <span class="text-sm font-medium text-gray-900">
                      {{ formatearFechaHora(cita.fechaHora) }}
                    </span>
                    <span v-if="cita.esRecurrente" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Recurrente
                    </span>
                  </div>
                  <p class="text-sm text-gray-700">
                    <strong>Servicio:</strong> {{ cita.servicioNombre }}
                  </p>
                  <p class="text-sm text-gray-600">
                    <strong>Precio:</strong> {{ formatearPrecio(cita.precio) }}
                  </p>
                  <p v-if="cita.notas" class="text-xs text-gray-500 mt-1">
                    {{ cita.notas }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Historial -->
          <div v-else-if="activeTab === 'historial'" class="space-y-3">
            <EmptyState
              v-if="!perfil.historialCitas || perfil.historialCitas.length === 0"
              title="Sin historial"
              description="Este cliente no tiene historial de citas"
            />
            <div
              v-else
              v-for="cita in perfil.historialCitas"
              :key="cita.id"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <Badge :variant="getEstadoVariant(cita.estado)">
                      {{ getEstadoLabel(cita.estado) }}
                    </Badge>
                    <span class="text-sm font-medium text-gray-900">
                      {{ formatearFechaHora(cita.fechaHora) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700">
                    <strong>Servicio:</strong> {{ cita.servicioNombre }}
                  </p>
                  <p class="text-sm text-gray-600">
                    <strong>Precio:</strong> {{ formatearPrecio(cita.precio) }}
                  </p>
                  <p v-if="cita.notas" class="text-xs text-gray-500 mt-1">
                    {{ cita.notas }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Servicios Frecuentes -->
          <div v-else-if="activeTab === 'servicios'" class="space-y-3">
            <EmptyState
              v-if="!perfil.serviciosFrecuentes || perfil.serviciosFrecuentes.length === 0"
              title="Sin servicios"
              description="Este cliente no ha usado ningún servicio aún"
            />
            <div
              v-else
              v-for="servicio in perfil.serviciosFrecuentes"
              :key="servicio.servicioId"
              class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ servicio.servicioNombre }}</h3>
                  <p class="text-sm text-gray-600 mt-1">
                    Usado <strong>{{ servicio.cantidadVeces }}</strong> veces
                  </p>
                  <p class="text-sm text-gray-600">
                    Última vez: {{ formatearFechaCorta(servicio.ultimaVez) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-purple-600">
                    {{ formatearPrecio(servicio.gastoTotal) }}
                  </p>
                  <p class="text-xs text-gray-500">Gasto total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import Badge from '../components/common/Badge.vue'
import { formatearPrecio, formatearFechaHora, formatearFechaCorta } from '../utils/formatters'
import { ESTADOS_CITA_LABELS } from '../utils/constants'
import api from '../services/api'

const route = useRoute()
const toast = useToast()

const loading = ref(false)
const error = ref(null)
const perfil = ref(null)
const activeTab = ref('proximas')

const tabs = computed(() => [
  { id: 'proximas', name: 'Próximas Citas', count: perfil.value?.proximasCitas?.length || 0 },
  { id: 'historial', name: 'Historial', count: perfil.value?.historialCitas?.length || 0 },
  { id: 'servicios', name: 'Servicios Frecuentes', count: perfil.value?.serviciosFrecuentes?.length || 0 },
])

const obtenerIniciales = (nombre, apellido) => {
  const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : ''
  const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : ''
  return inicial1 + inicial2
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

const getEstadoLabel = (estado) => {
  return ESTADOS_CITA_LABELS[estado] || estado
}

const cargarPerfil = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get(`/clientes/${route.params.id}/perfil360`)
    perfil.value = response.data.data // Acceder al objeto dentro de ApiResponse
  } catch (err) {
    console.error('[ClientProfile360] Error al cargar perfil:', err)
    error.value = err.message || 'Error al cargar el perfil del cliente'
    toast.error('Error', error.value)
  } finally {
    loading.value = false
  }
}

// Recargar cuando la ventana recupera el foco (usuario vuelve de otra pestaña)
const handleVisibilityChange = () => {
  if (!document.hidden) {
    cargarPerfil()
  }
}

// Watch para recargar cuando cambia el ID del cliente en la ruta
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      cargarPerfil()
    }
  }
)

onMounted(() => {
  cargarPerfil()

  // Agregar listener para recargar cuando la ventana recupera el foco
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  // Remover listener al desmontar
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>
