<template>
  <DashboardLayout>
    <template #title>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Gestión de Servicios
        </div>
        <span class="text-sm text-slate-500 ml-8 mt-1">Administra los servicios que ofrece tu negocio</span>
      </div>
    </template>

    <template #headerActions>
      <button @click="abrirModalCrear" class="btn btn-primary btn-sm">
        + Nuevo Servicio
      </button>
    </template>
    
    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Buscar servicio
          </label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Buscar por nombre o descripción..."
            @input="aplicarFiltros"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div class="md:col-span-4">
          <Select
            v-model="filtros.estado"
            :options="opcionesEstado"
            @change="aplicarFiltros"
          />
        </div>
        <div class="md:col-span-2">
          <button @click="limpiarFiltros" class="btn btn-secondary w-full">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="serviciosStore.loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="serviciosFiltrados.length === 0 && !filtros.busqueda && filtros.estado === 'todos'"
      title="Sin servicios aún"
      description="Comienza creando tu primer servicio para que tus clientes puedan reservar citas"
    >
      <template #icon>
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </template>
      <template #action>
        <button @click="abrirModalCrear" class="btn btn-primary">
          + Crear Primer Servicio
        </button>
      </template>
    </EmptyState>

    <!-- No results -->
    <EmptyState
      v-else-if="serviciosFiltrados.length === 0"
      title="No se encontraron servicios"
      description="Intenta ajustar los filtros de búsqueda"
    >
      <template #icon>
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </template>
      <template #action>
        <button @click="limpiarFiltros" class="btn btn-secondary">
          Limpiar filtros
        </button>
      </template>
    </EmptyState>

    <!-- Grid de Servicios -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="servicio in serviciosFiltrados"
        :key="servicio.id"
        class="card-hover"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-900 mb-1">{{ servicio.nombre }}</h3>
            <p v-if="servicio.descripcion" class="text-sm text-slate-600 line-clamp-2">
              {{ servicio.descripcion }}
            </p>
          </div>
          <Badge :variant="servicio.activo ? 'success' : 'default'">
            {{ servicio.activo ? 'Activo' : 'Inactivo' }}
          </Badge>
        </div>

        <div class="border-t border-slate-200 pt-4 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-slate-600 text-sm">Precio:</span>
            <span class="font-bold text-slate-900">{{ formatearPrecio(servicio.precio) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-600 text-sm">Duración:</span>
            <span class="font-bold text-slate-900">{{ formatearDuracion(servicio.duracion) }}</span>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            @click="abrirModalEditar(servicio)"
            class="flex-1 btn btn-secondary btn-sm"
          >
            Editar
          </button>
          <button
            @click="confirmarEliminar(servicio)"
            class="flex-1 btn btn-danger btn-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Resumen -->
    <div v-if="serviciosFiltrados.length > 0" class="mt-6 card bg-blue-50 border-blue-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-blue-900 font-medium">Total de servicios</p>
          <p class="text-2xl font-bold text-blue-900">{{ serviciosFiltrados.length }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-blue-900 font-medium">Activos / Inactivos</p>
          <p class="text-2xl font-bold text-blue-900">
            {{ serviciosActivos.length }} / {{ serviciosInactivos.length }}
          </p>
        </div>
      </div>
    </div>

    <!-- Panel lateral Crear/Editar -->
    <SlidePanel
      v-model="modalAbierto"
      :title="modoEdicion ? 'Editar Servicio' : 'Crear Nuevo Servicio'"
      :closable="!guardando"
    >
      <ServiceForm
        ref="serviceFormRef"
        :servicio="servicioSeleccionado"
        :loading="guardando"
        @submit="guardarServicio"
        @cancel="cerrarModal"
      />
    </SlidePanel>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      ref="confirmDialogRef"
      title="Eliminar servicio"
      :message="`¿Estás seguro de que deseas eliminar el servicio '${servicioAEliminar?.nombre}'?`"
      description="Esta acción desactivará el servicio pero no eliminará las citas asociadas."
      confirm-text="Eliminar"
      @confirm="eliminarServicio"
      @cancel="servicioAEliminar = null"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useServiciosStore } from '../stores/serviciosStore'
import { useToast } from '../composables/useToast'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import ServiceForm from '../components/features/ServiceForm.vue'
import SlidePanel from '../components/common/SlidePanel.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import Input from '../components/common/Input.vue'
import Select from '../components/common/Select.vue'
import Badge from '../components/common/Badge.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { formatearPrecio, formatearDuracion } from '../utils/formatters'

const serviciosStore = useServiciosStore()
const toast = useToast()

// Referencias
const serviceFormRef = ref(null)
const confirmDialogRef = ref(null)

// Estado del componente
const modalAbierto = ref(false)
const modoEdicion = ref(false)
const servicioSeleccionado = ref(null)
const servicioAEliminar = ref(null)
const guardando = ref(false)

// Filtros
const filtros = ref({
  busqueda: '',
  estado: 'todos',
})

const opcionesEstado = [
  { value: 'todos', label: 'Todos los servicios' },
  { value: 'activos', label: 'Solo activos' },
  { value: 'inactivos', label: 'Solo inactivos' },
]

// Computed
const serviciosFiltrados = computed(() => {
  let servicios = serviciosStore.servicios

  // Filtrar por estado
  if (filtros.value.estado === 'activos') {
    servicios = serviciosStore.serviciosActivos
  } else if (filtros.value.estado === 'inactivos') {
    servicios = serviciosStore.serviciosInactivos
  }

  // Filtrar por búsqueda
  if (filtros.value.busqueda) {
    const query = filtros.value.busqueda.toLowerCase()
    servicios = servicios.filter(servicio =>
      servicio.nombre.toLowerCase().includes(query) ||
      servicio.descripcion?.toLowerCase().includes(query)
    )
  }

  return servicios
})

const serviciosActivos = computed(() => serviciosStore.serviciosActivos)
const serviciosInactivos = computed(() => serviciosStore.serviciosInactivos)

// Métodos
const cargarServicios = async () => {
  try {
    await serviciosStore.cargarServicios()
  } catch (error) {
    console.error('[ServicesPage] Error al cargar servicios:', error)
    toast.error('Error al cargar servicios', error.message || 'Intenta de nuevo')
  }
}

const aplicarFiltros = () => {
}

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    estado: 'todos',
  }
}

const abrirModalCrear = () => {
  modoEdicion.value = false
  servicioSeleccionado.value = null
  modalAbierto.value = true
}

const abrirModalEditar = (servicio) => {
  modoEdicion.value = true
  servicioSeleccionado.value = { ...servicio }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  modoEdicion.value = false
  servicioSeleccionado.value = null
  guardando.value = false
}

const guardarServicio = async (datos) => {
  guardando.value = true

  try {

    if (modoEdicion.value) {
      await serviciosStore.actualizarServicio(servicioSeleccionado.value.id, datos)
      toast.success('Servicio actualizado', 'El servicio se actualizó correctamente')
    } else {
      await serviciosStore.crearServicio(datos)
      toast.success('Servicio creado', 'El servicio se creó correctamente')
    }

    cerrarModal()
  } catch (error) {
    console.error('[ServicesPage] Error al guardar servicio:', error)
    toast.error(
      'Error al guardar',
      error.message || 'No se pudo guardar el servicio'
    )
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = (servicio) => {
  servicioAEliminar.value = servicio
  confirmDialogRef.value?.open()
}

const eliminarServicio = async () => {
  if (!servicioAEliminar.value) return

  confirmDialogRef.value?.setLoading(true)

  try {
    await serviciosStore.eliminarServicio(servicioAEliminar.value.id)
    toast.success('Servicio eliminado', 'El servicio se desactivó correctamente')
    confirmDialogRef.value?.close()
    servicioAEliminar.value = null
  } catch (error) {
    console.error('[ServicesPage] Error al eliminar servicio:', error)
    toast.error(
      'Error al eliminar',
      error.message || 'No se pudo eliminar el servicio'
    )
  } finally {
    confirmDialogRef.value?.setLoading(false)
  }
}

// Lifecycle
onMounted(() => {
  cargarServicios()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
